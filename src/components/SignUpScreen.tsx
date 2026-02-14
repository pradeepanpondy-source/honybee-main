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
  const [emailSent, setEmailSent] = useState(false);

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
      // Success: show inline "Check your email" message
      setLoading(false);
      localStorage.setItem('justSignedUp', 'true');
      setSuccessMessage('Account created successfully!');
      setEmailSent(true);
      localStorage.removeItem('justSignedUp');
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
    <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 py-8 page-fade-in">
      <div className="max-w-5xl w-full glass-effect rounded-3xl shadow-2xl flex overflow-hidden border border-honeybee-primary/20">
        {/* Left side - form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-black text-honeybee-secondary mb-2 text-center tracking-tight">
            Join the Hive
          </h1>
          <p className="text-honeybee-secondary/60 text-sm mb-8 text-center font-medium">Create your BeeBridge account</p>
          {successMessage && (
            <div className="text-sm text-center mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-sm text-center mb-4 p-3 bg-honeybee-secondary/10 border border-honeybee-secondary/20 rounded-lg text-honeybee-secondary font-bold">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label htmlFor="name" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base"
                aria-label="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base"
                aria-label="Email Address"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">Secure Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base"
                  aria-label="Secure Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-honeybee-secondary focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full font-black py-3 md:py-4 rounded-xl uppercase tracking-widest transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-honeybee-primary/20"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Start Your Journey'}
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

          {/* Inline "Check your email" banner */}
          {emailSent && (
            <div className="mt-6 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl -mx-6 md:-mx-10 -mb-6 md:-mb-10 px-6 md:px-10 pb-6 md:pb-8">
              <h3 className="font-bold text-honeybee-secondary text-base mb-1">Check your email</h3>
              <p className="text-gray-500 text-sm">We sent you a verification link. Please confirm your email before signing in.</p>
            </div>
          )}
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
