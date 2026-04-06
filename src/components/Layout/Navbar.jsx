import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Building2, User, UserCog, Users, 
  Sun, Moon, Eye, EyeOff, Bell, Menu
} from 'lucide-react';

const Navbar = ({ currentView = 'dashboard', onMenuClick }) => {
  const { 
    role, setRole,
    theme, toggleTheme,
    privacyMode, togglePrivacy,
    budgets, transactions, goals, subscriptions, savingsRate
  } = useFinance();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState(new Set());
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = useMemo(() => {
    const alerts = [];
    
    // 1. Budget exceeded
    const currentMonthTransactions = transactions.filter(t => {
      const d = new Date(t.date); const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    Object.entries(budgets).forEach(([cat, limit]) => {
      if (limit > 0) {
        const spent = currentMonthTransactions.filter(t => t.category === cat && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        if (spent > limit) {
          alerts.push({ id: `budget-${cat}`, icon: '⚠️', text: `${cat} budget exceeded by ₹${spent - limit}`, time: 'Budget Alert' });
        }
      }
    });

    // 2. Goal > 80%
    goals.forEach(g => {
        const p = (g.savedAmount / g.targetRaw) * 100;
        if (p >= 80 && p < 100) {
          alerts.push({ id: `goal-${g.id}`, icon: '🎯', text: `You're ${p.toFixed(0)}% toward your ${g.name} goal`, time: 'Goal Alert' });
        }
    });

    // 3. Subscriptions renewing
    const today = new Date().getDate();
    const renewing = subscriptions.filter(s => !s.isUnused && (s.renewalDate >= today && s.renewalDate <= today + 7));
    if (renewing.length > 0) {
      alerts.push({ id: 'subs-renewing', icon: '🔔', text: `${renewing.length} subscriptions renewing this week`, time: 'System' });
    }

    // 4. Savings rate drop
    if (savingsRate < 20 && savingsRate > 0) {
       alerts.push({ id: 'savings-alert', icon: '💡', text: `Your savings rate dropped to ${savingsRate}% this month`, time: 'Insight' });
    }

    return alerts.slice(0, 5);
  }, [budgets, transactions, goals, subscriptions, savingsRate]);

  const unreadCount = notifications.filter(n => !readNotifs.has(n.id)).length;

  const handleRead = (id) => {
    const newRead = new Set(readNotifs);
    newRead.add(id);
    setReadNotifs(newRead);
  };

  // Create human readable title
  const formattedRoute = currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <nav className="h-[56px] flex items-center justify-between px-6 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-sm border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] sticky top-0 z-30">
      
      {/* Mobile Title & Menu */}
      <div className="md:hidden flex items-center gap-3 font-bold text-xl text-slate-800 dark:text-slate-100">
        <button onClick={onMenuClick} className="p-1 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition" aria-label="Open menu">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white text-sm">FX</div>
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:flex items-center">
        <span className="text-sm text-slate-400 font-medium">Pages / <span className="text-slate-600 dark:text-slate-200 capitalize">{formattedRoute}</span></span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden lg:inline text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Good morning 👋</span>

        <div className="relative" ref={notifRef}>
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative p-1 transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0F172A]"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="fixed md:absolute top-[56px] md:top-auto left-0 right-0 md:left-auto md:right-0 md:mt-3 w-full md:w-[320px] bg-white dark:bg-[#1E293B] md:rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] border-b md:border border-slate-100 dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-white/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                {unreadCount > 0 && <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>}
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl mb-3">✅</span>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">You're all caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No new alerts at the moment.</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map(n => {
                      const isRead = readNotifs.has(n.id);
                      return (
                        <div 
                          key={n.id} 
                          onClick={() => handleRead(n.id)}
                          className={`p-4 flex gap-3 border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer ${!isRead ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                        >
                          <div className="text-xl shrink-0 mt-0.5">{n.icon}</div>
                          <div>
                            <p className={`text-sm ${!isRead ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>{n.text}</p>
                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                          </div>
                          {!isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 ml-auto mt-1.5 shrink-0"></div>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-[rgba(255,255,255,0.06)] text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-slate-700 transition shadow-sm">
              <UserCog size={16} />
              <span className="hidden sm:inline">{role}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-[#1E293B] rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-[rgba(255,255,255,0.06)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 ${role === 'Admin' ? 'text-indigo-500 font-semibold' : ''}`}
                onClick={() => setRole('Admin')}
              >
                Admin Access
              </button>
              <button 
                className={`w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 ${role === 'Viewer' ? 'text-indigo-500 font-semibold' : ''}`}
                onClick={() => setRole('Viewer')}
              >
                Viewer Access
              </button>
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        <div className="flex items-center gap-1">
          <button 
            onClick={togglePrivacy} 
            className={`p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-700 ${privacyMode ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-slate-500 dark:text-slate-400'}`}
            title="Toggle Privacy Mode"
          >
            {privacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
