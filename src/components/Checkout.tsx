import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import OrderReceipt, { ReceiptData } from './OrderReceipt';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { CartItem } from '../context/CartContext';

const validCoupons: Record<string, number> = {
  'HONEY10': 0.10,
  'BEE20':   0.20,
  'OFFER':   0.10,
};

/** Generate a receipt number: BB-YYYYMMDD-XXXXX */
const generateReceiptNumber = () => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `BB-${date}-${rand}`;
};

const Checkout: React.FC = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon]         = useState('');
  const [discount, setDiscount]     = useState(0);
  const [couponError, setCouponError] = useState('');

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus]   = useState<'idle' | 'sent' | 'error'>('idle');

  // Payment processing guard — prevents double-click
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const total           = getTotal();
  const discountAmount  = total * discount;
  const discountedTotal = total - discountAmount;

  // ── Coupon ─────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const upperCoupon = coupon.toUpperCase();
    if (!validCoupons[upperCoupon]) {
      setDiscount(0);
      setCouponError('Invalid coupon code');
      return;
    }

    if (user) {
      try {
        const { data: existingOrders, error } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('coupon', upperCoupon);

        if (error) { setCouponError('Error verifying coupon eligibility'); return; }
        if (existingOrders && existingOrders.length > 0) {
          setCouponError('You have already used this coupon.');
          setDiscount(0);
          return;
        }
      } catch {
        setCouponError('Error verifying coupon');
        return;
      }
    }

    setDiscount(validCoupons[upperCoupon]);
    setCouponError('');
    confetti({ particleCount: 400, spread: 160, origin: { y: 0.6 }, startVelocity: 60, zIndex: 9999 });
  };

  // ── Send receipt email ────────────────────────────────────
  const sendReceiptEmail = async (receipt: ReceiptData) => {
    setEmailSending(true);
    try {
      const res = await fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId:        receipt.orderId,
          receiptNumber:  receipt.receiptNumber,
          orderDate:      receipt.orderDate,
          customerName:   receipt.customerName,
          customerEmail:  receipt.customerEmail,
          items:          receipt.items,
          subtotal:       receipt.subtotal,
          discount:       receipt.discount,
          couponCode:     receipt.couponCode,
          tax:            receipt.tax,
          shippingCharge: receipt.shippingCharge,
          grandTotal:     receipt.grandTotal,
          paymentMethod:  receipt.paymentMethod,
          orderStatus:    receipt.orderStatus,
          estimatedDelivery: receipt.estimatedDelivery,
        }),
      });
      if (res.ok) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('error');
      }
    } catch {
      setEmailStatus('error');
    } finally {
      setEmailSending(false);
    }
  };

  // ── Place order ────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (isProcessing) return;                        // double-click guard
    if (!user) { alert('Please log in to place an order.'); return; }
    if (cartItems.length === 0) { alert('Your cart is empty.'); return; }

    // Double-check coupon before placing
    if (discount > 0 && coupon) {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('coupon', coupon.toUpperCase());
      if (existing && existing.length > 0) {
        alert('Coupon already used. Please remove it or use another.');
        return;
      }
    }

    const amountInPaise = Math.round(discountedTotal * 100);
    if (amountInPaise < 100) {
      alert('Order amount must be at least ₹1.00');
      return;
    }

    const receiptNumber = generateReceiptNumber();
    setIsProcessing(true);
    setPaymentError('');

    try {
      // STEP 1 — Create Razorpay order on backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt: receiptNumber }),
      });
      const orderDataApi = await res.json();

      if (!res.ok) {
        throw new Error(orderDataApi.error || 'Failed to create payment order.');
      }

      // STEP 2 — Open Razorpay checkout modal
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      orderDataApi.amount,
        currency:    orderDataApi.currency,
        name:        'Bee Bridge',
        description: 'Pure Honey Order',
        order_id:    orderDataApi.order_id,
        handler: async function (response: any) {
          // STEP 3 — Verify signature on backend
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              setPaymentError(`Payment verification failed: ${verifyData.error}`);
              setIsProcessing(false);
              return;
            }

            // STEP 4 — Signature valid → save order & show receipt
            await saveOrderToDatabase(receiptNumber, response.razorpay_payment_id);
          } catch (err: any) {
            console.error('[Checkout] Verification error:', err);
            setPaymentError('Payment verification encountered an error. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name:  user.name || user.email?.split('@')[0] || 'Customer',
          email: user.email ?? '',
        },
        theme: { color: '#f5a623' },
        modal: {
          ondismiss: () => {
            setPaymentError('Payment was cancelled. You can try again anytime.');
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setPaymentError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error: any) {
      console.error('[Checkout] Error initiating payment:', error);
      setPaymentError(error.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const saveOrderToDatabase = async (receiptNumber: string, paymentId: string) => {
    // Group by seller
    const ordersBySeller = cartItems.reduce((acc, item) => {
      const sid = item.seller_id;
      if (!acc[sid]) acc[sid] = [];
      acc[sid].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    // Estimate delivery: 5–7 business days
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 7);
    const estimatedDelivery = delivery.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    try {
      const createdOrderIds: string[] = [];
      const customerName = user?.name || user?.email?.split('@')[0] || 'Customer';

      for (const sellerId in ordersBySeller) {
        const sellerItems  = ordersBySeller[sellerId];
        const sellerTotal  = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const sellerDisc   = (sellerTotal / total) * discountAmount;
        const sellerFinal  = sellerTotal - sellerDisc;

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id:          user?.id,
            seller_id:        sellerId,
            total:            sellerTotal,
            discounted_total: discount > 0 ? sellerFinal : undefined,
            coupon:           discount > 0 ? coupon.toUpperCase() : undefined,
            discount:         discount > 0 ? sellerDisc / sellerTotal : undefined,
            status:           'paid',
            customer_email:   user?.email,
            customer_name:    customerName,
          })
          .select()
          .single();

        if (orderError) throw orderError;
        createdOrderIds.push(orderData.id);

        // Insert order items
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(sellerItems.map(item => ({
            order_id:   orderData.id,
            product_id: item.id,
            name:       item.name,
            price:      item.price,
            quantity:   item.quantity,
          })));

        if (itemsError) throw itemsError;
      }

      // Build receipt data for display
      const receipt: ReceiptData = {
        receiptNumber,
        orderId:          createdOrderIds.join(', '),
        orderDate,
        customerName,
        customerEmail:    user?.email ?? '',
        items:            cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        subtotal:         total,
        discount:         discountAmount,
        couponCode:       discount > 0 ? coupon.toUpperCase() : undefined,
        tax:              0,
        shippingCharge:   0,
        grandTotal:       discountedTotal,
        paymentMethod:    'Razorpay Online',
        paymentStatus:    'paid',
        orderStatus:      'paid',
        estimatedDelivery,
      };

      clearCart();
      setReceiptData(receipt);
      setOrderPlaced(true);
      setIsProcessing(false);

      // Confetti celebration
      const end = Date.now() + 3000;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
      const iv: any = setInterval(() => {
        const left = end - Date.now();
        if (left <= 0) return clearInterval(iv);
        const pc = 50 * (left / 3000);
        confetti({ ...defaults, particleCount: pc, origin: { x: rnd(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount: pc, origin: { x: rnd(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      // Auto-send receipt email (fire-and-forget; don't block UI)
      sendReceiptEmail(receipt);

    } catch (error: any) {
      console.error('[Checkout] DB save error:', error);
      setPaymentError(`Payment was successful but order save failed: ${error.message}. Please contact support with payment ID: ${paymentId}`);
      setIsProcessing(false);
    }
  };

  // ── Receipt view ───────────────────────────────────────────
  if (orderPlaced && receiptData) {
    return (
      <>
        {/* Email status toast */}
        {emailStatus === 'sent' && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fadeIn">
            ✅ Receipt emailed to {receiptData.customerEmail}
          </div>
        )}
        {emailStatus === 'error' && (
          <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fadeIn">
            ⚠ Email delivery failed — please use the button below to resend.
          </div>
        )}

        <OrderReceipt
          data={receiptData}
          onClose={() => navigate('/my-orders')}
          onEmailResend={() => sendReceiptEmail(receiptData)}
          emailSending={emailSending}
        />
      </>
    );
  }

  // ── Checkout form ──────────────────────────────────────────
  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-honeybee-background text-honeybee-secondary rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-honeybee-primary mb-6">Checkout</h2>

        {/* Contact */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="font-semibold mb-4 text-lg">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Logged in as {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-2 text-sm md:text-base">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-gray-300 pt-2 text-sm md:text-base">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <>
              <div className="flex justify-between font-bold text-green-600 pt-2 text-sm md:text-base">
                <span>Discount:</span>
                <span>−₹{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-300 pt-2 text-sm md:text-base">
                <span>Amount to Pay:</span>
                <span>₹{discountedTotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Coupon */}
        <div className="mb-4">
          <label htmlFor="coupon" className="block font-semibold mb-1">Have a coupon?</label>
          <div className="flex flex-col gap-2">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              disabled={discount > 0}
              className={`border border-gray-300 rounded px-3 py-3 w-full text-base ${discount > 0 ? 'bg-gray-100' : ''}`}
              placeholder="Enter coupon code"
            />
            {!discount && (
              <Button onClick={handleApplyCoupon} variant="accent" className="w-full md:w-auto self-start">
                Apply Coupon
              </Button>
            )}
          </div>
          {couponError && <p className="text-red-600 mt-1 text-sm">{couponError}</p>}
          {discount > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <div className="flex items-center text-green-800 font-bold mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Coupon "{coupon.toUpperCase()}" Applied!
              </div>
              <div className="text-green-700 text-sm space-y-1">
                <p className="flex justify-between"><span>Savings:</span><span className="font-bold">−₹{discountAmount.toFixed(2)}</span></p>
                <div className="border-t border-green-200 my-2" />
                <p className="flex justify-between text-base font-bold text-green-900">
                  <span>Total to pay:</span><span>₹{discountedTotal.toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Place Order */}
        {paymentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <span className="text-red-500 mt-0.5">⚠</span>
            <span>{paymentError}</span>
          </div>
        )}
        <Button
          onClick={handlePlaceOrder}
          variant="primary"
          className={`w-full py-3 text-base ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={isProcessing}
        >
          {isProcessing ? '⏳ Processing Payment…' : '🔒 Pay with Razorpay'}
        </Button>
        <p className="text-xs text-gray-400 text-center mt-2">
          A receipt will be emailed to {user?.email} after order confirmation.
        </p>
      </div>
    </>
  );
};

export default Checkout;
