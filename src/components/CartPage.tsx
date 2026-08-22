import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Button from './Button';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, getTotal, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  // Payment processing guard — prevents double-click
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [contactInfo, setContactInfo] = useState({ signUp: false });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    phone: '',
  });
  // Removed unused paymentMethod and orderPlaced states to fix warnings

  const hasOnlySubscriptions = cartItems.every(item => item.name.includes('Subscription Plan'));

  const total = getTotal();
  const discountedTotal = total - (total * discount);

  const validCoupons: Record<string, number> = {
    'HONEY10': 0.10,
    'BEE20': 0.20,
    'OFFER': 0.10,
  };

  const handleApplyCoupon = async () => {
    const upperCoupon = coupon.toUpperCase();

    if (!validCoupons[upperCoupon]) {
      setDiscount(0);
      setCouponError('Invalid coupon code');
      return;
    }

    // Check if user has already used this coupon
    if (user) {
      try {
        const { data: existingOrders, error } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('coupon', upperCoupon);

        if (error) {
          console.error('Error checking coupon usage:', error);
          setCouponError('Error verifying coupon eligibility');
          return;
        }

        if (existingOrders && existingOrders.length > 0) {
          setCouponError('You have already used this coupon.');
          setDiscount(0);
          return;
        }
      } catch (err) {
        console.error('Error in coupon check', err);
        setCouponError('Error verifying coupon');
        return;
      }
    }

    setDiscount(validCoupons[upperCoupon]);
    setCouponError('');
    setCouponApplied(true);
    confetti({
      particleCount: 400,
      spread: 160,
      origin: { y: 0.6 },
      startVelocity: 60,
      zIndex: 9999,
    });
  };

  const handlePlaceOrder = async () => {
    console.log('[CartPage] handlePlaceOrder initialized');
    if (isProcessing) {
      console.log('[CartPage] Already processing payment, ignoring duplicate click');
      return;
    }
    if (!user) {
      console.warn('[CartPage] Place order failed: user not logged in');
      alert('Please log in to place an order.');
      return;
    }
    if (cartItems.length === 0) {
      console.warn('[CartPage] Place order failed: cart is empty');
      alert('Your cart is empty.');
      return;
    }

    const amountInPaise = Math.round(discountedTotal * 100);
    if (amountInPaise < 100) {
      console.warn('[CartPage] Place order failed: amount below minimum (₹1)', amountInPaise);
      alert('Order amount must be at least ₹1.00');
      return;
    }

    // Generate receipt number
    const d = new Date();
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    const receiptNumber = `BB-${dateStr}-${rand}`;

    setIsProcessing(true);
    setPaymentError('');

    console.log('[CartPage] Initiating backend order creation...', { amountInPaise, receiptNumber });

    try {
      // STEP 1 — Create Razorpay order on backend
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt: receiptNumber }),
      });
      const orderDataApi = await res.json();

      console.log('[CartPage] Backend order creation response:', orderDataApi);

      if (!res.ok) {
        throw new Error(orderDataApi.error || 'Failed to create order');
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

            // STEP 4 — Signature valid → save order
            await saveOrderToDatabase(receiptNumber, response.razorpay_payment_id);
          } catch (err: any) {
            console.error('[CartPage] Verification error:', err);
            setPaymentError('Payment verification encountered an error. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name:    user.name || user.email?.split('@')[0] || 'Customer',
          email:   user.email ?? '',
          contact: shippingAddress.phone || '',
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
      console.error('[CartPage] Error initiating payment:', error);
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

    // Estimate delivery: 5–7 business days
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 7);
    const estimatedDelivery = delivery.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    try {
      const customerName = shippingAddress.firstName 
        ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() 
        : (user?.name || user?.email?.split('@')[0] || 'Customer');

      const discountAmount = total * discount;

      for (const sellerId in ordersBySeller) {
        const sellerItems  = ordersBySeller[sellerId];
        const sellerTotal  = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const sellerDisc   = (sellerTotal / total) * discountAmount;
        const sellerFinal  = sellerTotal - sellerDisc;

        const validSellerId =
          sellerId && sellerId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            ? sellerId
            : null;

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id:          user?.id,
            seller_id:        validSellerId,
            total:            sellerTotal,
            discounted_total: discount > 0 ? sellerFinal : undefined,
            coupon:           discount > 0 ? coupon.toUpperCase() : undefined,
            discount:         discount > 0 ? sellerDisc / sellerTotal : undefined,
            status:           'paid', // Mark as paid since Razorpay succeeded
            customer_email:   user?.email,
            customer_name:    customerName,
            order_data:       sellerItems,
          })
          .select()
          .single();

        if (orderError) throw orderError;

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

      // Decrement stock for valid products in Supabase
      for (const item of cartItems) {
        if (!item.id.startsWith('default-') && item.id !== 'beehive-starter-kit') {
          // Fire and forget stock update (might be restricted by RLS but we try)
          supabase
            .rpc('decrement_stock', { p_id: item.id, qty: item.quantity })
            .then(({ error }) => {
              if (error) {
                 // Fallback to direct update if RPC doesn't exist
                 supabase.from('products')
                   .select('stock')
                   .eq('id', item.id)
                   .single()
                   .then(({ data }) => {
                     if (data) {
                       supabase.from('products')
                         .update({ stock: Math.max(0, data.stock - item.quantity) })
                         .eq('id', item.id)
                         .then();
                     }
                   });
              }
            });
        }
      }

      clearCart();

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      setIsProcessing(false);
      navigate('/my-orders');

    } catch (error: any) {
      console.error('[CartPage] DB save error:', error);
      setPaymentError(`Payment successful but order save failed: ${error.message}. Contact support with payment ID: ${paymentId}`);
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (hasOnlySubscriptions) {
      if (step < 3) setStep(step + 1);
    } else {
      if (step < 4) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderExpressCheckout = () => null;

  const renderContactInformation = () => (
    <div>
      <h3 className="font-semibold mb-2">Contact information</h3>
      <div className="mb-2">
        <input
          type="email"
          name="email"
          value={user?.email || ''}
          readOnly
          className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Logged in as {user?.email}</p>
      </div>
      <label className="inline-flex items-center text-sm mb-4">
        <input
          type="checkbox"
          name="signUp"
          checked={contactInfo.signUp}
          onChange={handleContactChange}
          className="form-checkbox text-honeybee-primary"
        />
        <span className="ml-2">Sign up for exclusive offers and news via text messages & email.</span>
      </label>
      <div className="flex justify-between">
        <button onClick={handleNext} className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
          {hasOnlySubscriptions ? 'Continue to payment' : 'Continue to shipping'}
        </button>
      </div>
    </div>
  );

  const renderShippingAddress = () => (
    <div>
      <h3 className="font-semibold mb-2">Shipping address</h3>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <input
          type="text"
          name="firstName"
          value={shippingAddress.firstName}
          onChange={handleShippingChange}
          placeholder="First name"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
        />
        <input
          type="text"
          name="lastName"
          value={shippingAddress.lastName}
          onChange={handleShippingChange}
          placeholder="Last name"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
        />
      </div>
      <input
        type="text"
        name="company"
        value={shippingAddress.company}
        onChange={handleShippingChange}
        placeholder="Company (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
      />
      <input
        type="text"
        name="address"
        value={shippingAddress.address}
        onChange={handleShippingChange}
        placeholder="Address"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
      />
      <input
        type="text"
        name="apartment"
        value={shippingAddress.apartment}
        onChange={handleShippingChange}
        placeholder="Apartment, suite, etc. (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
      />
      <input
        type="text"
        name="city"
        value={shippingAddress.city}
        onChange={handleShippingChange}
        placeholder="City"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
      />
      <div className="grid grid-cols-3 gap-4 mb-2">
        <select
          name="country"
          value={shippingAddress.country}
          onChange={handleShippingChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
        >
          <option value="">Country/region</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          {/* Add more countries as needed */}
        </select>
        <select
          name="state"
          value={shippingAddress.state}
          onChange={handleShippingChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
        >
          <option value="">State</option>
          <option value="State">State</option>
          {/* Add more states as needed */}
        </select>
        <input
          type="text"
          name="zip"
          value={shippingAddress.zip}
          onChange={handleShippingChange}
          placeholder="ZIP code"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
        />
      </div>
      <input
        type="text"
        name="phone"
        value={shippingAddress.phone}
        onChange={handleShippingChange}
        placeholder="Phone number for shipping updates and offers (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
      />
      <div className="flex justify-between">
        <button onClick={handleBack} className="underline text-honeybee-primary">
          Return to cart
        </button>
        <button onClick={handleNext} className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition">
          Choose shipping method
        </button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div>
      <h3 className="font-semibold mb-2">Payment</h3>
      <div className="mb-4">
        <label htmlFor="coupon" className="block font-semibold mb-1">Gift card or discount code</label>
        <div className="flex flex-col gap-2">
          <input
            id="coupon"
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            disabled={couponApplied}
            placeholder="Enter coupon code"
            className={`flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-honeybee-primary ${couponApplied ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          {!couponApplied && (
            <button onClick={handleApplyCoupon} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition w-full md:w-auto self-start">
              Apply
            </button>
          )}
        </div>
        {couponError && <p className="text-red-600 mt-1">{couponError}</p>}
        {couponApplied && discount > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <div className="flex items-center text-green-800 font-bold mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              🎉 Offer Applied Successfully!
            </div>
            <div className="text-green-700 text-sm space-y-1">
              <p className="flex justify-between">
                <span>Coupon:</span>
                <span className="font-bold">{coupon.toUpperCase()}</span>
              </p>
              <p className="flex justify-between">
                <span>Savings:</span>
                <span className="font-bold">-₹{(total * discount).toFixed(2)}</span>
              </p>
              <div className="border-t border-green-200 my-2"></div>
              <p className="flex justify-between text-base font-bold text-green-900">
                <span>Total to pay:</span>
                <span>₹{discountedTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <p className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </p>
        <p className="flex justify-between font-semibold">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </p>
        <p className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{discountedTotal.toFixed(2)}</span>
        </p>
      </div>
      <div className="flex justify-center mb-4">
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className={`bg-white border border-gray-300 rounded flex items-center justify-center py-3 px-6 hover:bg-gray-100 transition w-full ${isProcessing ? 'opacity-65 cursor-not-allowed' : ''}`}
        >
          <img src="https://5.imimg.com/data5/SELLER/Default/2023/9/348603242/KE/OR/XP/29083784/razorpay-software-250x250.png" alt="Razorpay" className="h-16 w-auto" />
        </button>
      </div>
      {paymentError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <span className="text-red-500 mt-0.5">⚠</span>
          <span>{paymentError}</span>
        </div>
      )}
      <Button
        onClick={handlePlaceOrder}
        variant="primary"
        className={`w-full ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? '⏳ Processing Payment…' : '🔒 Pay with Razorpay'}
      </Button>
      <div className="mt-4 text-xs text-gray-500">
        <p>Refund policy</p>
        <p>Shipping policy</p>
        <p>
          I consent to receive recurring automated marketing by text message through an automatic telephone dialing system. Consent is not a condition to purchase. STOP to cancel. HELP for help. Message and Data rates may apply. View Privacy Policy &amp; TOS
        </p>
        <p>Terms of service</p>
      </div>
    </div>
  );

  const renderCartSummary = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-semibold mb-4">Your cart</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center space-x-4 mb-4">
              {!item.name.includes('Subscription Plan') && (
                <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover rounded" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
            <span>Total</span>
            <span>₹{discountedTotal.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <nav className="text-sm mb-6">
            <ol className="list-reset flex text-gray-600 space-x-2">
              <li>Cart {'>'}</li>
              <li className={step === 1 ? 'font-bold' : ''}>Information {'>'}</li>
              {!hasOnlySubscriptions && <li className={step === 2 ? 'font-bold' : ''}>Shipping {'>'}</li>}
              <li className={step === (hasOnlySubscriptions ? 2 : 3) ? 'font-bold' : ''}>Payment</li>
            </ol>
          </nav>
          {step === 1 && (
            <>
              {renderExpressCheckout()}
              <hr className="my-4" />
              {renderContactInformation()}
            </>
          )}
          {step === 2 && !hasOnlySubscriptions && renderShippingAddress()}
          {step === 2 && hasOnlySubscriptions && renderPayment()}
          {step === 3 && !hasOnlySubscriptions && renderPayment()}
        </div>
        <div className="md:col-span-1">{renderCartSummary()}</div>
      </div>
    </>
  );
};

export default CartPage;
