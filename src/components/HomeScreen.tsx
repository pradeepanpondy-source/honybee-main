import React, { useState } from 'react';
import { MapPin, Search, Star, Clock, Phone, Navigation } from 'lucide-react';
import LocationPermission from './LocationPermission';
import AnimatedBackground from './AnimatedBackground';
import ClickEffect from './ClickEffect';

interface HomeScreenProps {
  userName: string;
  onLogout: () => void;
}

interface Farm {
  id: number;
  name: string;
  distance: string;
  rating: number;
  image: string;
  description: string;
  phone: string;
  address: string;
  honeyTypes: string[];
}

const mockFarms: Farm[] = [
  {
    id: 1,
    name: "Golden Valley Apiaries",
    distance: "2.3 km",
    rating: 4.8,
    image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg",
    description: "Organic wildflower honey from local meadows",
    phone: "(555) 123-4567",
    address: "123 Farm Road, Valley Creek",
    honeyTypes: ["Wildflower", "Clover", "Orange Blossom"]
  },
  {
    id: 2,
    name: "Meadowbrook Honey Farm",
    distance: "5.1 km",
    rating: 4.6,
    image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg",
    description: "Family-owned farm with premium raw honey",
    phone: "(555) 234-5678",
    address: "456 Honey Lane, Meadowbrook",
    honeyTypes: ["Raw Honey", "Manuka", "Acacia"]
  },
  {
    id: 3,
    name: "Sunrise Bee Company",
    distance: "8.7 km",
    rating: 4.9,
    image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg",
    description: "Award-winning artisanal honey varieties",
    phone: "(555) 345-6789",
    address: "789 Sunrise Ave, Highland",
    honeyTypes: ["Lavender", "Eucalyptus", "Buckwheat"]
  }
];

export default function HomeScreen({ userName, onLogout }: HomeScreenProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'farms'>('home');

  const handleFindFarms = () => {
    if (!locationGranted) {
      setShowLocationModal(true);
    } else {
      setCurrentView('farms');
    }
  };

  const handleLocationAllow = () => {
    setLocationGranted(true);
    setShowLocationModal(false);
    setCurrentView('farms');
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
    // Could show alternative options or continue without location
  };

  if (currentView === 'farms') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 relative">
        <AnimatedBackground />
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-amber-100 relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <ClickEffect
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-2 text-amber-600 hover:text-amber-700"
              >
                <Navigation className="w-5 h-5 rotate-180" />
                <span className="font-medium">Back to Home</span>
              </ClickEffect>
              <h1 className="text-xl font-bold text-amber-900">Nearby Farms</h1>
              <ClickEffect
                onClick={onLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg"
              >
                Logout
              </ClickEffect>
            </div>
          </div>
        </div>

        {/* Find Nearby Farms Section - Moved to top */}
        <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Find Nearby Farms</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explore a curated list of honey farms close to your current location. Get directions, contact info, and more.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 pb-6 relative z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for honey farms..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Farms Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFarms.map((farm) => (
            <ClickEffect key={farm.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{farm.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{farm.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-amber-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{farm.distance} away</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{farm.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {farm.honeyTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {farm.phone}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                      {farm.address}
                    </div>
                  </div>

                  <ClickEffect className="w-full mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
                    Get Directions
                  </ClickEffect>
                </div>
              </ClickEffect>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 relative">
        <AnimatedBackground />
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-amber-100 relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-amber-900">Honey Bridge</h1>
                  <p className="text-sm text-amber-700">Welcome, {userName}!</p>
                </div>
              </div>
              <ClickEffect
                onClick={onLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </ClickEffect>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Hello, {userName}! 🍯
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Discover the finest local honey farms in your area. Fresh, organic, and sustainably produced honey awaits you.
            </p>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Find Farms Card */}
            <ClickEffect onClick={handleFindFarms} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Find Nearby Farms</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Explore a curated list of honey farms close to your current location. Get directions, contact info, and more.
              </p>
              <ClickEffect onClick={handleFindFarms} className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors relative">
                <Search className="w-5 h-5 mr-2" />
                Find Farms Now
              </ClickEffect>
            </ClickEffect>
            {/* Favorites Card */}
            <ClickEffect className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Your Favorites</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Keep track of your favorite farms and honey varieties. Build your personal collection of the best local honey.
              </p>
              <ClickEffect className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors relative">
                View Favorites
              </ClickEffect>
            </ClickEffect>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClickEffect className="bg-white rounded-xl shadow-md p-6 text-center relative">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Real-time Hours</h4>
              <p className="text-sm text-gray-600">Check current operating hours and availability</p>
            </ClickEffect>
            
            <ClickEffect className="bg-white rounded-xl shadow-md p-6 text-center relative">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Navigation className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">GPS Directions</h4>
              <p className="text-sm text-gray-600">Get turn-by-turn directions to any farm</p>
            </ClickEffect>
            
            <ClickEffect className="bg-white rounded-xl shadow-md p-6 text-center relative">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Direct Contact</h4>
              <p className="text-sm text-gray-600">Call or visit farms directly from the app</p>
            </ClickEffect>
          </div>
        </div>
      </div>

      <LocationPermission
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAllow={handleLocationAllow}
        onDeny={handleLocationDeny}
      />
    </>
  );
}