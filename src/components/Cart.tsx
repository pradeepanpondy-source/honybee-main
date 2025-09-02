import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from './Button';

const Cart: React.FC = () => {
  const cartItems = [];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Shopping Cart</h2>
      
      <div className="group"> {/* Added group here */}
        <div className="bg-white rounded-lg shadow-lg animate-card-hover p-6"> {/* Moved animate-card-hover here */}
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total: ₹{total}</span>
                  <div className="group"> {/* Added group here */}
                    <Button variant="primary">
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;