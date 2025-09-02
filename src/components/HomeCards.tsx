import { Link } from 'react-router-dom';
import Button from './Button';

const products = [
  {
    id: 1,
    name: 'Wildflower Honey',
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Pure organic honey from wildflower meadows'
  },
  {
    id: 2,
    name: 'Acacia Honey',
    price: '$14.99',
    image: 'https://images.unsplash.com/photo-1555211652-5c6222f9cf62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Light and delicate honey with subtle floral notes'
  },
  {
    id: 3,
    name: 'Manuka Honey',
    price: '$24.99',
    image: 'https://images.unsplash.com/photo-1589827577276-3cd7c3dc1591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Premium therapeutic honey from New Zealand'
  },
  {
    id: 4,
    name: 'Honeycomb',
    price: '$18.99',
    image: 'https://images.unsplash.com/photo-1563245370-bd55e5963611?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Raw honeycomb straight from our sustainable apiaries'
  }
];

export default function HomeCards() {
  return (
    <div className="bg-honeybee-light py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-honeybee-secondary">Featured Products</h2>
          <p className="mt-4 text-lg text-honeybee-dark-brown max-w-2xl mx-auto">
            Discover our selection of premium organic honey products, harvested with care and love.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <span className="text-honeybee-primary font-bold">{product.price}</span>
                  <Button variant="primary" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
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