import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-honeybee-secondary mb-6">Settings</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleLogout}
          className="gradient-bg-primary hover:shadow-2xl text-black font-semibold py-3 px-6 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
