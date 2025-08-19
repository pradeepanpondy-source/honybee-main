import React from 'react';
import { Store, PlusCircle, Package } from 'lucide-react';

const Seller: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6">Seller Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
              <p className="text-3xl font-bold text-amber-600">12</p>
            </div>
            <Package className="w-12 h-12 text-amber-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Sales</h3>
              <p className="text-3xl font-bold text-green-600">₹15,420</p>
            </div>
            <Store className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
              <p className="text-3xl font-bold text-blue-600">28</p>
            </div>
            <PlusCircle className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors flex items-center">
          <PlusCircle className="mr-2" size={20} />
          Add New Product
        </button>
      </div>
    </div>
  );
};

export default Seller;
