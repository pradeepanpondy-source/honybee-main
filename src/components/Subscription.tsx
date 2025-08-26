import React from 'react';
import { CheckCircle } from 'lucide-react';

const Subscription: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Basic</h3>
          <p className="text-4xl font-bold text-amber-600 mb-4">₹499</p>
          <ul className="text-left space-y-2 mb-6">
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Feature 1</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Feature 2</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Feature 3</li>
          </ul>
          <button className="bg-amber-500 text-white px-8 py-3 rounded-md hover:bg-amber-600 transition-colors">Choose Plan</button>
        </div>

        {/* Plan 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-amber-500">
          <h3 className="text-2xl font-semibold mb-4">Pro</h3>
          <p className="text-4xl font-bold text-amber-600 mb-4">₹899</p>
          <ul className="text-left space-y-2 mb-6">
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> All Basic Features</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Feature 4</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Feature 5</li>
          </ul>
          <button className="bg-amber-500 text-white px-8 py-3 rounded-md hover:bg-amber-600 transition-colors">Choose Plan</button>
        </div>

        {/* Plan 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-2xl font-semibold mb-4">Premium</h3>
          <p className="text-4xl font-bold text-amber-600 mb-4">₹1299</p>
          <ul className="text-left space-y-2 mb-6">
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> All Pro Features</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Advanced Analytics</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Priority Support</li>
            <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Early access to new features</li>
          </ul>
          <button className="bg-amber-500 text-white px-8 py-3 rounded-md hover:bg-amber-600 transition-colors">Choose Plan</button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;