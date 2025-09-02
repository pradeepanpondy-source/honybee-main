import React, { useState } from 'react';

interface ClickEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function ClickEffect({ children, className = '', onClick, disabled = false, type = 'button' }: ClickEffectProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    
    if (onClick) {
      setTimeout(() => onClick(event), 100);
    }
  };

  return (
    <button
      type={type}
      className={`
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 relative
      `}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
      
      {/* Ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-amber-300 opacity-30 rounded-inherit" />
        </div>
      )}
    </button>
  );
}