import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import fndImage from '../assets/fnd.png';
import heroBg from '../assets/hero-bg.png';
import LetterWave from './LetterWave';
import Testimonials from './Testimonials';
import { X, Clock } from 'lucide-react';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [showSellerBanner, setShowSellerBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show banner if redirected from SellerGuard (unapproved seller)
    if ((location.state as any)?.sellerPending) {
      setShowSellerBanner(true);
      // Clear state so banner doesn't reappear on re-render
      window.history.replaceState({}, document.title);
    }

    // Check if user came from login (mobile redirect)
    const fromLogin = sessionStorage.getItem('fromLogin');
    if (fromLogin) {
      sessionStorage.removeItem('fromLogin');
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* Seller pending banner — shown when SellerGuard redirects unapproved seller */}
      {showSellerBanner && (
        <div className="sticky top-0 z-40 bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-800">
            <Clock className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-sm font-semibold">
              Your seller account is under review. You'll receive an email once approved (24–48 hrs).
            </p>
          </div>
          <button
            onClick={() => setShowSellerBanner(false)}
            className="text-amber-500 hover:text-amber-700 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
          {React.createElement('dotlottie-wc', {
            src: 'https://lottie.host/81653027-58d6-47e3-9de5-491db6a527a5/TWNyD5vQVe.lottie',
            style: { width: '150px', height: '150px', opacity: 0.3 },
            autoplay: true,
            loop: true
          })}
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        {/* Background Image */}
        <img
          src={heroBg}
          alt="Bee Bridge — serene landscape with beehive, lake, and mountains"
          className="hero-bg-image"
          loading="eager"
          decoding="async"
        />

        {/* Gradient Overlay */}
        <div className="hero-overlay" />

        {/* Bottom Fade to Cream */}
        <div className="hero-fade-bottom" />

        {/* Hero Content */}
        <div className="hero-content">
          {/* Floating Badge */}
          <div className="hero-badge">
            <span className="badge-dot" />
            Farm-to-Home Honey Marketplace
          </div>

          {/* Title */}
          <h1 className="hero-title">
            <span className="hero-title-accent">
              <LetterWave text="Bee Bridge" animationDelayStep={0.1} />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            We're the bridge between the farmer's field, the beekeeper's hive, to the honey in your home.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/shop" className="hero-cta-primary">
              Shop Now
            </Link>
            <Link to="/about" className="hero-cta-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Farmers and Consumers Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-honeybee-dark mb-10 text-center">Connecting Farmers and Consumers</h2>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <img
            src={fndImage}
            alt="Farmers and Consumers"
            className="w-full lg:w-1/2 h-64 sm:h-72 md:h-80 object-cover rounded-lg shadow-lg"
          />
          <p className="text-base sm:text-lg text-honeybee-dark-brown max-w-xl">
            Our platform bridges the gap between farmers and consumers, ensuring fresh, organic produce reaches your table directly from the source or become a seller through our marketplace and sell/rent the bee colonies.
          </p>
        </div>
      </div>




      {/* Our Story Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-honeybee-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-honeybee-dark mb-6 text-center">Our Story</h2>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              At Bee Bridge, our journey began with a deep appreciation for the delicate balance of nature and the hardworking bees that produce nature's golden elixir. We source our honey from sustainable apiaries across the globe, partnering with passionate beekeepers who prioritize environmental stewardship and ethical practices. Each harvest is done with care and love, ensuring that our products not only delight the senses but also support biodiversity and local communities. From the sun-drenched meadows of Europe to the wild landscapes of North America, our commitment to purity and sustainability shines through in every jar. Join us in savoring the authentic taste of organic honey, harvested with respect for the earth and its pollinators.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              As you explore our collection, you'll feel the warmth of our dedication to quality and the joy of connecting with nature's bounty. We're more than just a marketplace; we're a community united by the love of honey and the bees that make it possible.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials — infinite scroll carousel */}
      <Testimonials />
    </div>
  );
}
