import { useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import ClickEffect from './ClickEffect';

interface LoginScreenProps {
  onLogin: (provider: string, coords?: GeolocationCoordinates) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState('');
  const [, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [, setError] = useState<string | null>(null);
  // TODO: Display error message to user when geolocation fails

  const handleLocationAccess = () => {
    setIsLoading('location');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          setIsLoading('');
          onLogin('location', position.coords);
        },
        (error) => {
          setError(error.message);
          setIsLoading('');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setIsLoading('');
    }
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
          <h1 className="text-3xl font-bold text-amber-900 mb-2 animate-welcome-bounce">HoneyBridge</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 animate-fade-in-up animate-delay-500 relative z-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center animate-fade-in-up animate-delay-700">Welcome Back</h2>
          
          <div className="space-y-4">
            {/* Location Access Button */}
            <ClickEffect
              onClick={handleLocationAccess}
              className="w-full flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all duration-200 group animate-fade-in-up animate-delay-1000 relative"
              disabled={isLoading !== ''}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Find Honey Near Me</span>
                {isLoading === 'location' ? (
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