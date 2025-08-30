import React from 'react';

const AnimatedBee: React.FC = () => {
  return (
    <div className="animated-bee-container absolute top-0 right-0">
      <svg
        className="animated-bee"
        width="100"
        height="80"
        viewBox="0 0 100 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bee Body */}
        <ellipse cx="50" cy="40" rx="25" ry="15" fill="#FFD700" stroke="#000" strokeWidth="1" className="bee-body" />
        {/* Black Stripes */}
        <rect x="35" y="30" width="30" height="3" fill="#000" />
        <rect x="35" y="37" width="30" height="3" fill="#000" />
        <rect x="35" y="44" width="30" height="3" fill="#000" />
        {/* Fuzzy texture */}
        <circle cx="45" cy="35" r="1" fill="#FFA500" opacity="0.7" />
        <circle cx="55" cy="45" r="1" fill="#FFA500" opacity="0.7" />
        {/* Wings */}
        <ellipse cx="30" cy="25" rx="15" ry="10" fill="#E0F6FF" opacity="0.6" className="wing-left" />
        <ellipse cx="70" cy="25" rx="15" ry="10" fill="#E0F6FF" opacity="0.6" className="wing-right" />
        {/* Shine on wings */}
        <ellipse cx="28" cy="23" rx="5" ry="3" fill="#FFF" opacity="0.8" />
        <ellipse cx="68" cy="23" rx="5" ry="3" fill="#FFF" opacity="0.8" />
        {/* Eyes */}
        <circle cx="42" cy="38" r="2" fill="#000" />
        <circle cx="58" cy="38" r="2" fill="#000" />
        {/* Stinger */}
        <polygon points="75,40 80,38 80,42" fill="#000" />
      </svg>
    </div>
  );
};

export default AnimatedBee;
