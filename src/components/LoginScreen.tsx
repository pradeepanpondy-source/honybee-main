import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Button from './Button';
import { Eye, EyeOff } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleIconLoaded, setGoogleIconLoaded] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  // Preload Google icon for faster loading
  useEffect(() => {
    const img = new Image();
    img.src = 'https://developers.google.com/identity/images/g-logo.png';
    img.onload = () => setGoogleIconLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        loginMethod: 'email',
        lastLogin: new Date(),
      }, { merge: true });

      navigate('/home');
    } catch (err: unknown) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';

      if (err && typeof err === 'object' && 'code' in err) {
        switch (err.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Please contact support.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed login attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Authentication error: ${err.code}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center px-4 relative">
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
            <button
              onClick={async () => {
                setGoogleLoading(true);
                try {
                  console.log('Starting Google login process...');
                  await signInWithGoogle();
                  console.log('Google authentication and navigation completed...');
                  // Set flag for mobile login animation
                  sessionStorage.setItem('fromLogin', 'true');
                  navigate(-1);
                } catch (error: unknown) {
                  console.error('Google login process failed:', error);
                  // Don't navigate on error - let user try again
                } finally {
                  setGoogleLoading(false);
                }
              }}
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
          <div className="mt-6 text-center">
            <Button
              onClick={() => {
                localStorage.setItem('guestMode', 'true');
                navigate('/home');
              }}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 underline font-semibold"
            >
              Continue as Guest
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