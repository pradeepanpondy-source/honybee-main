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
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg flex overflow-hidden">
        {/* Left side - form */}
        <div className="w-full p-8">
          <h1 className="text-4xl font-serif font-bold text-honeybee-secondary mb-6 text-center">
            Bee Bridge
          </h1>
          <p className="text-center mb-6">Welcome to Bee Bridge. Please log in or sign up to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="mt-6 flex flex-col space-y-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full border border-honeybee-primary text-honeybee-primary font-semibold py-3 rounded-md hover:bg-honeybee-primary hover:text-white transition duration-300"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-200 transition duration-300"
            >
              Login as Guest
            </button>
            <button
              onClick={() => alert('Google login not implemented yet')}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition duration-300 flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 7.053 29.523 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 19.832 12 25.999 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 7.053 29.523 5 24 5 16.318 5 9.656 9.64 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 43c5.421 0 10.287-2.184 13.928-5.732l-6.57-5.417C29.211 33.555 26.715 34 24 34c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.799 43 24 43z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.025 2.893-3.64 5.166-6.657 6.021v-6.021H24v8c4.418 0 8-3.582 8-8 0-.341-.027-.675-.072-1H43.611z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
