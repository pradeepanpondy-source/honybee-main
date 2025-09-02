import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'light';
  size?: 'default' | 'icon';
  className?: string;
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
  ...props
}) => {
  return (
    <button
      className={`rounded-lg shadow-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-honeybee-accent ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;