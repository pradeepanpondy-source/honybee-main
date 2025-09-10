import HomeCards from './HomeCards';
import { Link } from 'react-router-dom';
import fndImage from '../assets/fnd.png';
import LetterWave from './LetterWave';

export default function HomeScreen() {
  return (
    <>
      <div className="relative min-h-screen" style={{ backgroundColor: '#FFF8E7' }}>
        <div className="relative z-20 pt-[80px]">
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-16 px-6">
              <h2 className="text-3xl font-serif text-honeybee-dark mb-8">
                <LetterWave text="Bee Bridge" animationDelayStep={0.1} />
              </h2>
              <p className="text-lg text-honeybee-dark-brown max-w-2xl mx-auto mb-10">
              We're the bridge between the farmer's field, the beekeeper's hive, to the honey in your home. 
              </p>
              <div className="flex justify-center gap-6">
                <Link to="/shop" className="bg-honeybee-primary hover:bg-honeybee-accent text-honeybee-secondary font-medium py-3 px-8 rounded-full transition duration-300 ease-out">
                  Shop Now
                </Link>
                <Link to="/about" className="border-2 border-honeybee-primary text-honeybee-secondary hover:bg-honeybee-light font-medium py-3 px-8 rounded-full transition duration-300 ease-out">
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
              <p className="text-lg text-honeybee-dark-brown max-w-xl">l
                Our platform bridges the gap between farmers and consumers, ensuring fresh, organic produce reaches your table directly from the source or become a seller through our marketplace and sell/rent the bee coloines.
              </p>
            </div>
          </div>

          {/* Interactive Cards Section */}
          <HomeCards />
        </div>
      </div>
    </>
  );
}
