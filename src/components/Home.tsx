import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import Stats from './Stats';
import FeaturedProducts from './FeaturedProducts';
import SearchBar from './SearchBar';

// Lazy load non-critical sections
const Testimonials = lazy(() => import('./Testimonials'));

interface HomeProps {
  onGoToShop: () => void;
  nextStep: () => void;
}

const Story: React.FC = () => (
  <section className="py-24 md:py-40 bg-honeybee-light/50 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-honeybee-primary/10 rounded-full blur-[100px]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <span className="text-honeybee-primary font-black uppercase tracking-[0.3em] text-xs mb-4 block">The Genesis</span>
        <h2 className="text-4xl md:text-6xl font-black text-honeybee-secondary mb-10 leading-tight">Crafting Nature's <br /><span className="text-honeybee-primary italic">Golden Legacy</span></h2>
        <div className="space-y-6 text-lg md:text-xl text-honeybee-secondary/80 font-medium leading-relaxed">
          <p>
            At Bee Bridge, our journey began with a deep appreciation for the delicate balance of nature and the hardworking bees that produce nature's golden elixir.
          </p>
          <p>
            As you explore our collection, you'll feel the warmth of our dedication to quality and the joy of connecting with nature's bounty. We're more than just a marketplace; we're a community united by the love of honey and the bees that make it possible.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

const Home: React.FC<HomeProps> = ({ onGoToShop, nextStep }) => {
  return (
    <div className="overflow-x-hidden pt-14 md:pt-16">
      <div className="bg-honeybee-background relative">
        <Hero onGoToShop={onGoToShop} onLearnMore={nextStep} />
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-40">
          <SearchBar />
        </div>
      </div>

      <div className="pt-20 md:pt-32">
        <Stats />
      </div>

      <FeaturedProducts onGoToShop={onGoToShop} />

      <Story />

      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-12 h-12 border-4 border-honeybee-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <Testimonials />
      </Suspense>

      {/* Become a Seller Section */}
      <section className="py-24 md:py-32 bg-honeybee-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 honeycomb-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to Join the <span className="text-honeybee-primary">Hive?</span></h2>
            <p className="text-lg md:text-xl text-honeybee-light/60 mb-10 max-w-2xl mx-auto font-medium">
              Share your artisanal honey with a global community and build lasting connections with those who cherish quality.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/login'}
              className="bg-honeybee-primary text-honeybee-secondary px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-honeybee-primary/20 transition-all hover:bg-honeybee-accent"
            >
              Become a Seller Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
