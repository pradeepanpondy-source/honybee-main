
import HomeCards from './HomeCards';
import { Link } from 'react-router-dom';
import LetterWave from './LetterWave';

export default function HomeScreen() {
  return (
    <>
      <div className="relative bg-honeybee-background min-h-screen">
        <div className="relative z-20 pt-[80px]">
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-16 px-6">
              <h1 className="text-5xl font-serif font-bold text-honeybee-secondary mb-4">
                <LetterWave text="Bee Bridge" animationDelayStep={0.1} />
              </h1>
              <h2 className="text-3xl font-serif text-honeybee-dark mb-8">
                Pure Organic Honey
              </h2>
              <p className="text-lg text-honeybee-dark-brown max-w-2xl mx-auto mb-10">
                Discover the finest selection of artisanal honey, harvested with care from sustainable apiaries around the world.
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

          {/* Interactive Cards Section */}
          <HomeCards />
        </div>
      </div>
    </>
  );
}
