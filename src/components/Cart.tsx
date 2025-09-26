import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();

  const total = getTotal();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-honeybee-primary mb-6">Shopping Cart</h2>
      
      <div className="group">
        <div className="bg-white rounded-lg shadow-lg animate-card-hover p-6">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">₹{parseFloat(item.price.replace(/[$₹]/g, ''))} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 border border-gray-300 rounded px-2 py-1"
                      />
                      <span className="text-lg font-semibold text-gray-800">₹{(parseFloat(item.price.replace(/[$₹]/g, '')) * item.quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div
                className="mt-6 pt-4 border-t border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total: ₹{total.toFixed(2)}</span>
                  <div className="group">
                    <Button variant="primary" onClick={handleCheckout}>
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
