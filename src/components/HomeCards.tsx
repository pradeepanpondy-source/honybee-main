import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

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
  }
];

export default function HomeCards() {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const getQuantity = (id: number) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="bg-honeybee-light py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-honeybee-secondary">Featured Products</h2>
          <p className="mt-4 text-lg text-honeybee-dark-brown max-w-2xl mx-auto">
            Discover our selection of premium organic honey products, harvested with care and love.
          </p>
        </div>
        
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
          {products.map((product) => {
            const quantity = getQuantity(product.id);
            return (
              <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
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
                    {quantity === 0 ? (
                      <Button 
                        variant="primary" 
                        size="icon" 
                        onClick={() => addToCart(product)}
                      >
                        <Plus size={20} />
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="font-semibold">{quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/shop"
            className="inline-block bg-honeybee-primary hover:bg-honeybee-accent text-honeybee-secondary font-medium py-3 px-8 rounded-full transition duration-300 ease-out"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
