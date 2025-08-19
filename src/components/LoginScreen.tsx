import React, { useState } from 'react';
import { ChevronRight, MapPin, Users } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import ClickEffect from './ClickEffect';

interface LoginScreenProps {
  onLogin: (provider: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState('');

  const handleLogin = async (provider: string) => {
    setIsLoading(provider);
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading('');
    onLogin(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg animate-honey-drip">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2 animate-welcome-bounce">HoneyFinder</h1>
          <p className="text-amber-700 animate-fade-in-up animate-delay-300">Discover local honey farms near you</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 animate-fade-in-up animate-delay-500 relative z-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center animate-fade-in-up animate-delay-700">Welcome Back</h2>
          
          <div className="space-y-4">
            {/* Google Login */}
            <ClickEffect
              onClick={() => handleLogin('google')}
              className="w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 group animate-fade-in-up animate-delay-1000 relative"
              disabled={isLoading !== ''}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
                {isLoading === 'google' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                )}
              </div>
            </ClickEffect>

            {/* Facebook Login */}
            <ClickEffect
              onClick={() => handleLogin('facebook')}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 group animate-fade-in-up animate-delay-1000 relative"
              disabled={isLoading !== ''}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span className="font-medium">Continue with Facebook</span>
                {isLoading === 'facebook' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </ClickEffect>

            {/* Apple Login */}
            <ClickEffect
              onClick={() => handleLogin('apple')}
              className="w-full flex items-center justify-center px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-200 group animate-fade-in-up animate-delay-1000 relative"
              disabled={isLoading !== ''}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.86 11.38 7.75 12.1 7.75C12.81 7.75 14.28 6.68 15.85 6.84C16.48 6.87 18.02 7.12 19.05 8.55C18.97 8.6 17.27 9.63 17.29 11.74C17.31 14.39 19.59 15.3 19.61 15.31C19.58 15.38 19.25 16.41 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                <span className="font-medium">Continue with Apple</span>
                {isLoading === 'apple' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </ClickEffect>
          </div>

          <div className="mt-6 text-center animate-fade-in-up animate-delay-1000">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}