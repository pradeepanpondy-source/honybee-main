import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import About from "./components/About";
import Contact from "./components/Contact";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import Seller from "./components/Seller";
import Settings from "./components/Settings";
import PageLayout from "./components/PageLayout";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import { CartProvider } from "./context/CartContext";

import RoamingBee from "./components/RoamingBee";

function App() {
  return (
    <CartProvider>
      <RoamingBee />
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/*" element={
            <PageLayout>
              <RoamingBee />
              <Routes>
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/seller" element={<Seller />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </PageLayout>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
