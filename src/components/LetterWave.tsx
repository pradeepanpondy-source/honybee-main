import React from 'react';

interface LetterWaveProps {
  text: string;
  className?: string;
  animationDelayStep?: number; // seconds
}

const LetterWave: React.FC<LetterWaveProps> = ({ text, className = '', animationDelayStep = 0.1 }) => {
  return (
    <span className={`font-extrabold ${className}`} style={{ display: 'block' }}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block letter-wave"
          style={{
            animationDelay: `${index * animationDelayStep}s`,
            animationPlayState: 'running'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default LetterWave;
