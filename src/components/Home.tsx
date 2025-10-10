import React from 'react';
import Button from './Button';
import LetterWave from './LetterWave';

interface HomeProps {
  onGoToShop: () => void;
  nextStep: () => void;
}

const Home: React.FC<HomeProps> = ({ onGoToShop, nextStep }) => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-honeybee-primary min-h-screen flex flex-col justify-center items-center p-8">
        <div
          className="absolute bottom-0 left-0 w-full h-40 bg-no-repeat bg-bottom bg-contain"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg%20xmlns%3d%27http%3a%2f%2fwww.w3.org%2f2000%2fsvg%27%20viewBox%3d%270%200%201440%20320%27%3e%3cpath%20fill%3d%27%23FFD700%27%20fill-opacity%3d%271%27%20d%3d%27M0%2c224L48%2c208C96%2c192%2c192%2c160%2c288%2c165.3C384%2c171%2c480%2c213%2c576%2c202.7C672%2c192%2c768%2c128%2c864%2c117.3C960%2c107%2c1056%2c149%2c1152%2c160C1248%2c171%2c1344%2c149%2c1392%2c138.7L1440%2c128L1440%2c320L1392%2c320C1344%2c320%2c1248%2c320%2c1152%2c320C1056%2c320%2c960%2c320%2c864%2c320C768%2c320%2c672%2c320%2c576%2c320C480%2c320%2c384%2c320%2c288%2c320C192%2c320%2c96%2c320%2c48%2c320L0%2c320Z%27%3e%3c%2fpath%3e%3c%2fsvg%3e")` }}
        ></div>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <img src="data:image/svg+xml,%3csvg width='1440' height='320' viewBox='0 0 1440 320' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0C48 32 96 64 144 64C192 64 240 32 288 32C336 32 384 64 432 64C480 64 528 32 576 32C624 32 672 64 720 64C768 64 816 32 864 32C912 32 960 64 1008 64C1056 64 1104 32 1152 32C1200 32 1248 64 1296 64C1344 64 1392 32 1440 32L1440 320L0 320Z' fill='%23FFD700'/%3e%3c/svg%3e" alt="Honey Drip" className="w-96 h-auto" />
        </div>

        <div className="relative z-10 max-w-7xl w-full flex flex-col md:flex-row items-center justify-between">
          <div className="text-left max-w-lg">
            <h1 className="text-6xl font-bold text-honeybee-dark-brown mb-6 leading-tight font-serif">
              <LetterWave text="Pure Organic Honey" className="text-6xl font-serif font-bold leading-tight" />
            </h1>
            <p className="text-honeybee-dark-brown mb-6 font-sans">
              Discover the finest selection of artisanal honey, harvested with care from sustainable apiaries around the world.
            </p>
            <div className="flex space-x-4">
              <Button onClick={onGoToShop} className="bg-honeybee-dark-brown text-white px-8 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all">
                Shop Now
              </Button>
              <Button onClick={nextStep} className="bg-transparent border-2 border-honeybee-dark-brown text-honeybee-dark-brown px-8 py-3 rounded-lg shadow-lg hover:bg-honeybee-dark-brown hover:text-white transition-all">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative w-80 h-80 md:w-96 md:h-96 mt-12 md:mt-0">
            <img
              src="https://img.freepik.com/free-vector/cute-bees-flying-around-honey-jar-yellow-background_1308-102497.jpg"
              alt="Honey Jar"
              className="w-full h-full object-contain rounded-full shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-honeybee-dark-brown mb-4">Featured Products</h2>
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
            <h2 className="text-4xl font-bold text-honeybee-dark-brown mb-4">Our Story</h2>
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

      {/* Become a Seller Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-honeybee-dark-brown mb-4">Join Our Community of Honey Artisans</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Share your artisanal honey with a global community of honey enthusiasts and build lasting connections with those who cherish quality and sustainability.</p>
          <Button className="bg-honeybee-primary text-white px-8 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all">
            Become a Seller
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
