import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';

// Honey jar image URL
import honeyJarImage from '../assets/honey_jar.jpg';

const defaultHoneyProducts: Product[] = [
  { id: 'default-1', name: 'Wildflower Honey', description: 'Pure, raw wildflower honey with a rich, complex flavor.', price: 450, category: 'honey', stock: 5, image_url: honeyJarImage, seller_id: '', is_active: true, created_at: '', updated_at: '' },
  { id: 'default-2', name: 'Acacia Honey', description: 'Light and mild acacia honey, perfect for tea and desserts.', price: 550, category: 'honey', stock: 5, image_url: honeyJarImage, seller_id: '', is_active: true, created_at: '', updated_at: '' },
  { id: 'default-3', name: 'Manuka Honey', description: 'Premium New Zealand Manuka honey with UMF 10+ rating.', price: 1200, category: 'honey', stock: 5, image_url: honeyJarImage, seller_id: '', is_active: true, created_at: '', updated_at: '' },
  { id: 'default-4', name: 'Raw Forest Honey', description: 'Unprocessed forest honey collected from pristine environments.', price: 380, category: 'honey', stock: 5, image_url: honeyJarImage, seller_id: '', is_active: true, created_at: '', updated_at: '' },
  { id: 'default-5', name: 'Organic Clover Honey', description: 'Certified organic clover honey with a sweet, mild taste.', price: 420, category: 'honey', stock: 5, image_url: honeyJarImage, seller_id: '', is_active: true, created_at: '', updated_at: '' },
  { id: 'default-6', name: 'Eucalyptus Honey', description: 'Aromatic eucalyptus honey with natural healing properties.', price: 480, category: 'honey', stock: 5, image_url: honeyJarImage, seller_id: '', is_active: true, created_at: '', updated_at: '' },
  {
    id: 'beehive-starter-kit',
    name: 'Beehive Wooden Box With Frames',
    description: 'Complete Beehive Kit for Beekeeper with 1 Deep Box & 1 Medium Box.',
    price: 5000,
    category: 'beehive',
    stock: 5,
    image_url: '/src/assets/beehive_new.png',
    seller_id: 'pollibee-official',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          throw error;
        }

        setProducts(data && data.length > 0 ? data : defaultHoneyProducts);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <div className="bg-honeybee-background text-honeybee-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-honeybee-primary">Our Honey Selection</h1>
          <p className="mt-3 lg:mt-4 text-sm lg:text-lg max-w-2xl mx-auto">
            Explore our collection of premium, all-natural honey.
          </p>
        </div>

        {loading && <div className="text-center mt-16">Loading products...</div>}
        {error && <div className="text-center mt-16 text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="mt-8 lg:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="h-32 sm:h-48 lg:h-56 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-3 lg:p-6">
                  <h3 className="text-sm lg:text-lg font-medium text-honeybee-secondary line-clamp-1">{product.name}</h3>
                  <p className="text-honeybee-dark-brown mt-1 lg:mt-2 text-xs lg:text-sm line-clamp-2 hidden sm:block">{product.description}</p>
                  <div className="mt-2 lg:mt-4 flex items-center justify-between">
                    <span className="text-black font-bold text-sm lg:text-base">₹{product.price.toFixed(0)}</span>
                    {(() => {
                      const cartItem = cartItems.find((item) => item.id === product.id);
                      return cartItem ? (
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
                          <button
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                updateQuantity(cartItem.id, cartItem.quantity - 1);
                              } else {
                                removeFromCart(cartItem.id);
                              }
                            }}
                            className="text-honeybee-primary hover:text-honeybee-accent font-bold px-2"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold">{cartItem.quantity}</span>
                          <button
                            onClick={() => {
                              if (cartItem.quantity < 5) {
                                updateQuantity(cartItem.id, cartItem.quantity + 1);
                              }
                            }}
                            className={`text-honeybee-primary hover:text-honeybee-accent font-bold px-2 ${cartItem.quantity >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={cartItem.quantity >= 5}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        product.category === 'beehive' ? (
                          <button
                            onClick={() => navigate('/product/beehive')}
                            className="bg-honeybee-primary hover:bg-honeybee-accent text-white rounded-full px-4 py-2 text-sm transition duration-300 font-semibold"
                          >
                            View Details
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-honeybee-primary hover:bg-honeybee-accent text-white rounded-full p-2 transition duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
