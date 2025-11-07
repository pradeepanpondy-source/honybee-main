import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fndImage from '../assets/fnd.png';
import LetterWave from './LetterWave';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user came from login (mobile redirect)
    const fromLogin = sessionStorage.getItem('fromLogin');
    if (fromLogin) {
      sessionStorage.removeItem('fromLogin');
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 2000); // Longer loading for mobile login
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
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
            <div className="text-center mb-16 px-4 sm:px-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif vibrant-text mb-8 font-bold">
                <LetterWave text="Bee Bridge" animationDelayStep={0.1} />
              </h2>
              <p className="text-lg sm:text-xl text-honeybee-dark max-w-2xl mx-auto mb-10 font-medium">
                We're the bridge between the farmer's field, the beekeeper's hive, to the honey in your home.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/shop" className="gradient-bg-primary hover:shadow-2xl text-black font-semibold py-3 px-6 sm:py-4 sm:px-10 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105">
                  Shop Now
                </Link>
                <Link to="/about" className="glass-effect bright-border text-honeybee-dark hover:bg-honeybee-primary hover:text-black font-semibold py-3 px-6 sm:py-4 sm:px-10 rounded-full transition-all duration-300 ease-out modern-shadow-hover transform hover:scale-105">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Farmers and Consumers Section */}
          <div className="max-w-6xl mx-auto px-4 py-6">
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


        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-honeybee-dark mb-6 text-center">Service</h2>
      </div>
      {/* Animation Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <video
              src="/assets/cart-animated-icon-gif-download-10270594.mp4"
              autoPlay
              loop
              muted
              controls={false}
              className="w-20 h-20 md:w-48 md:h-48"
              preload="metadata"
            />
            <div className="mx-4 md:mx-8">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-black transform md:rotate-0 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <video
              src="/assets/payment-complete-animation-gif-download-4281059.mp4"
              autoPlay
              loop
              muted
              controls={false}
              className="w-20 h-20 md:w-48 md:h-48"
              preload="metadata"
            />
            <div className="mx-4 md:mx-8">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-black transform md:rotate-0 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <video
              src="/assets/delivery-animation-gif-download-3434735.mp4"
              autoPlay
              loop
              muted
              controls={false}
              className="w-20 h-20 md:w-48 md:h-48"
              preload="metadata"
            />
            <div className="mx-4 md:mx-8">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-black transform md:rotate-0 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <video
              src="/assets/2.mp4"
              autoPlay
              loop
              muted
              controls={false}
              className="w-20 h-20 md:w-48 md:h-48"
              preload="metadata"
            />
          </div>
        </div>
      </section>



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

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-honeybee-dark mb-6">What Our Customers Say</h2>
            <p className="text-base sm:text-lg text-gray-600">Hear from farmers, beekeepers, and honey lovers who trust Bee Bridge</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-honeybee-light p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-honeybee-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">JD</div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="font-semibold text-honeybee-dark text-sm sm:text-base">John Doe</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Organic Farmer</p>
                </div>
              </div>
              <p className="text-gray-700 italic text-sm sm:text-base">"Bee Bridge has revolutionized how I sell my honey. The platform is easy to use and connects me directly with consumers who appreciate quality."</p>
            </div>
            <div className="bg-honeybee-light p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-honeybee-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">SM</div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="font-semibold text-honeybee-dark text-sm sm:text-base">Sarah Miller</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Home Chef</p>
                </div>
              </div>
              <p className="text-gray-700 italic text-sm sm:text-base">"The honey from Bee Bridge is pure and delicious. I love knowing it's sourced sustainably and supports local beekeepers."</p>
            </div>
            <div className="bg-honeybee-light p-4 sm:p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-honeybee-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">RB</div>
                <div className="ml-3 sm:ml-4">
                  <h4 className="font-semibold text-honeybee-dark text-sm sm:text-base">Robert Brown</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Beekeeper</p>
                </div>
              </div>
              <p className="text-gray-700 italic text-sm sm:text-base">"Partnering with Bee Bridge has allowed me to focus on beekeeping while they handle the marketplace. It's a win-win for everyone."</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
