import React from 'react';

interface LetterWaveProps {
  text: string;
  className?: string;
  animationDelayStep?: number; // seconds
}

const LetterWave: React.FC<LetterWaveProps> = ({ text, className = '', animationDelayStep = 0.1 }) => {
  return (
    <h2 className={`font-extrabold ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block letter-wave"
          style={{ animationDelay: `${index * animationDelayStep}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h2>
  );
};

export default LetterWave;
