import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Views
import Dashboard from '../../views/Dashboard/Dashboard';
import Transactions from '../../views/Transactions/Transactions';
import Insights from '../../views/Insights/Insights';
import Budgets from '../../views/Budgets/Budgets';
import Goals from '../../views/Goals/Goals';
import Subscriptions from '../../views/Subscriptions/Subscriptions';
import InvestmentHub from '../../views/InvestmentHub/InvestmentHub';

import { useFinance } from '../../context/FinanceContext';

const Layout = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { toastMessage, setIsLoading } = useFinance();

  const handleNav = (view) => {
    if (view === currentView) {
      setIsMobileDrawerOpen(false);
      return;
    }
    setIsLoading(true);
    setCurrentView(view);
    setIsMobileDrawerOpen(false);
    setTimeout(() => setIsLoading(false), 400); // Navigation skeleton UI
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'insights': return <Insights />;
      case 'budgets': return <Budgets />;
      case 'goals': return <Goals />;
      case 'subscriptions': return <Subscriptions />;
      case 'investment-hub': return <InvestmentHub />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAF7F2] dark:bg-[#0F172A] overflow-hidden font-sans transition-colors duration-300 w-full">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleNav} 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col h-full w-full relative min-w-0">
        <Navbar 
          currentView={currentView} 
          onMenuClick={() => setIsMobileDrawerOpen(true)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full">
          <div className="w-full max-w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderView()}
          </div>
        </main>
        
        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom-8 fade-in">
            <span className="text-emerald-400">✓</span> {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
