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
import Orders from "./components/Orders";
import Subscription from "./components/Subscription";
import Settings from "./components/Settings";
import PageLayout from "./components/PageLayout";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import { CartProvider } from "./context/CartContext";

import { useAuth } from "./hooks/useAuth";
import LoadingSkeleton from "./components/LoadingSkeleton";

const sellerBackground = 'https://media.istockphoto.com/id/1669258600/vector/illustration-of-delicious-melted-chocolate-on-white-background.jpg?s=612x612&w=0&k=20&c=oykGVJHBjHuevHVi2GE8jFmCe0EpX2unEfhMPCFFeik=';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginScreen />} />
      <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUpScreen />} />
      <Route path="/home" element={<PageLayout><HomeScreen /></PageLayout>} />
      <Route path="/about" element={<PageLayout><About /></PageLayout>} />
      <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
      <Route path="/shop" element={<PageLayout><Shop /></PageLayout>} />
      <Route path="/cart" element={<PageLayout><CartPage /></PageLayout>} />
      <Route path="/checkout" element={<PageLayout><Checkout /></PageLayout>} />
      <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
      <Route path="/seller" element={<PageLayout backgroundImage={sellerBackground}><Seller /></PageLayout>} />
      <Route path="/applications" element={<PageLayout><Applications /></PageLayout>} />
      <Route path="/orders" element={<PageLayout><Orders /></PageLayout>} />
      <Route path="/subscription" element={<PageLayout><Subscription /></PageLayout>} />
      <Route path="/settings" element={<PageLayout><Settings /></PageLayout>} />
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
