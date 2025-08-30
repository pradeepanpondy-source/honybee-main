import React, { useState, useEffect, useRef } from 'react';

interface HoneycombTransitionProps {
  isActive: boolean;
  onAnimationComplete: () => void;
  direction?: 'up' | 'down' | 'left' | 'right';
  children?: React.ReactNode;
}

const HoneycombTransition: React.FC<HoneycombTransitionProps> = ({
  isActive,
  onAnimationComplete,
  direction = 'up',
  children
}) => {
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'expanding' | 'filled' | 'sliding'>('idle');
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (isActive) {
      setAnimationPhase('expanding');
      
      // Sequence the animation phases
      timeoutRef.current = setTimeout(() => {
        setAnimationPhase('filled');
        timeoutRef.current = setTimeout(() => {
          setAnimationPhase('sliding');
          timeoutRef.current = setTimeout(() => {
            onAnimationComplete();
            setAnimationPhase('idle');
          }, 800);
        }, 1200);
      }, 800);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, onAnimationComplete]);

  if (!isActive && animationPhase === 'idle') {
    return null;
  }

  const getSlideDirection = () => {
    switch (direction) {
      case 'up': return 'translate-y-[-100%]';
      case 'down': return 'translate-y-[100%]';
      case 'left': return 'translate-x-[-100%]';
      case 'right': return 'translate-x-[100%]';
      default: return 'translate-y-[-100%]';
    }
  };

  const generateHexagons = () => {
    const hexagons = [];
    const rows = 8;
    const cols = 12;
    const hexWidth = 100;
    const hexHeight = 86.6; // Math.sqrt(3)/2 * width

    for (let row = -2; row < rows; row++) {
      for (let col = -2; col < cols; col++) {
        const x = col * hexWidth * 0.75;
        const y = row * hexHeight + (col % 2) * hexHeight / 2;
        
        // Calculate distance from center for staggered animation
        const centerX = (cols * hexWidth * 0.75) / 2;
        const centerY = (rows * hexHeight) / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const delay = Math.min(distance / 50, 2); // Cap delay at 2s

        hexagons.push(
          <g
            key={`${row}-${col}`}
            className={`transform transition-all duration-1000 ease-out ${
              animationPhase === 'expanding' ? 'scale-100 opacity-100' : 
              animationPhase === 'filled' ? 'scale-100 opacity-100' : 
              'scale-0 opacity-0'
            }`}
            style={{
              transitionDelay: `${delay}s`,
              transformOrigin: 'center'
            }}
          >
            <polygon
              points={`
                ${x},${y + hexHeight/2}
                ${x + hexWidth/2},${y}
                ${x + hexWidth},${y + hexHeight/2}
                ${x + hexWidth},${y + hexHeight}
                ${x + hexWidth/2},${y + hexHeight * 1.5}
                ${x},${y + hexHeight}
              `}
              className={`fill-amber-400 stroke-amber-600 stroke-1 transition-all duration-1000 ${
                animationPhase === 'filled' ? 'fill-amber-300' : 'fill-amber-400'
              }`}
            />
            {/* Liquid honey fill effect */}
            <polygon
              points={`
                ${x},${y + hexHeight/2}
                ${x + hexWidth/2},${y}
                ${x + hexWidth},${y + hexHeight/2}
                ${x + hexWidth},${y + hexHeight}
                ${x + hexWidth/2},${y + hexHeight * 1.5}
                ${x},${y + hexHeight}
              `}
              className={`fill-amber-300 transition-all duration-1000 ${
                animationPhase === 'filled' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                clipPath: `polygon(
                  0% ${animationPhase === 'filled' ? '0%' : '100%'},
                  100% ${animationPhase === 'filled' ? '0%' : '100%'},
                  100% 100%,
                  0% 100%
                )`
              }}
            />
          </g>
        );
      }
    }
    return hexagons;
  };

  return (
    <div className={`fixed inset-0 z-50 pointer-events-none ${
      animationPhase === 'sliding' ? `transition-transform duration-800 ease-in-out ${getSlideDirection()}` : ''
    }`}>
      <div className="absolute inset-0 bg-amber-50 bg-opacity-90 flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 900 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {generateHexagons()}
        </svg>
      </div>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default HoneycombTransition;
