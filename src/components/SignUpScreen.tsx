import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import Button from './Button';
import { signUpSchema } from '../utils/validation';
import { rateLimiter } from '../utils/rateLimiter';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 1. Rate Limiting Check
    const rateCheck = rateLimiter.check('signup', { limit: 3, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      const waitTime = rateLimiter.getWaitTimeSeconds(rateCheck.resetTime!);
      setError(`Too many attempts. Please wait ${waitTime} seconds (Rate Limit 429).`);
      setLoading(false);
      return;
    }

    // 2. Input Validation
    const validation = signUpSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(validation.data.name, validation.data.email, validation.data.password);
      // Success handling: Show message and redirect to login
      setLoading(false);
      localStorage.setItem('justSignedUp', 'true');
      setSuccessMessage('Account created successfully! Redirecting to Login...');
      setTimeout(() => {
        localStorage.removeItem('justSignedUp');
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Sign up error:', err);
      let errorMessage = 'Sign up failed. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      // Navigation will be handled by App.tsx routing based on auth state
    } catch (error: unknown) {
      console.error('Google sign up error:', error);
      setError('Google sign up failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-bg-warm flex items-center justify-center px-4">
      <div className="max-w-5xl w-full glass-effect rounded-3xl modern-shadow flex overflow-hidden">
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold vibrant-text mb-6 text-center">
            Create Account
          </h1>
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
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              />
            </div>
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
              <Button
                type="submit"
                variant="primary"
                className="w-full font-semibold"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignUp}
              className="p-3 shadow-md bg-white hover:shadow-lg rounded-lg transition-shadow"
              aria-label="Sign up with Google"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                className="text-honeybee-primary hover:underline font-semibold p-0"
              >
                Sign In
              </Button>
            </span>
          </div>
        </div>
        {/* Right side - animation */}
        <div className="hidden md:block md:w-1/2 relative rounded-r-3xl overflow-hidden border-8 border-white shadow-lg">
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

export default SignUpScreen;
