import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-honeybee-background text-honeybee-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-honeybee-primary">About Botanica</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Our passion for honey is rooted in a deep respect for nature and the incredible work of bees.
          </p>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1525253013412-55c1aeda2a54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
              alt="Beekeeper"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Botanica was founded with a simple mission: to bring the purest, most delicious honey from our hives to your home. We believe in sustainable beekeeping practices that prioritize the health of our bees and the environment.
            </p>
            <p>
              Our apiaries are located in lush, wildflower-rich meadows, allowing our bees to produce honey with unique and complex flavors. We handle our honey with the utmost care, ensuring it remains raw and unprocessed to preserve its natural enzymes and health benefits.
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
    </div>
  );
};

export default About;