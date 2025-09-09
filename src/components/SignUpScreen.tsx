import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    // On successful signup, redirect to home page
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-gray-50 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
            />
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex justify-center">
            <button
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  navigate('/home');
                } catch {
                  alert('Google login failed. Please try again.');
                }
              }}
              className="p-3 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png" alt="Google" className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/home')}
              className="text-sm text-rose-600 hover:underline"
            >

            </button>
          </div>
        </div>
        {/* Right side - image */}
        <div className="hidden md:block md:w-1/2 relative rounded-r-3xl overflow-hidden border-8 border-white shadow-lg">
          <img
            src="https://media.istockphoto.com/id/1281435234/vector/honey-in-glass-jar-cartoon-bee-honeycombs-flowers-and-flowing-honey-on-wooden-dipper.jpg?s=612x612&w=0&k=20&c=5oaKRbsa7YGOnEiTSYKt1dJU1jrtkmGzxP381yXeF9w="
            alt="Honey Store Illustration"
            className="h-full w-full object-cover object-left"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
