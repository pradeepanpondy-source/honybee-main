import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import NameCollection from './components/NameCollection';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import Shop from './components/Shop';
import Cart from './components/Cart';
import Seller from './components/Seller';
import Profile from './components/Profile';

type AppState = 'login' | 'name-collection' | 'home' | 'shop' | 'cart' | 'seller' | 'profile' | 'farms';

interface User {
  name: string;
  provider: string;
  age?: number;
  location?: string;
  address?: string;
  pincode?: string;
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
        setUser(userData);
        setAppState('home');
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('honeyBridgeUser');
      }
    }
  }, []);

  const handleLogin = (provider: string) => {
    console.log(`Logged in with ${provider}`);
    setUser({ name: '', provider });
    setAppState('name-collection');
  };

  const handleNameSubmit = (name: string) => {
    const userData = { ...user, name } as User; // Update user with name
    setUser(userData);
    // Save to localStorage for persistence
    localStorage.setItem('honeyBridgeUser', JSON.stringify(userData));
    setAppState('home');
  };


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('honeyBridgeUser');
    setAppState('login');
  };

  switch (appState) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
    
    case 'name-collection':
      return <NameCollection onNameSubmit={handleNameSubmit} />;

    case 'home':
      return user ? (
        <>
          <Navigation activeTab="home" onTabChange={(tab: string) => setAppState(tab as AppState)} />
          <HomeScreen userName={user.name} onLogout={handleLogout} />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      );

    case 'shop':
      return user ? (
        <>
          <Navigation activeTab="shop" onTabChange={(tab: string) => setAppState(tab as AppState)} />
          <Shop />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      );

    case 'cart':
      return user ? (
        <>
          <Navigation activeTab="cart" onTabChange={(tab: string) => setAppState(tab as AppState)} />
          <Cart />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      );

    case 'seller':
      return user ? (
        <>
          <Navigation activeTab="seller" onTabChange={(tab: string) => setAppState(tab as AppState)} />
          <Seller />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      );

    case 'profile':
      return user ? (
        <>
          <Navigation activeTab="profile" onTabChange={(tab) => setAppState(tab as AppState)} />
          <Profile />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      );

    case 'farms':
      return user ? (
        <>
          <Navigation activeTab="farms" onTabChange={(tab) => setAppState(tab as AppState)} />
          {/* For now, this will render the HomeScreen, which has the farms view logic */}
          <HomeScreen userName={user.name} onLogout={handleLogout} />
        </>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      );

    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

export default App;
