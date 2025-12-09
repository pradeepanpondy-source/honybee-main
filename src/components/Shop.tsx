import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';

const Shop: React.FC = () => {
  const { addToCart } = useCart();
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

        setProducts(data || []);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-honeybee-primary">Our Honey Selection</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Explore our collection of premium, all-natural honey. Each jar is a testament to the hard work of our bees and the richness of the land they forage.
          </p>
        </div>

        {loading && <div className="text-center mt-16">Loading products...</div>}
        {error && <div className="text-center mt-16 text-red-500">{error}</div>}
        
        {!loading && !error && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="h-56 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-honeybee-secondary">{product.name}</h3>
                  <p className="text-honeybee-dark-brown mt-2 text-sm">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-black font-bold">{`₹${product.price.toFixed(2)}`}</span>
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
        )}
      </div>
    </div>
  );
};

export default Shop;
