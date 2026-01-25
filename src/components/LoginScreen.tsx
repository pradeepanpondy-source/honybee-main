import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, sanitizeInput } from '../utils/validation';
import { rateLimiter } from '../utils/rateLimiter';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [googleIconLoaded, setGoogleIconLoaded] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Preload Google icon for faster loading
  useEffect(() => {
    const img = new Image();
    img.src = 'https://developers.google.com/identity/images/g-logo.png';
    img.onload = () => setGoogleIconLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // 1. Rate Limiting Check
    const rateCheck = rateLimiter.check('login', { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      const waitTime = rateLimiter.getWaitTimeSeconds(rateCheck.resetTime!);
      setError(`Too many login attempts. Please wait ${waitTime} seconds.`);
      return;
    }

    // 2. Input Validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      await signInWithEmail(validation.data.email, validation.data.password);
      // Show success message before navigating
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 2000);
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';

      if (err.message) {
        // Handle Supabase specific errors better
        if (err.message === 'Invalid login credentials') {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate('/home');
    } catch (error: unknown) {
      console.error('Google login process failed:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedEmail = sanitizeInput(recoveryEmail);
    if (!sanitizedEmail) {
      setError('Please enter your email address.');
      return;
    }
    try {
      await resetPassword(recoveryEmail);
      setError('Password reset email sent! Check your inbox.');
      setShowRecovery(false);
      setRecoveryEmail('');
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4 relative">
      <div className="max-w-5xl w-full bg-gray-50 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hello Again!</h1>
          {successMessage && (
            <div className="text-sm text-center mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-sm text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
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
              <div
                onClick={() => setShowRecovery(true)}
                className="text-right text-xs text-gray-500 mb-4 cursor-pointer hover:underline"
              >
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
          <div className="flex justify-center">
            <button
              onClick={handleGoogleLogin}
              className="p-2 hover:opacity-80 transition-opacity disabled:opacity-50"
              disabled={googleLoading}
              aria-label="Sign in with Google"
            >
              {googleLoading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : googleIconLoaded ? (
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              )}
            </button>
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

      {/* Password Recovery Modal */}
      {showRecovery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <p className="text-gray-600 text-sm mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleRecovery} className="space-y-4">
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600">Send Reset Link</button>
                <button type="button" onClick={() => setShowRecovery(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;