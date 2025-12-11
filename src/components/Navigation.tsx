import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hide navigation on login and signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  // Check if on seller dashboard pages (where Seller link should be hidden)
  const isSellerDashboard = ['/applications', '/products', '/analytics', '/earnings', '/orders', '/settings'].includes(location.pathname);

  return (
    <nav className="bg-honeybee-background/98 backdrop-blur-md shadow-xl fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-lg md:text-xl lg:text-2xl font-bold text-honeybee-primary">Bee Bridge</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <Link
              to="/home"
              className={`font-medium text-sm lg:text-base ${location.pathname === '/home' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'} transition duration-300`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`font-medium text-sm lg:text-base ${location.pathname === '/shop' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'} transition duration-300`}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`font-medium text-sm lg:text-base ${location.pathname === '/about' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'} transition duration-300`}
            >
              About
            </Link>
            {!isSellerDashboard && (
              <Link
                to="/seller"
                className={`font-medium text-sm lg:text-base ${location.pathname === '/seller' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'} transition duration-300`}
              >
                Seller
              </Link>
            )}
            <Link
              to="/contact"
              className={`font-medium text-sm lg:text-base ${location.pathname === '/contact' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'} transition duration-300`}
            >
              Contact
            </Link>
            <Link
              to="/subscription"
              className={`font-medium text-sm lg:text-base ${location.pathname === '/subscription' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'} transition duration-300`}
            >
              Subscription
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/cart" className="text-honeybee-secondary hover:text-honeybee-primary transition duration-300 relative p-2 md:p-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-red-600 text-white rounded-full text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-honeybee-secondary hover:text-honeybee-primary transition duration-300 p-2 md:p-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <div className="relative group hidden md:block">
              <button className="text-honeybee-secondary hover:text-honeybee-primary transition duration-300 flex items-center space-x-1 focus:outline-none p-2 md:p-0">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Settings</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-honeybee-dark hover:bg-honeybee-light"
                  onClick={async () => {
                    await logout();
                    window.location.href = '/login';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-honeybee-secondary hover:text-honeybee-primary p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-honeybee-background/95 backdrop-blur-sm border-t border-honeybee-light">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/home"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/home' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/shop' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/about' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/seller"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/seller' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Seller
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/contact' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/subscription"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/subscription' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Subscription
            </Link>
            <Link
              to="/settings"
              className={`block px-3 py-2 rounded-md font-medium ${location.pathname === '/settings' ? 'text-honeybee-primary' : 'text-honeybee-secondary hover:text-honeybee-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={async () => {
                await logout();
                window.location.href = '/login';
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md font-medium text-honeybee-secondary hover:text-honeybee-accent"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
