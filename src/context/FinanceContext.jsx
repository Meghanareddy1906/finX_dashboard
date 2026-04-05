import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateMockTransactions, MOCK_SUBSCRIPTIONS, MOCK_GOALS, MOCK_BUDGETS, MOCK_INVESTMENTS, MOCK_INVESTMENT_OPTIONS } from '../data/mockData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // Global App State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [isOnboardingDone, setIsOnboardingDone] = useState(localStorage.getItem('onboardingDone') === 'true');
  
  // Session State
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Viewer'

  // Data State
  const [transactions, setTransactions] = useState([]);
  
  const [budgets, setBudgets] = useState(MOCK_BUDGETS);
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  
  const [investments, setInvestments] = useState(MOCK_INVESTMENTS);
  const [investmentOptions] = useState(MOCK_INVESTMENT_OPTIONS);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000); // 3 seconds timeout
  };

  // Initialize data with simulated network latency
  useEffect(() => {
    setTimeout(() => {
      setTransactions(generateMockTransactions(25));
      setIsLoading(false);
    }, 1500);
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const togglePrivacy = () => setPrivacyMode(p => !p);
  const completeOnboarding = () => {
    setIsOnboardingDone(true);
    localStorage.setItem('onboardingDone', 'true');
  };

  const addTransaction = (txn) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const editTransaction = (updatedTxn) => {
    setTransactions(prev => prev.map(t => t.id === updatedTxn.id ? updatedTxn : t));
  };

  const updateBudget = (category, amount) => {
    setBudgets(prev => ({ ...prev, [category]: amount }));
  };

  const addGoal = (goal) => {
    setGoals(prev => [...prev, goal]);
  };

  const addSubscription = (sub) => {
    setSubscriptions(prev => [sub, ...prev]);
  };

  const addInvestment = (inv) => {
    setInvestments(prev => [inv, ...prev]);
  };

  // Helper values
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  const totalIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : 0;

  const formatAmount = (absAmount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(absAmount);
  };

  const cancelSubscription = (id) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, isUnused: true } : s));
  };

  const deleteSubscription = (id) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const resetToDemoData = () => {
    setTransactions(generateMockTransactions(25));
    setBudgets(MOCK_BUDGETS);
    setGoals(MOCK_GOALS);
    setSubscriptions(MOCK_SUBSCRIPTIONS);
    setInvestments(MOCK_INVESTMENTS);
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets({});
    setGoals([]);
    setSubscriptions([]);
    setInvestments([]);
  };

  const value = {
    theme, toggleTheme,
    privacyMode, togglePrivacy,
    isOnboardingDone, completeOnboarding,
    role, setRole,
    transactions,
    addTransaction, deleteTransaction, editTransaction,
    budgets, updateBudget,
    goals, addGoal, subscriptions, addSubscription, cancelSubscription, deleteSubscription,
    investments, addInvestment, investmentOptions,
    totalIncome, totalExpenses, totalBalance, savingsRate,
    formatAmount, isLoading, setIsLoading,
    toastMessage, showToast, resetToDemoData, clearAllData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
