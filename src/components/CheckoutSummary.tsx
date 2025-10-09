import React from 'react';
import Button from './Button';
import { CreditCard, MapPin, ShoppingCart } from 'lucide-react';

interface CheckoutSummaryProps {
  nextStep: () => void;
  prevStep: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ nextStep, prevStep }) => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
      {/* Left order summary */}
      <div className="w-full md:w-1/2">
        <div className="mb-6">
          <div className="flex space-x-4 text-amber-900 mb-4">
            <div className="flex items-center space-x-1"><MapPin size={16} /> Address</div>
            <div className="flex items-center space-x-1"><CreditCard size={16} /> Payment</div>
            <div className="flex items-center space-x-1 font-semibold"><ShoppingCart size={16} /> Place Order</div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Checkout</h2>
        <div className="bg-yellow-100 rounded-lg p-6 mb-6 flex items-center space-x-4">
          <img
            src="/honey-jar.png"
            alt="Bee Bridge"
            className="w-20 h-20 object-contain"
          />
          <div>
            <h3 className="font-semibold">Bee Bridge</h3>
            <p>Pure</p>
            <p>250g</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Delivered to</h3>
          <p>Robert Fox</p>
          <p>6391 Elgin St, Celina, Delaware 10299</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <p>Item: ₹200</p>
          <p>Delivery Charges: ₹10</p>
          <p className="font-bold">Order Total: ₹210</p>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Pay Via</h3>
          <p>Debit/Credit Card</p>
        </div>
        <Button onClick={nextStep} variant="accent" className="w-full">
          Place Order
        </Button>
        <p className="text-sm text-gray-600 mt-4">Order will be delivered within 2 days</p>
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

export default CheckoutSummary;
