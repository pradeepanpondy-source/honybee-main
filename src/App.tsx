import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import About from "./components/About";
import Contact from "./components/Contact";
import Shop from "./components/Shop";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import Seller from "./components/Seller";
import Subscription from "./components/Subscription";
import Settings from "./components/Settings";
import PageLayout from "./components/PageLayout";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import { CartProvider } from "./context/CartContext";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/home" element={<PageLayout><HomeScreen /></PageLayout>} />
      <Route path="/about" element={<PageLayout><About /></PageLayout>} />
      <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
      <Route path="/shop" element={<PageLayout><Shop /></PageLayout>} />
      <Route path="/cart" element={<PageLayout><CartPage /></PageLayout>} />
      <Route path="/checkout" element={<PageLayout><Checkout /></PageLayout>} />
      <Route path="/profile" element={<PageLayout><Profile /></PageLayout>} />
      <Route path="/seller" element={<PageLayout><Seller /></PageLayout>} />
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
