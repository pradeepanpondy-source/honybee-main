import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import OrderReceipt, { ReceiptData } from './OrderReceipt';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

const SHIPPING_FEE = 199; // ₹199 flat shipping

const validCoupons: Record<string, number> = {
  'HONEY10': 0.10,
  'BEE20':   0.20,
  'OFFER':   0.10,
};

const generateReceiptNumber = () => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `BB-${date}-${rand}`;
};

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-honeybee-primary/50 focus:border-honeybee-primary transition';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const Checkout: React.FC = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Shipping address fields ──────────────────────────────
  const [fullName,     setFullName]     = useState(user?.name || '');
  const [phone,        setPhone]        = useState('');
  const [addressLine,  setAddressLine]  = useState('');
  const [city,         setCity]         = useState('');
  const [stateName,    setStateName]    = useState('');
  const [pincode,      setPincode]      = useState('');

  // ── Coupon ───────────────────────────────────────────────
  const [coupon,       setCoupon]       = useState('');
  const [discount,     setDiscount]     = useState(0);
  const [couponError,  setCouponError]  = useState('');

  // ── UI state ─────────────────────────────────────────────
  const [orderPlaced,   setOrderPlaced]  = useState(false);
  const [receiptData,   setReceiptData]  = useState<ReceiptData | null>(null);
  const [emailSending,  setEmailSending] = useState(false);
  const [emailStatus,   setEmailStatus]  = useState<'idle' | 'sent' | 'error'>('idle');
  const [isProcessing,  setIsProcessing] = useState(false);
  const [paymentError,  setPaymentError] = useState('');

  // ── Price breakdown ──────────────────────────────────────
  const subtotal           = getTotal();
  const discountAmount     = subtotal * discount;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingCharge     = SHIPPING_FEE;
  const grandTotal         = discountedSubtotal + shippingCharge;

  const shippingAddress = [addressLine.trim(), city.trim(), stateName.trim(), pincode.trim()]
    .filter(Boolean)
    .join(', ');

  // ── Coupon handler ───────────────────────────────────────
  const handleApplyCoupon = async () => {
    const upper = coupon.toUpperCase();
    if (!validCoupons[upper]) {
      setDiscount(0); setCouponError('Invalid coupon code'); return;
    }
    if (user) {
      const { data: used } = await supabase
        .from('orders').select('id').eq('user_id', user.id).eq('coupon', upper);
      if (used && used.length > 0) {
        setCouponError('You have already used this coupon.'); setDiscount(0); return;
      }
    }
    setDiscount(validCoupons[upper]);
    setCouponError('');
    confetti({ particleCount: 400, spread: 160, origin: { y: 0.6 }, startVelocity: 60, zIndex: 9999 });
  };

  // ── Send receipt email ───────────────────────────────────
  const sendReceiptEmail = async (receipt: ReceiptData) => {
    setEmailSending(true);
    try {
      const res = await fetch('/api/send-receipt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: receipt.orderId, receiptNumber: receipt.receiptNumber,
          orderDate: receipt.orderDate, customerName: receipt.customerName,
          customerEmail: receipt.customerEmail, items: receipt.items,
          subtotal: receipt.subtotal, discount: receipt.discount,
          couponCode: receipt.couponCode, tax: receipt.tax,
          shippingCharge: receipt.shippingCharge, grandTotal: receipt.grandTotal,
          paymentMethod: receipt.paymentMethod, orderStatus: receipt.orderStatus,
          estimatedDelivery: receipt.estimatedDelivery,
        }),
      });
      setEmailStatus(res.ok ? 'sent' : 'error');
    } catch { setEmailStatus('error'); }
    finally { setEmailSending(false); }
  };

  // ── Place order (main flow) ──────────────────────────────
  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    if (!user) { alert('Please log in to place an order.'); return; }
    if (cartItems.length === 0) { alert('Your cart is empty.'); return; }

    // Validate address
    if (!fullName.trim()) { setPaymentError('Please enter your full name.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setPaymentError('Please enter a valid 10-digit Indian mobile number.'); return;
    }
    if (!addressLine.trim()) { setPaymentError('Please enter your street/house address.'); return; }
    if (!city.trim()) { setPaymentError('Please enter your city.'); return; }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPaymentError('Please enter a valid 6-digit pincode.'); return;
    }

    // Double-check coupon before charge
    if (discount > 0 && coupon) {
      const { data: used } = await supabase
        .from('orders').select('id').eq('user_id', user.id).eq('coupon', coupon.toUpperCase());
      if (used && used.length > 0) { alert('Coupon already used. Please remove it.'); return; }
    }

    const amountInPaise = Math.round(grandTotal * 100);
    if (amountInPaise < 100) { alert('Order amount must be at least ₹1.00'); return; }

    const receiptNumber = generateReceiptNumber();
    setIsProcessing(true);
    setPaymentError('');

    try {
      // STEP 1 — Create Razorpay order on backend
      const createRes = await fetch('/api/create-order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt: receiptNumber }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || 'Failed to create payment order.');

      // STEP 2 — Open Razorpay modal
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      createData.amount,
        currency:    createData.currency,
        name:        'Bee Bridge',
        description: 'Honey Order',
        order_id:    createData.order_id,
        prefill:     { name: fullName, email: user.email ?? '', contact: phone },
        theme:       { color: '#f5a623' },
        modal: {
          ondismiss: () => { setPaymentError('Payment was cancelled. You can try again anytime.'); setIsProcessing(false); },
        },
        handler: async (response: any) => {
          try {
            // STEP 3 — Save order server-side (re-verifies signature, idempotent, service_role)
            const saveRes = await fetch('/api/save-order', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                user_id:             user.id,
                user_email:          user.email,
                customer_name:       fullName,
                customer_phone:      phone,
                shipping_address:    shippingAddress,
                cart_items:          cartItems,
                subtotal,
                shipping_charge:     shippingCharge,
                discount_amount:     discountAmount,
                coupon:              discount > 0 ? coupon.toUpperCase() : null,
                grand_total:         grandTotal,
                receipt_number:      receiptNumber,
              }),
            });
            const saveData = await saveRes.json();

            if (!saveRes.ok || !saveData.success) {
              setPaymentError(
                `Payment successful but order save failed: ${saveData.error || 'Unknown error'}. ` +
                `Contact support with payment ID: ${response.razorpay_payment_id}`
              );
              setIsProcessing(false);
              return;
            }

            // STEP 4 — Build receipt and show it
            const orderDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
            const del = new Date(); del.setDate(del.getDate() + 7);
            const estimatedDelivery = del.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

            const receipt: ReceiptData = {
              receiptNumber,
              orderId:           saveData.order?.id || saveData.orderIds?.[0] || receiptNumber,
              orderDate,
              customerName:      fullName,
              customerEmail:     user.email,
              customerPhone:     phone,
              shippingAddress,
              items:             cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
              subtotal,
              discount:          discountAmount,
              couponCode:        discount > 0 ? coupon.toUpperCase() : undefined,
              tax:               0,
              shippingCharge,
              grandTotal,
              paymentMethod:     'Razorpay Online',
              paymentStatus:     'paid',
              orderStatus:       'paid',
              estimatedDelivery,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId:   response.razorpay_order_id,
            };

            clearCart();
            setReceiptData(receipt);
            setOrderPlaced(true);
            setIsProcessing(false);

            // Confetti
            const end = Date.now() + 3000;
            const defs = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const rnd = (a: number, b: number) => Math.random() * (b - a) + a;
            const iv: any = setInterval(() => {
              const left = end - Date.now();
              if (left <= 0) return clearInterval(iv);
              const pc = 50 * (left / 3000);
              confetti({ ...defs, particleCount: pc, origin: { x: rnd(0.1, 0.3), y: Math.random() - 0.2 } });
              confetti({ ...defs, particleCount: pc, origin: { x: rnd(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            sendReceiptEmail(receipt);
          } catch (err: any) {
            console.error('[Checkout] save-order error:', err);
            setPaymentError('Payment successful but an error occurred saving your order. Please contact support.');
            setIsProcessing(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        setPaymentError(`Payment failed: ${r.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error('[Checkout] initiation error:', err);
      setPaymentError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  // ── Receipt screen ───────────────────────────────────────
  if (orderPlaced && receiptData) {
    return (
      <>
        {emailStatus === 'sent' && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold">
            ✅ Receipt emailed to {receiptData.customerEmail}
          </div>
        )}
        {emailStatus === 'error' && (
          <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold">
            ⚠ Email delivery failed — use the button below to resend.
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

  // ── Checkout form ────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-honeybee-background text-honeybee-secondary rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-honeybee-primary mb-6">Checkout</h2>

      {/* ── Contact & Address ─────────────────────── */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <h3 className="font-semibold mb-4 text-lg">Delivery Information</h3>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className={labelCls}>Email</label>
          <input type="email" value={user?.email || ''} readOnly
            className={`${inputCls} bg-gray-100 text-gray-500 cursor-not-allowed`} />
          <p className="text-xs text-gray-400 mt-1">Logged in as {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="As on ID / delivery label" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="10-digit mobile number" maxLength={10} className={inputCls} />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Street / House Address <span className="text-red-500">*</span></label>
          <input type="text" value={addressLine} onChange={e => setAddressLine(e.target.value)}
            placeholder="House no., street name, area" className={inputCls} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelCls}>City <span className="text-red-500">*</span></label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)}
              placeholder="City" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input type="text" value={stateName} onChange={e => setStateName(e.target.value)}
              placeholder="State" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Pincode <span className="text-red-500">*</span></label>
            <input type="text" value={pincode} onChange={e => setPincode(e.target.value)}
              placeholder="6-digit pincode" maxLength={6} className={inputCls} />
          </div>
        </div>
      </div>

      {/* ── Order Summary ─────────────────────────── */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <h3 className="font-semibold mb-3 text-lg">Order Summary</h3>
        <div className="space-y-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount {coupon && `(${coupon.toUpperCase()})`}</span>
              <span className="font-semibold">−₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span className="font-medium">₹{shippingCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
            <span>Grand Total</span>
            <span className="text-honeybee-primary">₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ── Coupon ────────────────────────────────── */}
      <div className="mb-6">
        <label htmlFor="coupon" className="block font-semibold mb-2">Have a coupon?</label>
        <div className="flex gap-2">
          <input
            id="coupon" type="text" value={coupon}
            onChange={e => setCoupon(e.target.value)}
            disabled={discount > 0}
            placeholder="Enter coupon code"
            className={`${inputCls} flex-1 ${discount > 0 ? 'bg-gray-100' : ''}`}
          />
          {!discount && (
            <Button onClick={handleApplyCoupon} variant="accent" className="whitespace-nowrap">
              Apply
            </Button>
          )}
        </div>
        {couponError && <p className="text-red-600 text-sm mt-1">{couponError}</p>}
        {discount > 0 && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✅ Coupon <strong>{coupon.toUpperCase()}</strong> applied — saving ₹{discountAmount.toFixed(2)}
          </div>
        )}
      </div>

      {/* ── Payment info box ──────────────────────── */}
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <p className="font-semibold mb-1">💳 You will be charged: <span className="text-honeybee-primary text-base font-black">₹{grandTotal.toFixed(2)}</span></p>
        <p className="text-xs text-amber-600">Includes ₹{shippingCharge} shipping {discountAmount > 0 && `and −₹${discountAmount.toFixed(2)} discount`}</p>
      </div>

      {/* ── Error ─────────────────────────────────── */}
      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
          <span>{paymentError}</span>
        </div>
      )}

      {/* ── Pay button ────────────────────────────── */}
      <Button
        onClick={handlePlaceOrder}
        variant="primary"
        className={`w-full py-3 text-base ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? '⏳ Processing Payment…' : `🔒 Pay ₹${grandTotal.toFixed(2)} with Razorpay`}
      </Button>
      <p className="text-xs text-gray-400 text-center mt-2">
        Secured by Razorpay · Receipt will be emailed to {user?.email}
      </p>
    </div>
  );
};

export default Checkout;
