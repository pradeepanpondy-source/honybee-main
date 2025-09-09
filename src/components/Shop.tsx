import React from 'react';
import { useCart } from '../context/CartContext';

const products = [
  {
    id: 1,
    name: 'Wildflower Honey',
    price: '₹399',
    image: 'https://unblast.com/wp-content/uploads/2019/03/Honey-Jar-Mockup-1.jpg',
    description: 'Pure organic honey from wildflower meadows'
  },
  {
    id: 2,
    name: 'Acacia Honey',
    price: '₹499',
    image: 'https://unblast.com/wp-content/uploads/2019/03/Honey-Jar-Mockup-1.jpg',
    description: 'Light and delicate honey with subtle floral notes'
  },
  {
    id: 3,
    name: 'Manuka Honey',
    price: '₹599',
    image: 'https://unblast.com/wp-content/uploads/2019/03/Honey-Jar-Mockup-1.jpg',
    description: 'Premium therapeutic honey from New Zealand'
  },
  {
    id: 4,
    name: 'Honeycomb',
    price: '₹799',
    image: 'https://unblast.com/wp-content/uploads/2019/03/Honey-Jar-Mockup-1.jpg',
    description: 'Raw honeycomb straight from our sustainable apiaries'
  },
    {
    id: 5,
    name: 'Clover Honey',
    price: '₹399',
    image: 'https://unblast.com/wp-content/uploads/2019/03/Honey-Jar-Mockup-1.jpg',
    description: 'A classic, mild honey perfect for everyday use.'
  },
  {
    id: 6,
    name: 'Lavender Honey',
    price: '₹499',
    image: 'https://unblast.com/wp-content/uploads/2019/03/Honey-Jar-Mockup-1.jpg',
    description: 'Infused with the calming aroma of lavender blossoms.'
  },
];

const Shop: React.FC = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
  };

  return (
    <div className="bg-honeybee-background text-honeybee-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-honeybee-primary">Our Honey Selection</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Explore our collection of premium, all-natural honey. Each jar is a testament to the hard work of our bees and the richness of the land they forage.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-honeybee-secondary">{product.name}</h3>
                <p className="text-honeybee-dark-brown mt-2 text-sm">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-black font-bold">{product.price}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-honeybee-primary hover:bg-honeybee-accent text-white rounded-full p-2 transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;