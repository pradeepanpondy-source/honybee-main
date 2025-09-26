import React, { useState } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

interface ProductFeatureProps {
  nextStep: () => void;
  prevStep: () => void;
}

const ProductFeature: React.FC<ProductFeatureProps> = ({ nextStep, prevStep }) => {
  const [weight, setWeight] = useState('250g');

  return (
    <div className="bg-yellow-50 min-h-screen p-8 flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-amber-900">Bee Bridge</h1>
        <div className="flex space-x-4 text-amber-900">
          <Button variant="ghost" size="icon" aria-label="Search">🔍</Button>
          <Button variant="ghost" size="icon" aria-label="User Profile">👤</Button>
          <Button variant="ghost" size="icon" aria-label="Cart">🛒</Button>
        </div>
      </div>

      {/* Product Card */}
      <div className="bg-yellow-100 rounded-lg p-6 flex items-center space-x-8 mb-8">
        <img
          src="/honey-jar.png"
          alt="Bee Bridge"
          className="w-32 h-32 object-contain"
        />
        <div>
          <h2 className="font-semibold text-lg mb-2">Bee Bridge</h2>
          <p className="text-amber-900 font-bold text-xl mb-2">₹200</p>
          <div className="flex space-x-2 mb-2">
            {['250g', '500g', '1kg'].map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w)}
                className={`px-3 py-1 rounded border transition-colors duration-300 ease-out ${
                  weight === w ? 'bg-amber-900 text-white' : 'bg-yellow-200 text-amber-900'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
          <Button variant="ghost" className="text-amber-900 underline mb-2">Reviews →</Button>
          <Button onClick={nextStep} variant="accent">
            Add to cart
          </Button>
        </div>
      </div>

      {/* Benefits */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }} initial="hidden" animate="visible">
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-amber-900 text-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Loaded with antioxidant</h3>
          <p className="text-sm">Lorem ipsum dolor sit amet consectetur. Convallis scelerisque</p>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-amber-900 text-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Remedy for sore throat</h3>
          <p className="text-sm">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip</p>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-amber-900 text-yellow-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">No added sugar</h3>
          <p className="text-sm">Lorem ipsum dolor sit amet consectetur. Sit a fames tempus tincidunt in morbi ris.</p>
        </motion.div>
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="secondary">
          Back
        </Button>
        <Button onClick={nextStep} variant="accent">
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductFeature;