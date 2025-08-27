import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPermissionProps {
  onLocationGranted: (coords: { latitude: number; longitude: number }) => void;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({ onLocationGranted }) => {
  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationGranted(position.coords);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please make sure you have location services enabled in your browser.");
      }
    );
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <MapPin className="w-16 h-16 mx-auto text-white mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Find Farms Near You</h2>
        <p className="text-gray-300 mb-6">Please allow location access to find honey farms in your area.</p>
        <div className="group">
          <button
            onClick={handleAllowLocation}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium animate-button-hover"
          >
            Allow Location Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermission;
