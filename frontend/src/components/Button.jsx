import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-600',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border border-gray-400 bg-white text-black hover:bg-gray-50 focus:ring-gray-400',
    'outline-dark': 'border border-white bg-transparent text-white hover:bg-white hover:text-black focus:ring-gray-400',
    accent: 'bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
