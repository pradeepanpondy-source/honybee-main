import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import Button from './Button';

const Seller: React.FC = () => {
  const [isSeller, setIsSeller] = useState(false);

  if (!isSeller) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Become a Seller</h2>
        <p className="text-gray-300 mb-8">Join our community of honey sellers and reach a wider audience.</p>
        <div className="group">
          <Button onClick={() => setIsSeller(true)} variant="primary" className="px-8">
            Become a Seller
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Seller Application</h2>
      <div className="group">
        <div className="bg-white rounded-lg shadow-lg animate-card-hover p-6">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <Camera className="h-full w-full text-gray-300" />
                  </span>
                  <div className="group">
                    <Button type="button" className="ml-5 py-2 px-3 text-gray-700 shadow-sm text-sm leading-4 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-honeybee-accent" variant="secondary">
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                <input type="text" name="contact" id="contact" className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                <input type="text" name="pincode" id="pincode" className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="city" id="city" className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input type="text" name="state" id="state" className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="mt-6">
              <div className="group">
                <Button type="submit" className="w-full" variant="primary">
                  Submit Application
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Seller;