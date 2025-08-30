import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Seller from './components/Seller';
import Profile from './components/Profile';
import Subscription from './components/Subscription';
import PageLayout from './components/PageLayout';
import SignUpScreen from './components/SignUpScreen';

type AppState = 'login' | 'home' | 'shop' | 'cart' | 'seller' | 'profile' | 'farms' | 'subscription' | 'signup';

interface User {
  name: string;
  provider: string;
  age?: number;
  location?: string;
  address?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

function App() { 
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('honeyBridgeUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('User data retrieved:', userData); // Log user data
        setUser(userData);
        setAppState('home');
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('honeyBridgeUser');
      }
    }
  }, []);

  const handleLogin = (provider: string, coords?: GeolocationCoordinates) => {
    console.log(`Logged in with ${provider}`);
    if (coords) {
      setUser({ name: '', provider, latitude: coords.latitude, longitude: coords.longitude });
    } else {
      setUser({ name: '', provider });
    }
    setAppState('home');
  };

  // Remove NameCollection and SignUpScreen from appState switch to directly go from login to home

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('honeyBridgeUser');
    setAppState('login');
  };

  switch (appState) {
    case 'login':
      return <LoginScreen onLogin={handleLogin as (provider: string, coords?: GeolocationCoordinates) => void} onNavigateToSignUp={() => setAppState('signup')} />;
    
    case 'signup':
      return <SignUpScreen onSignUp={handleLogin} onNavigateToLogin={() => setAppState('login')} />;

    case 'home':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="home" onTabChange={(tab: string) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <HomeScreen userName={user.name} latitude={user.latitude} longitude={user.longitude} />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />
      );

    case 'shop':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="shop" onTabChange={(tab: string) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <Shop />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />
      );

    case 'cart':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="cart" onTabChange={(tab: string) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <Cart />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin as (provider: string, coords?: GeolocationCoordinates) => void} onNavigateToSignUp={() => setAppState('signup')} />
      );

    case 'seller':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="seller" onTabChange={(tab: string) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <Seller />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />
      );

    case 'subscription':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="subscription" onTabChange={(tab) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <Subscription />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />
      );

    case 'profile':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="profile" onTabChange={(tab) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <Profile />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />
      );

    case 'farms':
      return user ? (
        <PageLayout
          navigation={<Navigation activeTab="farms" onTabChange={(tab) => setAppState(tab as AppState)} onLogout={handleLogout} />}
        >
          <HomeScreen userName={user.name} latitude={user.latitude} longitude={user.longitude} />
        </PageLayout>
      ) : (
        <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />
      );

    default:
      return <LoginScreen onLogin={handleLogin} onNavigateToSignUp={() => setAppState('signup')} />;
  }
}

export default App;
