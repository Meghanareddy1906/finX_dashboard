import React, { useEffect, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

const Amount = ({ value, prefix = '', className = '' }) => {
  const { privacyMode, formatAmount } = useFinance();
  const [animatedValue, setAnimatedValue] = useState(0);

  // Counter animation logic
  useEffect(() => {
    if (value === 0) return;
    
    let startTimestamp = null;
    const duration = 1000;
    const finalValue = Number(value) || 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setAnimatedValue(finalValue * ease);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setAnimatedValue(finalValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span className={`${privacyMode ? 'privacy-blur' : ''} ${className}`}>
      {prefix}{formatAmount(animatedValue)}
    </span>
  );
};

export default Amount;
