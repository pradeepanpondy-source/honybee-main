import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import Button from './Button';
import confetti from 'canvas-confetti';

const CartPage: React.FC = () => {
  const { cartItems, getTotal, removeFromCart } = useCart();
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [contactInfo, setContactInfo] = useState({ email: '', signUp: false });
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

  const handleApplyCoupon = () => {
    const upperCoupon = coupon.toUpperCase();
    if (validCoupons[upperCoupon]) {
      setDiscount(validCoupons[upperCoupon]);
      setCouponError('');
      confetti({
        particleCount: 400,
        spread: 160,
        origin: { y: 0.6 },
        startVelocity: 60,
        zIndex: 9999,
      });
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };

  const handlePlaceOrder = () => {
    // Here you would handle order placement logic
    // Removed setOrderPlaced call as state was removed
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
      <input
        type="email"
        name="email"
        value={contactInfo.email}
        onChange={handleContactChange}
        placeholder="Email"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <label className="inline-flex items-center text-sm mb-4">
        <input
          type="checkbox"
          name="signUp"
          checked={contactInfo.signUp}
          onChange={handleContactChange}
          className="form-checkbox text-purple-700"
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
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
        />
        <input
          type="text"
          name="lastName"
          value={shippingAddress.lastName}
          onChange={handleShippingChange}
          placeholder="Last name"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
        />
      </div>
      <input
        type="text"
        name="company"
        value={shippingAddress.company}
        onChange={handleShippingChange}
        placeholder="Company (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <input
        type="text"
        name="address"
        value={shippingAddress.address}
        onChange={handleShippingChange}
        placeholder="Address"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <input
        type="text"
        name="apartment"
        value={shippingAddress.apartment}
        onChange={handleShippingChange}
        placeholder="Apartment, suite, etc. (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <input
        type="text"
        name="city"
        value={shippingAddress.city}
        onChange={handleShippingChange}
        placeholder="City"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <div className="grid grid-cols-3 gap-4 mb-2">
        <select
          name="country"
          value={shippingAddress.country}
          onChange={handleShippingChange}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
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
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
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
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
        />
      </div>
      <input
        type="text"
        name="phone"
        value={shippingAddress.phone}
        onChange={handleShippingChange}
        placeholder="Phone number for shipping updates and offers (optional)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-700"
      />
      <div className="flex justify-between">
        <button onClick={handleBack} className="underline text-purple-700">
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
        <div className="flex space-x-2">
          <input
            id="coupon"
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
          <button onClick={handleApplyCoupon} className="bg-gray-300 px-4 rounded hover:bg-gray-400 transition">
            Apply
          </button>
        </div>
        {couponError && <p className="text-red-600 mt-1">{couponError}</p>}
        {discount > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <div className="flex items-center text-green-800 font-bold mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coupon "{coupon.toUpperCase()}" Applied Successfully!
            </div>
            <div className="text-green-700 text-sm space-y-1">
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
        <button className="bg-white border border-gray-300 rounded flex items-center justify-center py-3 px-6 hover:bg-gray-100 transition">
          <img src="https://5.imimg.com/data5/SELLER/Default/2023/9/348603242/KE/OR/XP/29083784/razorpay-software-250x250.png" alt="Razorpay" className="h-16 w-auto" />
        </button>
      </div>
      <Button onClick={handlePlaceOrder} variant="primary" className="w-full">
        Place Order
      </Button>
      <div className="mt-4 text-xs text-gray-500">
        <p>Refund policy</p>
        <p>Shipping policy</p>
        <p>
          I consent to receive recurring automated marketing by text message through an automatic telephone dialing system. Consent is not a condition to purchase. STOP to cancel. HELP for help. Message and Data rates may apply. View Privacy Policy & TOS
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
