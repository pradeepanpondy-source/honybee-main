import React from 'react';
import { Trash2 } from 'lucide-react';

const Cart: React.FC = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Pure Honey',
      price: 299,
      quantity: 2,
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6">Shopping Cart</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">₹{item.price * item.quantity}</span>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total: ₹{total}</span>
                <button className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
