import React from 'react';
import Button from './Button';

interface AddressInformationProps {
  nextStep: () => void;
  prevStep: () => void;
}

const AddressInformation: React.FC<AddressInformationProps> = ({ nextStep, prevStep }) => {
  return (
    <div className="bg-yellow-50 min-h-screen p-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
      {/* Left form */}
      <div className="w-full md:w-1/2">
        <div className="mb-6">
          <div className="flex space-x-4 text-amber-900 mb-4">
            <div className="font-semibold">Address</div>
            <div>Payment</div>
            <div>Place Order</div>
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

export default AddressInformation;