import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'solid', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full h-14 flex items-center justify-center gap-2 rounded-2xl text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    solid: "bg-[#007AFF] text-white hover:bg-[#0062CC]",
    outline: "bg-white border border-slate-900 text-slate-900 hover:bg-slate-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
