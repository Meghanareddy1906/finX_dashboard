import React from 'react';

const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="w-1/3 h-5 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div className="w-1/2 h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }
  
  if (type === 'table') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse h-80 flex flex-col items-center justify-center space-y-4">
         <div className="w-48 h-48 rounded-full border-8 border-slate-200 dark:border-slate-700"></div>
         <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[100px] animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
  );
};

export default SkeletonLoader;
