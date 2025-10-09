import React from 'react';
import Button from './Button';
import { CreditCard, MapPin, ShoppingCart } from 'lucide-react';

interface PaymentMethodProps {
  nextStep: () => void;
  prevStep: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ nextStep, prevStep }) => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
      {/* Left payment form */}
      <div className="w-full md:w-1/2">
        <div className="mb-6">
          <div className="flex space-x-4 text-amber-900 mb-4">
            <div className="flex items-center space-x-1"><MapPin size={16} /> Address</div>
            <div className="flex items-center space-x-1 font-semibold"><CreditCard size={16} /> Payment</div>
            <div className="flex items-center space-x-1"><ShoppingCart size={16} /> Place Order</div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Payment Method</h2>
        <form className="space-y-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" value="card" defaultChecked />
            <span>Via Debit/Credit Card</span>
          </label>
          <input
            type="email"
            placeholder="Eg: mike@hdsdesign.com"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Name on card (Eg: Mike Sharma)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Card Number (0000 0000 0000 0000)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="flex-1 p-3 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="CVC (000)"
              className="flex-1 p-3 border border-gray-300 rounded"
            />
          </div>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" value="cod" />
            <span>Cash on delivery</span>
          </label>
          <Button onClick={nextStep} variant="accent" className="w-full">
            Save and next
          </Button>
        </form>
      </div>

      {/* Right product summary */}
      <div className="w-full md:w-1/3 bg-yellow-100 rounded-lg p-6 flex flex-col items-center">
        <img
          src="/honey-jar.png"
          alt="Bee Bridge"
          className="w-32 h-32 object-contain mb-4"
        />
        <h3 className="font-semibold text-lg mb-1">Bee Bridge</h3>
        <p className="text-amber-900 mb-1">Pure</p>
        <p className="text-amber-900 font-bold text-xl">₹200</p>
        <p className="text-amber-900">250g</p>
      </div>
      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="secondary">
          Back
        </Button>
        <Button onClick={nextStep} variant="accent">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethod;
