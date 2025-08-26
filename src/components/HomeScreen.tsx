import { useState, useEffect } from 'react';
import { MapPin, Search, Star, Clock, Phone, Navigation } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import ClickEffect from './ClickEffect';

interface HomeScreenProps {
  userName: string;
  onLogout: () => void;
  latitude?: number;
  longitude?: number;
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
  lat: number;
  lng: number;
}

const mockFarms: Farm[] = [
  {
    id: 1,
    name: "Golden Valley Apiaries",
    distance: "",
    rating: 4.8,
    image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg",
    description: "Organic wildflower honey from local meadows",
    phone: "(555) 123-4567",
    address: "123 Farm Road, Valley Creek",
    honeyTypes: ["Wildflower", "Clover", "Orange Blossom"],
    lat: 34.0522,
    lng: -118.2437
  },
  {
    id: 2,
    name: "Meadowbrook Honey Farm",
    distance: "",
    rating: 4.6,
    image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg",
    description: "Family-owned farm with premium raw honey",
    phone: "(555) 234-5678",
    address: "456 Honey Lane, Meadowbrook",
    honeyTypes: ["Raw Honey", "Manuka", "Acacia"],
    lat: 34.1522,
    lng: -118.3437
  },
  {
    id: 3,
    name: "Sunrise Bee Company",
    distance: "",
    rating: 4.9,
    image: "https://images.pexels.com/photos/4022090/pexels-photo-4022090.jpeg",
    description: "Award-winning artisanal honey varieties",
    phone: "(555) 345-6789",
    address: "789 Sunrise Ave, Highland",
    honeyTypes: ["Lavender", "Eucalyptus", "Buckwheat"],
    lat: 34.2522,
    lng: -118.4437
  }
];

// Function to calculate distance between two coordinates (in km)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export default function HomeScreen({ userName, onLogout, latitude, longitude }: HomeScreenProps) {
  const [currentView, setCurrentView] = useState<'home' | 'farms'>('home');
  const [showSettings, setShowSettings] = useState(false);
  const [sortedFarms, setSortedFarms] = useState<Farm[]>(mockFarms);

  useEffect(() => {
    if (latitude && longitude) {
      const sorted = [...mockFarms]
        .map((farm) => ({
          ...farm,
          distance: getDistance(latitude, longitude, farm.lat, farm.lng).toFixed(1) + " km",
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setSortedFarms(sorted);
      setCurrentView('farms');
    }
  }, [latitude, longitude]);

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
              <div className="relative">
                <ClickEffect
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </ClickEffect>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for honey farms..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">Bee Bridge</h2>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            The global decline of pollinators is a growing threat to agriculture, biodiversity, and food security. Farmers struggle to maintain effective pollination, while consumers demand sustainable and traceable produce. The Bee Bridge Platform offers a web-based solution that connects farmers, beekeepers, and urban supporters in a collaborative ecosystem for sustainable pollination.
          </p>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            The platform simplifies bee colony rentals through easy registration, efficient matchmaking, and real-time monitoring of hive health and productivity. Farmers benefit from improved crop yields and income without requiring advanced beekeeping knowledge, while beekeepers gain streamlined hive management and new revenue opportunities. Consumers also engage directly by purchasing raw, natural honey from farms, ensuring fair pricing and traceability.
          </p>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Designed with intuitive interfaces, secure data management, and mobile accessibility, Bee Bridge makes pollination services more accessible and reliable. It not only addresses agricultural challenges but also empowers urban communities to contribute to biodiversity and environmental sustainability.
          </p>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            By fostering collaboration between growers, beekeepers, and consumers, Bee Bridge creates a scalable model that enhances food production, strengthens pollinator health, and supports sustainable livelihoods. This approach aligns with global sustainability goals and directly supports:
          </p>
          <ul className="list-disc list-inside mt-1 space-y-1 text-xl text-amber-700">
            <li>SDG 12 (Responsible Consumption and Production): Promoting fair trade, reducing intermediaries, and ensuring traceable food systems.</li>
            <li>SDG 8 (Decent Work and Economic Growth): Creating sustainable income opportunities for farmers and beekeepers through digital innovation.</li>
            <li>SDG 15 (Life on Land): Conserving pollinators and enhancing biodiversity for resilient ecosystems.</li>
          </ul>
        </div>

        {/* Farms Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFarms.map((farm) => (
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
                </div>
              </div>
              <div className="relative">
                <ClickEffect
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </ClickEffect>
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-200">
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
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

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Real-time Hours</h4>
              <p className="text-sm text-gray-600">Check current operating hours and availability</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">GPS Directions</h4>
              <p className="text-sm text-gray-600">Get turn-by-turn directions to any farm</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Direct Contact</h4>
              <p className="text-sm text-gray-600">Call or visit farms directly from the app</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}