import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const Seller: React.FC = () => {
  const [isSeller, setIsSeller] = useState(false);

  if (!isSeller) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold text-amber-800 mb-4">Become a Seller</h2>
        <p className="text-gray-600 mb-8">Join our community of honey sellers and reach a wider audience.</p>
        <button 
          onClick={() => setIsSeller(true)} 
          className="bg-amber-500 text-white px-8 py-3 rounded-md hover:bg-amber-600 transition-colors"
        >
          Become a Seller
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6">Seller Application</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <Camera className="h-full w-full text-gray-300" />
                </span>
                <button type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                  Upload Photo
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
              <input type="text" name="contact" id="contact" className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input type="text" name="pincode" id="pincode" className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" id="city" className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input type="text" name="state" id="state" className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Seller;