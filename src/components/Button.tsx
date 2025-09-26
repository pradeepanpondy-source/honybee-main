import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'light';
  size?: 'default' | 'icon';
}

const variantClasses = {
  primary: 'bg-honeybee-primary hover:bg-honeybee-dark text-white',
  secondary: 'bg-honeybee-secondary hover:bg-honeybee-accent text-white',
  accent: 'bg-honeybee-accent hover:bg-honeybee-primary text-white',
  ghost: 'hover:bg-gray-100/10',
  light: 'bg-white text-honeybee-dark hover:bg-honeybee-light',
};

const sizeClasses = {
  default: 'py-3 px-6',
  icon: 'h-10 w-10',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const [isRippling, setIsRippling] = useState(false);
  const [rippleStyle, setRippleStyle] = useState({});

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRippleStyle({
      width: size,
      height: size,
      left: x,
      top: y,
    });
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) focus:outline-none focus:ring-4 focus:ring-honeybee-accent ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(255, 193, 7, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children as React.ReactNode}
      {isRippling && (
        <span
          className="button-ripple absolute"
          style={rippleStyle}
        />
      )}
    </motion.button>
  );
};

export default Button;