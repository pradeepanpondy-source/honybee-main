import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import successGif from '../assets/success confetti.gif';
import congratsGif from '../assets/congratulation.gif';
import { supabase } from '../lib/supabase'; // Import Supabase client
import { CartItem } from '../context/CartContext'; // Assuming CartItem is exported from here

const validCoupons: Record<string, number> = {
  'HONEY10': 0.10,
  'BEE20': 0.20,
  'OFFER': 0.10,
};

const Checkout: React.FC = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

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
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 3000);
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in to place an order.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // 1. Group cart items by seller_id
    const ordersBySeller = cartItems.reduce((acc, item) => {
      const sellerId = item.seller_id;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    try {
      // 2. Create an order for each seller
      const createdOrderIds: string[] = [];
      for (const sellerId in ordersBySeller) {
        const sellerItems = ordersBySeller[sellerId];
        const sellerTotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Apply discount proportionally
        const sellerDiscount = sellerTotal / total * (total * discount);
        const sellerDiscountedTotal = sellerTotal - sellerDiscount;

        // 3. Insert into 'orders' table
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            seller_id: sellerId,
            total: sellerTotal,
            discounted_total: discount > 0 ? sellerDiscountedTotal : undefined,
            coupon: discount > 0 ? coupon.toUpperCase() : undefined,
            discount: discount > 0 ? sellerDiscount / sellerTotal : undefined, // as a percentage
            status: 'pending',
            customer_email: user.email,
            customer_name: user.name,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        const newOrderId = orderData.id;
        createdOrderIds.push(newOrderId);

        // 4. Prepare items for 'order_items' table
        const orderItemsToInsert = sellerItems.map(item => ({
          order_id: newOrderId,
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));

        // 5. Insert into 'order_items' table
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;
      }

      setOrderId(createdOrderIds.join(', ')); // Show all created order IDs
      setShowSuccess(true);
      setOrderPlaced(true);
      clearCart();

    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    }
  };

  if (orderPlaced) {
    return (
      <>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold text-honeybee-primary mb-6">Thank you for your order!</h2>
          <p>Your order has been placed successfully.</p>
          {orderId && (
            <p className="text-lg mt-4">Order ID(s): <span className="font-bold">{orderId}</span></p>
          )}
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
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-honeybee-background text-honeybee-secondary rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-honeybee-primary mb-6">Checkout</h2>
        <div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2 text-sm md:text-base">
                <span>{item.name} x {item.quantity}</span>
                {/* item.price is now a number */}
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t border-gray-300 pt-2 text-sm md:text-base">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-bold text-green-600 pt-2 text-sm md:text-base">
                <span>Discount:</span>
                <span>-₹{(total * discount).toFixed(2)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between font-bold border-t border-gray-300 pt-2 text-sm md:text-base">
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
              className="border border-gray-300 rounded px-3 py-3 w-full text-base"
              placeholder="Enter coupon code"
            />
            {couponError && <p className="text-red-600 mt-1">{couponError}</p>}
            <Button onClick={handleApplyCoupon} variant="accent" className="mt-2 w-full md:w-auto">
              Apply Coupon
            </Button>
          </div>
          <div>
            <Button onClick={handlePlaceOrder} variant="primary" className="w-full py-3 text-base">
              Place Order
            </Button>
          </div>
        </div>
      </div>
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <img src={congratsGif} alt="Congratulations" className="w-96 h-96 object-cover rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
};

export default Checkout;
