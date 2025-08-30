import React, { useState } from 'react';

interface SignUpScreenProps {
  onSignUp?: (provider: string) => void;
  onNavigateToLogin?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUpClick = () => {
    if (onSignUp) {
      onSignUp('email');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen bg-honeybee-background relative overflow-hidden rounded-3xl shadow-lg max-w-6xl mx-auto my-12">
      {/* Left side - form */}
      <div className="flex-1 bg-white rounded-l-3xl p-12 flex flex-col justify-center relative z-10">
        {/* Background circle behind "Sign Up" */}
        <div className="absolute top-12 left-12 w-8 h-8 bg-honeybee-accent rounded-full opacity-70"></div>

        <h1 className="text-4xl font-extrabold text-black relative z-20 mb-2 flex items-center">
          <span className="absolute left-0 w-8 h-8 bg-honeybee-accent rounded-full opacity-70 -ml-10"></span>
          Sign Up
        </h1>
        <p className="text-black mb-8">Create your account to get started</p>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-extrabold text-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-honeybee-accent text-black"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-extrabold text-black mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-honeybee-accent pr-12 text-black"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.423M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-extrabold text-black mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-honeybee-accent pr-12 text-black"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.423M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSignUpClick}
            className="w-full py-3 bg-honeybee-primary hover:bg-honeybee-dark text-white font-semibold rounded-md transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-black text-sm">Or Continue With</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => onSignUp && onSignUp('google')}
            className="flex items-center justify-center flex-1 border border-gray-300 rounded-md py-2 hover:shadow-md transition duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            Google
          </button>
          <button
            type="button"
            onClick={() => onSignUp && onSignUp('facebook')}
            className="flex items-center justify-center flex-1 border border-gray-300 rounded-md py-2 hover:shadow-md transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-600 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 4.9 3.5 8.9 8 9.8v-6.9H7v-2.9h3V9.5c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 2v2.3h3.4l-.5 2.9h-2.9v6.9c4.5-.9 8-4.9 8-9.8z" />
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center text-black mt-8">
          Already have an account?{' '}
          <span
            className="text-black cursor-pointer hover:underline"
            onClick={() => onNavigateToLogin && onNavigateToLogin()}
          >
            Log in
          </span>
        </p>
      </div>

      {/* Right side - image */}
      <div className="flex-1 rounded-r-3xl overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Woman with headphones"
          className="w-full h-full object-cover"
        />
        {/* Background purple overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-honeybee-accent to-honeybee-background opacity-70"></div>
      </div>

      {/* Background shapes */}
      <svg
        className="absolute -bottom-40 -left-40 w-96 h-96 text-honeybee-accent opacity-30"
        fill="none"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="200" fill="currentColor" />
      </svg>
      <svg
        className="absolute top-20 right-20 w-72 h-72 text-honeybee-background opacity-40"
        fill="none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="100" fill="currentColor" />
      </svg>
    </div>
  );
};

export default SignUpScreen;
