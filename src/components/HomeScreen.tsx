import { useState, useEffect } from 'react';
import { MapPin, Search, Star, Phone } from 'lucide-react';
import ClickEffect from './ClickEffect';
import LocationPermission from './LocationPermission';
import HomeCards from './HomeCards';
import AnimatedBee from './AnimatedBee';

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

interface HomeScreenProps {
  userName: string;
  latitude?: number;
  longitude?: number;
  onLogout?: () => void;
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

interface HomeScreenProps {
  userName: string;
  latitude?: number;
  longitude?: number;
  onLogout?: () => void;
}

export default function HomeScreen({ userName, latitude, longitude }: HomeScreenProps) {
  const [currentView, setCurrentView] = useState<'home' | 'farms'>('home');
  const [sortedFarms, setSortedFarms] = useState<Farm[]>(mockFarms);
  const [userCoords, setUserCoords] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setUserCoords({latitude, longitude});
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (userCoords) {
      const sorted = [...mockFarms]
        .map((farm) => ({
          ...farm,
          distance: getDistance(userCoords.latitude, userCoords.longitude, farm.lat, farm.lng).toFixed(1) + " km",
        }))
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setSortedFarms(sorted);
      setCurrentView('farms');
    }
  }, [userCoords]);

  if (currentView === 'farms') {
    if (!userCoords) {
      return <LocationPermission onLocationGranted={setUserCoords} />;
    }
    return (
      <div className="relative">
        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for honey farms..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Welcome Section */}
          <div className="text-center mb-12 relative">
          <h2 className="text-9xl font-extrabold text-black mb-4 animate-float animate-pulse-slow" style={{ fontSize: '10rem' }}>Bee Bridge</h2>
          <AnimatedBee />
          <p className="text-xl text-black max-w-2xl mx-auto">
            The global decline of pollinators is a growing threat to agriculture, biodiversity, and food security. Farmers struggle to maintain effective pollination, while consumers demand sustainable and traceable produce. The Bee Bridge Platform offers a web-based solution that connects farmers, beekeepers, and urban supporters in a collaborative ecosystem for sustainable pollination.
          </p>
        </div>

        {/* Farms Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFarms.map((farm) => (
            <div key={farm.id} className="group">
                <ClickEffect className="bg-white rounded-2xl shadow-md animate-card-hover overflow-hidden relative">
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
                      
                      <div className="flex items-center text-primary mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{farm.distance} away</span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{farm.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {farm.honeyTypes.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
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

                      <ClickEffect className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium animate-button-hover">
                        Get Directions
                      </ClickEffect>
                    </div>
                </ClickEffect>
            </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Welcome Section */}
          <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4 animate-pulse-slow">
              Hello {userName}
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Discover the finest local honey farms in your area. Fresh, organic, and sustainably produced honey awaits you.
            </p>
          </div>
        </div>
        
        {/* Interactive Cards Section */}
        <HomeCards />
      </div>
    </>
  );
}
