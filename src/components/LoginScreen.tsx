import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { Eye, EyeOff } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guest login - navigate to home without authentication
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4">
      <div className="max-w-5xl w-full bg-gray-50 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Hello Again!</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              />
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <div className="text-right text-xs text-gray-500 mb-4 cursor-pointer hover:underline">
                Recovery Password
              </div>
            </div>
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full font-semibold"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Button
                onClick={() => navigate('/signup')}
                variant="ghost"
                className="text-honeybee-primary hover:underline font-semibold p-0"
              >
                Sign Up
              </Button>
            </span>
          </div>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {error}
            </div>
          )}
          <div className="flex justify-center">
            <Button
              onClick={async () => {
                setError(null);
                try {
                  await signInWithGoogle();
                  navigate('/home');
                } catch (err: unknown) {
                  const errorMessage = err instanceof Error ? err.message : 'Google login failed. Please try again.';
                  setError(errorMessage);
                }
              }}
              variant="light"
              size="icon"
              className="p-3 shadow-md bg-white hover:shadow-lg"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Right side - animation and overlay */}
        <div className="hidden md:flex md:w-1/2 relative rounded-r-3xl overflow-hidden border-8 border-white shadow-lg">
          {React.createElement('dotlottie-wc', {
            src: 'https://lottie.host/415db1e3-d9d5-4073-b9fe-099abfe8c66c/XtpXv9SgcE.lottie',
            style: { width: '100%', height: '100%' },
            autoplay: true,
            loop: true
          })}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
