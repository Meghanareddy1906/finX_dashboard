import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Lightbulb, 
  PieChart, 
  Target, 
  Repeat,
  Briefcase,
  Settings
} from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView }) => {
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
      <aside className="hidden md:flex flex-col w-64 h-full border-r border-[rgba(255,255,255,0.08)]" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #1e293b 100%)' }}>
        <div className="p-6 flex items-center gap-3 border-b border-[rgba(255,255,255,0.08)] mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-md">
            FX
          </div>
          <div className="flex items-baseline">
            <span className="font-bold text-xl tracking-tight text-white">Fin</span>
            <span className="font-bold text-xl tracking-tight text-indigo-400">X</span>
          </div>
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

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#F3F0EB] dark:bg-[#0B1120] border-t border-[#E5E0D8] dark:border-[#0F172A] flex justify-around items-center px-2 z-40 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              currentView === item.id 
                ? 'text-indigo-600 dark:text-indigo-400 border-t-2 border-indigo-500' 
                : 'text-slate-500 dark:text-slate-400 border-t-2 border-transparent'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
