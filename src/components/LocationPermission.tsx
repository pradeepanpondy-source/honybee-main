import React, { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import ClickEffect from './ClickEffect';

interface LocationPermissionProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export default function LocationPermission({ isOpen, onClose, onAllow, onDeny }: LocationPermissionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAllow = async () => {
    setIsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      console.log('Location obtained:', position.coords);
      onAllow();
    } catch (error) {
      console.error('Location access denied or failed:', error);
      onDeny();
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in-up animate-delay-200">
        <ClickEffect
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </ClickEffect>

        <div className="text-center animate-fade-in-up animate-delay-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4 animate-honey-drip">
            <MapPin className="w-8 h-8 text-amber-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2 animate-welcome-bounce">
            Allow Location Access?
          </h3>
          
          <p className="text-gray-600 mb-6 animate-fade-in-up animate-delay-500">
            We need your location to find nearby honey farms and provide you with the best local recommendations.
          </p>

          <div className="space-y-3 animate-fade-in-up animate-delay-700">
            <ClickEffect
              onClick={handleAllow}
              className="w-full flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-200 relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Getting location...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5 mr-2" />
                  Allow Location Access
                </>
              )}
            </ClickEffect>

            <ClickEffect
              onClick={onDeny}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
            >
              Not now
            </ClickEffect>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-left bg-gray-50 rounded-lg p-3 animate-fade-in-up animate-delay-1000">
            <strong>Why we need this:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Find farms closest to you</li>
              <li>Calculate accurate distances</li>
              <li>Provide driving directions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}