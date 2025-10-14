import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fndImage from '../assets/fnd.png';
import LetterWave from './LetterWave';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
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

      <div className="relative min-h-screen gradient-bg-warm">
        <div className="relative z-20 pt-[80px]">
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-16 px-6">
              <h2 className="text-5xl font-serif vibrant-text mb-8 font-bold">
                <LetterWave text="Bee Bridge" animationDelayStep={0.1} />
              </h2>
              <p className="text-xl text-honeybee-dark max-w-2xl mx-auto mb-10 font-medium">
                We're the bridge between the farmer's field, the beekeeper's hive, to the honey in your home.
              </p>
              <div className="flex justify-center gap-6">
                <Link to="/shop" className="gradient-bg-primary hover:shadow-2xl text-black font-semibold py-4 px-10 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105">
                  Shop Now
                </Link>
                <Link to="/about" className="glass-effect bright-border text-honeybee-dark hover:bg-honeybee-primary hover:text-black font-semibold py-4 px-10 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Farmers and Consumers Section */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-honeybee-dark mb-10 text-center">Connecting Farmers and Consumers</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={fndImage}
                alt="Farmers and Consumers"
                className="w-full md:w-1/2 h-64 md:h-80 object-cover rounded-lg shadow-lg"
              />
              <p className="text-lg text-honeybee-dark-brown max-w-xl">
                Our platform bridges the gap between farmers and consumers, ensuring fresh, organic produce reaches your table directly from the source or become a seller through our marketplace and sell/rent the bee colonies.
              </p>
            </div>
          </div>


        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-honeybee-dark mb-6 text-center">Service</h2>
      </div>
      {/* Animation Section */}
      <section className="py-20 bg-honeybee-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <video
              src="/assets/cart-animated-icon-gif-download-10270594.mp4"
              autoPlay
              loop
              muted
              className="w-48 h-48"
            />
            <div className="mx-8">
              <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <video
              src="/assets/payment-complete-animation-gif-download-4281059.mp4"
              autoPlay
              loop
              muted
              className="w-48 h-48"
            />
            <div className="mx-8">
              <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <video
              src="/assets/delivery-animation-gif-download-3434735.mp4"
              autoPlay
              loop
              muted
              className="w-48 h-48"
            />
            <div className="mx-8">
              <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <video
              src="/assets/2.mp4"
              autoPlay
              loop
              muted
              className="w-48 h-48"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-honeybee-dark mb-6 text-center">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover our selection of premium organic honey products, harvested with care and love.</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">[Product images and links will be displayed here.]</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-honeybee-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-honeybee-dark mb-6 text-center">Our Story</h2>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              At Honybee, our journey began with a deep appreciation for the delicate balance of nature and the hardworking bees that produce nature's golden elixir. We source our honey from sustainable apiaries across the globe, partnering with passionate beekeepers who prioritize environmental stewardship and ethical practices. Each harvest is done with care and love, ensuring that our products not only delight the senses but also support biodiversity and local communities. From the sun-drenched meadows of Europe to the wild landscapes of North America, our commitment to purity and sustainability shines through in every jar. Join us in savoring the authentic taste of organic honey, harvested with respect for the earth and its pollinators.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              As you explore our collection, you'll feel the warmth of our dedication to quality and the joy of connecting with nature's bounty. We're more than just a marketplace; we're a community united by the love of honey and the bees that make it possible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
