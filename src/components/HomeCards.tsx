import { useState } from 'react';
import LetterWave from './LetterWave';

interface CardData {
  id: number;
  title: string;
  frontText: string;
  backText: string;
}

const cards: CardData[] = [
  {
    id: 1,
    title: 'Boost Crop Yields',
    frontText: 'Rent managed bee colonies for effective pollination and better harvests.',
    backText: 'Farmers gain higher yields and improved quality without needing beekeeping skills — Bee Bridge handles all hive management.',
  },
  {
    id: 2,
    title: 'Support Beekeepers',
    frontText: 'Beekeepers earn sustainable income by selling bee colonies.',
    backText: 'Bee Bridge simplifies hive management and ensures timely payments, creating a reliable income stream.',
  },
  {
    id: 3,
    title: 'Pure Honey Direct',
    frontText: 'Enjoy natural, raw honey straight from supported farms.',
    backText: 'Direct farm-to-table honey, fair pricing, traceability, and authentic flavors.',
  },
];

export default function HomeCards() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const toggleFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map(({ id, title, frontText, backText }) => (
          <div
            key={id}
            className="card-container cursor-pointer"
            onClick={() => toggleFlip(id)}
            aria-label={`${title} card`}
          >
            <div
              className={`card relative w-full h-72 rounded-xl ${
                flippedCard === id ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="card-front absolute w-full h-full rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <LetterWave text={title} className="text-xl md:text-2xl font-extrabold text-black mb-4 leading-tight" animationDelayStep={0.08} />
                <p className="text-base md:text-lg font-medium text-black leading-relaxed fade-in">{frontText}</p>
              </div>
              {/* Back Side */}
              <div className="card-back absolute w-full h-full rounded-xl p-8 flex items-center justify-center text-center">
                <p className="text-base md:text-lg font-medium text-black leading-relaxed fade-in">{backText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
