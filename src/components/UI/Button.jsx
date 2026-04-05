import React, { useState } from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled,
  type = 'button'
}) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-200 outline-none rounded-xl active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-md shadow-indigo-500/20",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 border border-slate-700 shadow-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20"
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-5 py-2.5",
    lg: "text-lg px-6 py-3"
  };

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 500);
    if (onClick) onClick(e);
  };

  return (
    <button 
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {isRippling && (
        <span
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: coords.x,
            top: coords.y,
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
