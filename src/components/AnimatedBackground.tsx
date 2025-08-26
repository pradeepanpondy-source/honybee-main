import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background with no trees */}

      {/* Bees - Keeping some subtle animation */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bee-flight"
          style={{
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        >
          <svg width="24" height="16" viewBox="0 0 24 16" className="animate-bee-wings">
            {/* Bee body */}
            <ellipse cx="12" cy="8" rx="8" ry="4" fill="#FFD700" />
            <ellipse cx="12" cy="8" rx="6" ry="3" fill="#FFA500" />
            
            {/* Bee stripes */}
            <rect x="8" y="6" width="1" height="4" fill="#000" />
            <rect x="11" y="6" width="1" height="4" fill="#000" />
            <rect x="14" y="6" width="1" height="4" fill="#000" />
            
            {/* Bee wings */}
            <ellipse cx="6" cy="5" rx="4" ry="2" fill="#FFF" opacity="0.7" className="animate-wing-flap" />
            <ellipse cx="18" cy="5" rx="4" ry="2" fill="#FFF" opacity="0.7" className="animate-wing-flap" style={{animationDelay: '0.1s'}} />
            
            {/* Bee antennae */}
            <line x1="10" y1="4" x2="9" y2="2" stroke="#000" strokeWidth="1" />
            <line x1="14" y1="4" x2="15" y2="2" stroke="#000" strokeWidth="1" />
            <circle cx="9" cy="2" r="1" fill="#000" />
            <circle cx="15" cy="2" r="1" fill="#000" />
          </svg>
        </div>
      ))}
    </div>
  );
}