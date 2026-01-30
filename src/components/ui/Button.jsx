import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyle = "px-6 py-3 rounded-md font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-dark-green text-white hover:bg-primary-green shadow-lg hover:shadow-xl disabled:bg-secondary-green",
    secondary: "bg-brand-orange text-white hover:bg-brand-gold disabled:bg-brand-gold/50",
    outline: "border-2 border-dark-green text-dark-green hover:bg-light-cream disabled:opacity-50"
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
