import React from 'react';
import Button from './Button';
import { CreditCard, MapPin, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddressInformationProps {
  nextStep: () => void;
  prevStep: () => void;
}

const AddressInformation: React.FC<AddressInformationProps> = ({ nextStep, prevStep }) => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
      {/* Left form */}
      <motion.div className="w-full md:w-1/2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <div className="flex space-x-4 text-amber-900 mb-4">
            <div className="flex items-center space-x-1 font-semibold"><MapPin size={16} /> Address</div>
            <div className="flex items-center space-x-1"><CreditCard size={16} /> Payment</div>
            <div className="flex items-center space-x-1"><ShoppingCart size={16} /> Place Order</div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Shipping Information</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name (Eg: Charles Gupta)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Phone Number (00000 00000)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="City/Town (Eg: Mumbai)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="State (Eg: Maharashtra)"
            className="w-full p-3 border border-gray-300 rounded"
          />
          <Button onClick={nextStep} variant="accent" className="w-full">
            Save and next
          </Button>
        </form>
      </motion.div>

      {/* Right product summary */}
      <motion.div className="w-full md:w-1/3 bg-yellow-100 rounded-lg p-6 flex flex-col items-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <img
          src="/honey-jar.png"
          alt="Bee Bridge"
          className="w-32 h-32 object-contain mb-4"
        />
        <h3 className="font-semibold text-lg mb-1">Bee Bridge</h3>
        <p className="text-amber-900 mb-1">Pure</p>
        <p className="text-amber-900 font-bold text-xl">₹200</p>
        <p className="text-amber-900">250g</p>
      </motion.div>
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

export default AddressInformation;