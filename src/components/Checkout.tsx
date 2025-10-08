import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import Button from './Button';
import successGif from '../assets/success confetti.gif';

const validCoupons: Record<string, number> = {
  'HONEY10': 0.10,
  'BEE20': 0.20,
  'OFFER': 0.10,
};

const Checkout: React.FC = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = getTotal();
  const discountedTotal = total - (total * discount);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleApplyCoupon = () => {
    const upperCoupon = coupon.toUpperCase();
    if (validCoupons[upperCoupon]) {
      setDiscount(validCoupons[upperCoupon]);
      setCouponError('');
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };

  const handlePlaceOrder = () => {
    // Here you would handle order placement logic
    setShowSuccess(true);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold text-honeybee-primary mb-6">Thank you for your order!</h2>
          <p>Your order has been placed successfully.</p>
        </div>
        {showSuccess && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <img src={successGif} alt="Success" className="w-64 h-64 object-cover" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-honeybee-background text-honeybee-secondary rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-honeybee-primary mb-6">Checkout</h2>
        <div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(parseFloat(item.price.replace(/[$₹]/g, '')) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-bold text-green-600 pt-2">
                <span>Discount:</span>
                <span>-₹{(total * discount).toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between font-bold border-t border-gray-300 pt-2">
                <span>Amount to Pay:</span>
                <span>₹{discountedTotal.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="coupon" className="block font-semibold mb-1">Have a coupon?</label>
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Enter coupon code"
            />
            {couponError && <p className="text-red-600 mt-1">{couponError}</p>}
            <Button onClick={handleApplyCoupon} variant="accent" className="mt-2">
              Apply Coupon
            </Button>
          </div>
          <div>
            <Button onClick={handlePlaceOrder} variant="primary" className="w-full">
              Place Order
            </Button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <img src={successGif} alt="Success" className="w-64 h-64 object-cover" />
        </div>
      )}
    </>
  );
};

export default Checkout;
