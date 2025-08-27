import React from 'react';

interface LoginScreenProps {
  onLogin: (provider: string, coords?: GeolocationCoordinates) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const handleGuestLogin = () => {
    // Login as guest without location data
    onLogin('guest');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="group">
        <div className="bg-white rounded-lg shadow-lg animate-card-hover p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>
          <div className="group">
            <button
              onClick={handleGuestLogin}
              className="w-full py-3 bg-blue-600 text-white rounded-md animate-button-hover mt-4"
            >
              Login as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
