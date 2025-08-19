import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated Trees with Honeycombs */}
      <div className="absolute bottom-0 left-0 w-full h-full">
        {/* Tree 1 */}
        <div className="absolute bottom-0 left-10 animate-sway">
          <svg width="120" height="200" viewBox="0 0 120 200" className="drop-shadow-lg">
            {/* Tree trunk */}
            <rect x="55" y="120" width="10" height="80" fill="#8B4513" />
            
            {/* Tree foliage */}
            <circle cx="60" cy="100" r="35" fill="#228B22" className="animate-pulse-slow" />
            <circle cx="45" cy="85" r="25" fill="#32CD32" className="animate-pulse-slow" style={{animationDelay: '0.5s'}} />
            <circle cx="75" cy="85" r="25" fill="#32CD32" className="animate-pulse-slow" style={{animationDelay: '1s'}} />
            
            {/* Honeycomb */}
            <g transform="translate(50, 90)" className="animate-bounce-slow">
              <polygon points="0,8 4,4 12,4 16,8 12,12 4,12" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
              <polygon points="4,0 8,-4 16,-4 20,0 16,4 8,4" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
              <polygon points="8,8 12,4 20,4 24,8 20,12 12,12" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
            </g>
          </svg>
        </div>

        {/* Tree 2 */}
        <div className="absolute bottom-0 right-16 animate-sway" style={{animationDelay: '1s'}}>
          <svg width="100" height="180" viewBox="0 0 100 180" className="drop-shadow-lg">
            <rect x="45" y="110" width="10" height="70" fill="#8B4513" />
            <circle cx="50" cy="90" r="30" fill="#228B22" className="animate-pulse-slow" style={{animationDelay: '1.5s'}} />
            <circle cx="38" cy="78" r="20" fill="#32CD32" className="animate-pulse-slow" style={{animationDelay: '2s'}} />
            <circle cx="62" cy="78" r="20" fill="#32CD32" className="animate-pulse-slow" style={{animationDelay: '0.5s'}} />
            
            <g transform="translate(42, 82)" className="animate-bounce-slow" style={{animationDelay: '0.5s'}}>
              <polygon points="0,6 3,3 9,3 12,6 9,9 3,9" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
              <polygon points="3,-1 6,-4 12,-4 15,-1 12,2 6,2" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
            </g>
          </svg>
        </div>
      </div>

      {/* Falling Leaves */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall-leaf"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path
              d="M10 2C8 4 6 8 10 12C14 8 12 4 10 2Z M10 12C10 16 8 18 10 18C12 18 10 16 10 12Z"
              fill={`hsl(${30 + Math.random() * 60}, 70%, ${50 + Math.random() * 20}%)`}
              className="animate-spin-slow"
            />
          </svg>
        </div>
      ))}

      {/* Roaming Bees */}
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