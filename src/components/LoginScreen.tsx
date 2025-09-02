import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterWave from './LetterWave';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    // On successful login, redirect to home page
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-4xl font-serif font-bold text-honeybee-secondary mb-6 text-center">
              <LetterWave text="Log In" animationDelayStep={0.1} />
            </h1>
            <div>
              <label htmlFor="email" className="block text-honeybee-dark-brown font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-honeybee-dark rounded-md focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-honeybee-dark-brown font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-honeybee-dark rounded-md focus:outline-none focus:ring-2 focus:ring-honeybee-primary"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-honeybee-primary hover:bg-honeybee-accent text-honeybee-secondary font-semibold py-3 rounded-md transition duration-300"
            >
              Log In
            </button>
          </form>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => alert('Google login not implemented yet')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
            <button
              onClick={() => alert('Facebook login not implemented yet')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>
              <span>Facebook</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/home')}
              className="text-sm text-honeybee-primary hover:underline"
            >
              Continue as Guest
            </button>
          </div>
        </div>
        {/* Right side - image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1526403226900-0a7a7a7a7a7a?auto=format&fit=crop&w=800&q=80"
            alt="Fitness"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
