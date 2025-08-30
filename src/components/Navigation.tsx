import React, { useState } from 'react';
import { Home, ShoppingCart, Store, User, ShoppingBag, CreditCard } from 'lucide-react';
import ClickEffect from './ClickEffect';
import LetterWave from './LetterWave';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'seller', label: 'Seller', icon: Store },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex-1 text-left">
          <LetterWave text="Bee Bridge" />
        </div>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="group">
              <button
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg animate-button-hover ${
                  activeTab === item.id
                    ? 'bg-white/20 text-black'
                    : 'text-black hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:block">{item.label}</span>
              </button>
              </div>
            );
          })}
          
          {/* Settings dropdown in top right corner */}
          <div className="relative">
            <div className="group">
              <ClickEffect
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-black rounded-lg animate-button-hover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </ClickEffect>
            </div>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-1 z-20 border border-purple-300">
                <div className="group">
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                      setShowSettings(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-black animate-button-hover flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
