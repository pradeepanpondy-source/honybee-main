import React from 'react';
import { Home as HomeIcon, Sparkles, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6">Welcome to HoneyBee</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HomeIcon className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fresh Honey</h3>
          <p className="text-gray-600">Discover the finest quality honey from local beekeepers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Sparkles className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Natural Products</h3>
          <p className="text-gray-600">100% natural and organic honey products</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <TrendingUp className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
          <p className="text-gray-600">Competitive prices for premium quality</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
