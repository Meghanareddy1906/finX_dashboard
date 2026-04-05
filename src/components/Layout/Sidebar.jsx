import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Lightbulb, 
  PieChart, 
  Target, 
  Repeat,
  Briefcase,
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
    { id: 'investment-hub', label: 'Investment Hub', icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed md:static inset-y-0 left-0 z-[100] flex flex-col w-[280px] md:w-64 h-full border-r border-[rgba(255,255,255,0.08)] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} 
        style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #1e293b 100%)' }}
      >
        <div className="p-6 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-md">
              FX
            </div>
            <div className="flex items-baseline">
              <span className="font-bold text-xl tracking-tight text-white">Fin</span>
              <span className="font-bold text-xl tracking-tight text-indigo-400">X</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                currentView === item.id 
                  ? 'border-l-[3px] border-[#818CF8] bg-white/10 text-white font-semibold' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? "text-white" : "text-slate-400"} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 mb-4 mx-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/80 flex items-center justify-center text-white text-xs font-semibold">
              MR
            </div>
            <div className="flex flex-col items-start">
              <span className="text-white text-sm font-medium">Meghana</span>
              <span className="text-indigo-300 text-xs">Admin</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
