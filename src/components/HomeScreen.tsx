
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
            <h2 className="text-3xl font-bold text-honeybee-dark mb-6 text-center">Connecting Farmers and Consumers</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={fndImage}
                alt="Farmers and Consumers"
                className="w-full md:w-1/2 rounded-lg shadow-lg"
              />
              <p className="text-lg text-honeybee-dark-brown max-w-xl">
                Our platform bridges the gap between farmers and consumers, ensuring fresh, organic produce reaches your table directly from the source or become a seller through our marketplace and sell/rent the bee colonies.
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
