import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Button from './Button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, sanitizeInput } from '../utils/validation';
import { rateLimiter } from '../utils/rateLimiter';
import { UnverifiedEmailError } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleIconLoaded, setGoogleIconLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  // Handle inbound message from verify-email-pending page
  const locState = location.state as any;

  useEffect(() => {
    if (locState?.verifyEmail) {
      setInfoMessage('📧 Please verify your email before logging in. Check your inbox.');
    }
    if (locState?.resetSuccess) {
      setSuccessMessage('✅ Password reset successful! You can now log in.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Preload Google icon
  useEffect(() => {
    const img = new Image();
    img.src = 'https://developers.google.com/identity/images/g-logo.png';
    img.onload = () => setGoogleIconLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent double-submit

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    setInfoMessage(null);

    // 1. Rate limiting
    const rateCheck = rateLimiter.check('login', { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      const waitTime = rateLimiter.getWaitTimeSeconds(rateCheck.resetTime!);
      setError(`Too many login attempts. Please wait ${waitTime} seconds.`);
      setIsSubmitting(false);
      return;
    }

    // 2. Input validation
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmail(validation.data.email, validation.data.password);
      setSuccessMessage('✅ Login successful! Redirecting...');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err: any) {
      console.error('Login error:', err);

      // Unverified email — redirect to dedicated pending page
      if (err instanceof UnverifiedEmailError) {
        navigate('/verify-email-pending', {
          state: {
            email: err.userEmail,
            userId: err.userId,
          },
        });
        return;
      }

      // Map Supabase error messages to user-friendly text
      let errorMessage = 'Login failed. Please try again.';
      if (err.message === 'Invalid login credentials') {
        errorMessage = 'Incorrect email or password. Please check your credentials.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Navigation handled by onAuthStateChange in AuthContext
    } catch (err: unknown) {
      console.error('Google login failed:', err);
      setError('Google login failed. Please try again.');
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
    setRecoveryLoading(true);
    try {
      const response = await fetch('/api/send-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitizedEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage('📧 Password reset email sent! Check your inbox.');
        setError(null);
        setShowRecovery(false);
        setRecoveryEmail('');
      } else {
        setError(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 relative page-fade-in">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-honeybee-primary/20">

        {/* ── Left: Form ─────────────────────────────── */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-black text-honeybee-secondary mb-2 tracking-tight">
            Hello Again!
          </h1>
          <p className="text-honeybee-secondary/60 text-sm mb-6 font-medium">
            Welcome back to BeeBridge
          </p>

          {/* Messages */}
          {infoMessage && (
            <div className="text-sm text-center mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 font-medium animate-fadeIn">
              {infoMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-center mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="text-sm text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="email@example.com"
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base disabled:opacity-60"
                aria-label="Email Address"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base disabled:opacity-60"
                  aria-label="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-honeybee-secondary focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <button
              type="button"
              onClick={() => setShowRecovery(true)}
              className="text-right w-full text-xs text-honeybee-secondary/60 cursor-pointer hover:text-honeybee-accent hover:underline transition-colors font-semibold"
            >
              Forgot Password?
            </button>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full font-black py-3 md:py-4 rounded-xl uppercase tracking-widest transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-honeybee-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Sign Up link */}
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Button
                onClick={() => navigate('/signup')}
                variant="ghost"
                className="text-honeybee-primary hover:underline font-semibold p-0"
              >
                Sign Up
              </Button>
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="p-2 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Sign in with Google"
            >
              {googleLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              ) : googleIconLoaded ? (
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-6 h-6" />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              )}
              {googleLoading && <span className="text-sm text-gray-500">Connecting…</span>}
            </button>
          </div>
        </div>

        {/* ── Right: Lottie Animation ─────────────────── */}
        <div className="hidden md:flex md:w-1/2 relative rounded-r-3xl overflow-hidden border-8 border-white shadow-lg">
          {React.createElement('dotlottie-wc', {
            src: 'https://lottie.host/415db1e3-d9d5-4073-b9fe-099abfe8c66c/XtpXv9SgcE.lottie',
            style: { width: '100%', height: '100%' },
            autoplay: true,
            loop: true,
          })}
        </div>
      </div>

      {/* ── Password Recovery Modal ─────────────────── */}
      {showRecovery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-honeybee-secondary">Reset Password</h2>
            <p className="text-gray-500 text-sm mb-4">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleRecovery} className="space-y-4">
              <input
                type="email"
                value={recoveryEmail}
                onChange={e => setRecoveryEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={recoveryLoading}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-honeybee-primary disabled:opacity-60"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="flex-1 bg-honeybee-secondary text-white py-2.5 rounded-xl hover:bg-honeybee-secondary/90 transition-colors font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {recoveryLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowRecovery(false); setRecoveryEmail(''); }}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
