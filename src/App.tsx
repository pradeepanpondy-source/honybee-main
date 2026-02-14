import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import About from "./components/About";
import Contact from "./components/Contact";
import Shop from "./components/Shop";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import Seller from "./components/Seller";
import Applications from "./components/Applications";
import Orders from './components/Orders';
import Subscription from "./components/Subscription";
import Settings from './components/Settings';
import SellerProducts from './components/SellerProducts';
import SellerAnalytics from './components/SellerAnalytics';
import SellerEarnings from './components/SellerEarnings';
import ProductDetails from "./components/ProductDetails";
import PageLayout from "./components/PageLayout";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import VerifyEmail from "./components/VerifyEmail";
import { CartProvider } from "./context/CartContext";

console.log("Fresh Code Loaded: v2 - Fixed Price Type");

import { useAuth } from "./hooks/useAuth";
import LoadingSkeleton from "./components/LoadingSkeleton";
import SellerGuard from "./components/SellerGuard";

const sellerBackground = 'https://media.istockphoto.com/id/1669258600/vector/illustration-of-delicious-melted-chocolate-on-white-background.jpg?s=612x612&w=0&k=20&c=oykGVJHBjHuevHVi2GE8jFmCe0EpX2unEfhMPCFFeik=';

function AppRoutes() {
  const { user, loading } = useAuth();

  // Check if user just logged out OR just signed up - prevent auto-redirect
  const justLoggedOut = localStorage.getItem('justLoggedOut') === 'true';
  const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
  if (justLoggedOut && !user) {
    localStorage.removeItem('justLoggedOut');
  }
  if (justSignedUp) {
    // Don't remove flag here - let signup screen handle navigation
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/login" element={(!user || justLoggedOut) ? <LoginScreen /> : <Navigate to="/home" />} />
      <Route path="/signup" element={(user && !justSignedUp) ? <Navigate to="/home" /> : <SignUpScreen />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/home" element={user ? <PageLayout><HomeScreen /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/about" element={user ? <PageLayout><About /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/contact" element={user ? <PageLayout><Contact /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/shop" element={user ? <PageLayout><Shop /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/cart" element={user ? <PageLayout><CartPage /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/checkout" element={user ? <PageLayout><Checkout /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <PageLayout><Profile /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/seller" element={user ? <PageLayout backgroundImage={sellerBackground}><Seller /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/applications" element={user ? <SellerGuard><Applications /></SellerGuard> : <Navigate to="/login" />} />
      <Route path="/orders" element={user ? <SellerGuard><Orders /></SellerGuard> : <Navigate to="/login" />} />
      <Route path="/subscription" element={user ? <PageLayout><Subscription /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <SellerGuard><Settings /></SellerGuard> : <Navigate to="/login" />} />
      {/* Protected Seller Routes */}
      <Route path="/products" element={user ? <SellerGuard><SellerProducts /></SellerGuard> : <Navigate to="/login" />} />
      <Route path="/product/beehive" element={user ? <PageLayout><ProductDetails /></PageLayout> : <Navigate to="/login" />} />
      <Route path="/analytics" element={user ? <SellerGuard><SellerAnalytics /></SellerGuard> : <Navigate to="/login" />} />
      <Route path="/earnings" element={user ? <SellerGuard><SellerEarnings /></SellerGuard> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;
