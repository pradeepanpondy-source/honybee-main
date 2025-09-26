import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div 
      className="bg-honeybee-background text-honeybee-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-honeybee-primary">About Bee Bridge</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Our passion for honey is rooted in a deep respect for nature and the incredible work of bees.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/004/454/157/small_2x/honey-can-realistic-composition-vector.jpg" 
              alt="Beekeeper"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Bee Bridge was founded with a simple mission: to bring the purest, most delicious honey from our hives to your home. We believe in sustainable beekeeping practices that prioritize the health of our bees and the environment.
            </p>
            <p>
              Our farms are dedicated to sustainable practices, and through our website, we connect consumers directly with the source, fostering transparency and trust in every jar of honey.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-serif font-bold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-6 border border-honeybee-light rounded-lg">
              <h3 className="text-xl font-serif font-bold mb-2">Sustainability</h3>
              <p>We are committed to protecting our planet and its precious pollinators.</p>
            </div>
            <div className="p-6 border border-honeybee-light rounded-lg">
              <h3 className="text-xl font-serif font-bold mb-2">Quality</h3>
              <p>We deliver only the finest, 100% pure and raw honey.</p>
            </div>
            <div className="p-6 border border-honeybee-light rounded-lg">
              <h3 className="text-xl font-serif font-bold mb-2">Community</h3>
              <p>We support local beekeepers and educate our community about the importance of bees.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;