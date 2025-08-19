import React, { useState } from 'react';

interface ClickEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ClickEffect({ children, className = '', onClick, disabled = false }: ClickEffectProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    if (onClick) {
      setTimeout(onClick, 100);
    }
  };

  return (
    <div
      className={`
        ${className}
        ${isClicked ? 'animate-pop-click' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 hover:scale-105 active:scale-95
      `}
      onClick={handleClick}
    >
      {children}
      
      {/* Ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-amber-300 opacity-30 animate-ripple rounded-inherit" />
        </div>
      )}
    </div>
  );
}