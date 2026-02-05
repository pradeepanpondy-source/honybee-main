import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import confetti from 'canvas-confetti';
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

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const total = getTotal();
  const discountedTotal = total - (total * discount);




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
        // Check usage in orders table
        // Note: This relies on 'coupon' column being uniform case in DB or case-insensitive search
        const { data: existingOrders, error } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('coupon', upperCoupon);

        if (error) {
          console.error("Error checking coupon usage:", error);
          // Fail safe: allow? Or block? Let's block to be safe or alert
          setCouponError('Error verifying coupon eligibility');
          return;
        }

        if (existingOrders && existingOrders.length > 0) {
          setCouponError('You have already used this coupon.');
          setDiscount(0);
          return;
        }

      } catch (err) {
        console.error("Error in coupon check", err);
        setCouponError('Error verifying coupon');
        return;
      }
    }


    if (validCoupons[upperCoupon]) {
      setDiscount(validCoupons[upperCoupon]);
      setCouponError('');
      // Trigger confetti
      confetti({
        particleCount: 400,
        spread: 160,
        origin: { y: 0.6 },
        startVelocity: 60,
        zIndex: 9999,
      });
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

    // Double check coupon usage just before placing order to prevent race conditions (optional but good)
    if (discount > 0 && coupon) {
      const { data: existingOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('coupon', coupon.toUpperCase());

      if (existingOrders && existingOrders.length > 0) {
        alert("Coupon already used. Please remove it or use another.");
        return;
      }
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
            customer_name: (user as any)?.user_metadata?.name || user.email?.split('@')[0] || 'Customer', // Fallback for name
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
      setOrderPlaced(true);
      clearCart();

      // Trigger success confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

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

      </>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-honeybee-background text-honeybee-secondary rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-honeybee-primary mb-6">Checkout</h2>
        <div>
          {/* Contact Information Section */}
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
              {/* Optional Name field if available in metadata, or editable */}
              {/* <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                     <input 
                        type="text" 
                        defaultValue={user?.user_metadata?.name || ''}
                         className="w-full border border-gray-300 rounded px-3 py-2"
                         placeholder="Your Name"
                     />
                </div> */}
            </div>
          </div>

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
            <div className="flex flex-col gap-2">
              <input
                id="coupon"
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                disabled={discount > 0} // Disable input if discount applied
                className={`border border-gray-300 rounded px-3 py-3 w-full text-base ${discount > 0 ? 'bg-gray-100' : ''}`}
                placeholder="Enter coupon code"
              />
              {/* Only show Apply button if no discount applied */}
              {!discount && (
                <Button onClick={handleApplyCoupon} variant="accent" className="w-full md:w-auto self-start">
                  Apply Coupon
                </Button>
              )}
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
          <div>
            <Button onClick={handlePlaceOrder} variant="primary" className="w-full py-3 text-base">
              Place Order
            </Button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Checkout;
