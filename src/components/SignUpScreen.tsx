import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Button from './Button';
import { signUpSchema } from '../utils/validation';
import { rateLimiter } from '../utils/rateLimiter';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // 1. Rate limiting
    const rateCheck = rateLimiter.check('signup', { limit: 3, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      const waitTime = rateLimiter.getWaitTimeSeconds(rateCheck.resetTime!);
      setError(`Too many attempts. Please wait ${waitTime} seconds.`);
      setLoading(false);
      return;
    }

    // 2. Terms check (belt-and-suspenders — button is already disabled)
    if (!agreedToTerms) {
      setError('You must accept the Terms & Conditions and Privacy Policy to continue.');
      setLoading(false);
      return;
    }

    // 3. Input validation
    const validation = signUpSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const newUser = await signUpWithEmail(
        validation.data.name,
        validation.data.email,
        validation.data.password,
      );

      setSuccessMessage('🎉 Account created! Redirecting to verification...');

      // Short delay so user sees the success message
      setTimeout(() => {
        navigate('/verify-email-pending', {
          state: {
            email: newUser.email,
            userId: newUser.id,
            name: validation.data.name,
          },
        });
      }, 1200);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error('Google sign up error:', err);
      setError('Google sign up failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const canSubmit = agreedToTerms && !loading;

  return (
    <div className="min-h-screen bg-honeybee-light flex items-center justify-center px-4 py-8 page-fade-in">
      <div className="max-w-5xl w-full glass-effect rounded-3xl shadow-2xl flex overflow-hidden border border-honeybee-primary/20">

        {/* ── Left: Form ───────────────────────────── */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-black text-honeybee-secondary mb-2 text-center tracking-tight">
            Join the Hive
          </h1>
          <p className="text-honeybee-secondary/60 text-sm mb-6 text-center font-medium">
            Create your BeeBridge account
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="John Doe"
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base disabled:opacity-60"
                autoComplete="name"
              />
            </div>

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
                disabled={loading}
                placeholder="email@example.com"
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base disabled:opacity-60"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-honeybee-secondary/50 uppercase tracking-widest mb-1.5 ml-1">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 md:py-4 rounded-xl border border-gray-100 bg-gray-50/50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white transition-all text-sm md:text-base disabled:opacity-60"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-honeybee-secondary focus:outline-none transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                At least 8 characters, one uppercase, one lowercase, one number.
              </p>
            </div>

            {/* ── Terms & Conditions Checkbox ─────────── */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                disabled={loading}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-honeybee-primary focus:ring-honeybee-primary cursor-pointer accent-honeybee-primary flex-shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                I agree to the{' '}
                <Link
                  to="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-honeybee-primary hover:underline font-semibold"
                  onClick={e => e.stopPropagation()}
                >
                  Terms &amp; Conditions
                </Link>
                {' '}and{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-honeybee-primary hover:underline font-semibold"
                  onClick={e => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
                . I understand my data will be used in accordance with these policies.
              </label>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit}
                className="w-full font-black py-3 md:py-4 rounded-xl uppercase tracking-widest transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-honeybee-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Start Your Journey'
                )}
              </Button>
              {!agreedToTerms && (
                <p className="text-[10px] text-center text-gray-400 mt-2">
                  Accept Terms &amp; Conditions to enable sign up
                </p>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">Or continue with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="p-3 shadow-md bg-white hover:shadow-lg rounded-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="Sign up with Google"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              ) : (
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Login link */}
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

        {/* ── Right: Animation ─────────────────────── */}
        <div className="hidden md:block md:w-1/2 relative rounded-r-3xl overflow-hidden border-8 border-white shadow-lg">
          {React.createElement('dotlottie-wc', {
            src: 'https://lottie.host/415db1e3-d9d5-4073-b9fe-099abfe8c66c/XtpXv9SgcE.lottie',
            style: { width: '100%', height: '100%' },
            autoplay: true,
            loop: true,
          })}
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;
