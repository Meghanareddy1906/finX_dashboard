import React, { useEffect, useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
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
  const { role, theme, toggleTheme, privacyMode, togglePrivacy, resetToDemoData, clearAllData, showToast } = useFinance();
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('Profile');
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
          <button onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-white transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay animate-in fade-in z-[110] fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setShowSettings(false)}></div>
          <div className="modal-card w-[90vw] md:w-full max-w-[480px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.15)] relative z-[120] p-6 m-4 ring-1 ring-slate-900/5 dark:ring-white/10">
             <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Settings</h2>
             
             {/* Tabs */}
             <div className="flex border-b border-slate-200 dark:border-slate-700/60 mb-6 font-medium text-sm">
                {['Profile', 'Preferences', 'Data'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setSettingsTab(tab)}
                    className={`px-4 py-2 border-b-2 transition-colors ${settingsTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             <form onSubmit={(e) => {
               e.preventDefault();
               showToast('Settings saved');
               setShowSettings(false);
             }} className="space-y-4">
                
                {settingsTab === 'Profile' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                      <input type="text" defaultValue="Meghana" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                      <input type="text" readOnly value={role} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 px-3 py-2 outline-none opacity-80 cursor-not-allowed" />
                    </div>
                  </div>
                )}

                {settingsTab === 'Preferences' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
                      <button type="button" onClick={toggleTheme} className={`w-11 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Privacy Mode</span>
                      <button type="button" onClick={togglePrivacy} className={`w-11 h-6 rounded-full transition-colors relative ${privacyMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${privacyMode ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency Display</label>
                      <select disabled className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 px-3 py-2 outline-none opacity-80 cursor-not-allowed appearance-none">
                         <option>₹ INR</option>
                      </select>
                    </div>
                  </div>
                )}

                {settingsTab === 'Data' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1">
                    <button type="button" onClick={() => {
                      if (window.confirm("Are you sure you want to restore demo data? This will overwrite your current data.")) {
                         resetToDemoData();
                      }
                    }} className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-medium transition flex justify-between items-center border border-slate-200 dark:border-slate-700 cursor-pointer">
                      Reset to Demo Data
                    </button>

                    <button type="button" onClick={() => {
                      if (window.confirm("Are you sure you want to completely wipe all data? This cannot be undone.")) {
                         clearAllData();
                      }
                    }} className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400 font-medium transition flex justify-between items-center border border-red-200 dark:border-red-500/30 cursor-pointer">
                      Clear All Data
                    </button>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl transition shadow-sm">
                    Save Changes
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
