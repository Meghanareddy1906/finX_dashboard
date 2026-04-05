import React from 'react';

const Card = ({ children, className = '', title, action, gradient = 'none', isSmall = false }) => {
  let gradientStyle = {};
  let gradientClass = '';

  if (gradient === 'indigo') {
     gradientClass = 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-[#1E293B] dark:to-[#243447]';
  } else if (gradient === 'emerald') {
     gradientClass = 'bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-[#1E293B] dark:to-[#243447]';
  } else if (gradient === 'amber') {
     gradientClass = 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-[#1E293B] dark:to-[#243447]';
  } else if (gradient === 'rose') {
     gradientClass = 'bg-gradient-to-br from-rose-50/50 to-red-50/50 dark:from-[#1E293B] dark:to-[#243447]';
  }

  const hoverEffect = isSmall 
    ? 'hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-lg' 
    : 'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]';

  const darkBase = 'dark:bg-[#1E293B] dark:border dark:border-[rgba(255,255,255,0.06)]';

  return (
    <div className={`glass-card bg-white rounded-2xl p-6 transition-all duration-300 ${hoverEffect} ${darkBase} ${gradientClass} ${className}`} style={gradientStyle}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
