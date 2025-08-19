import React from 'react';
import { Star, Plus } from 'lucide-react';

const Shop: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Pure Honey',
      price: 299,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=300',
    },
    {
      id: 2,
      name: 'Organic Honey',
      price: 399,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049f59?w=300',
    },
    {
      id: 3,
      name: 'Wildflower Honey',
      price: 349,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=300',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-amber-800 mb-6">Shop</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold text-amber-600">₹{product.price}</span>
                <button className="bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600 transition-colors flex items-center">
                  <Plus size={16} className="mr-1" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
