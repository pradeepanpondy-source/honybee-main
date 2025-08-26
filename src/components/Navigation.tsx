import React from 'react';
import { Home, ShoppingCart, Store, User, ShoppingBag, Search, CreditCard } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'seller', label: 'Seller', icon: Store },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'farms', label: 'Find Farms', icon: Search },
  ];

  return (
    <nav className="bg-amber-100 border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-800">Honey Bridge</h1>
        <div className="flex space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-white'
                    : 'text-amber-700 hover:bg-amber-200'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:block">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;