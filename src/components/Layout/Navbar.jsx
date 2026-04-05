import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { 
  Building2, User, UserCog, Users, 
  Sun, Moon, Eye, EyeOff, Bell
} from 'lucide-react';

const Navbar = ({ currentView = 'dashboard' }) => {
  const { 
    role, setRole,
    theme, toggleTheme,
    privacyMode, togglePrivacy
  } = useFinance();

  // Create human readable title
  const formattedRoute = currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <nav className="h-[56px] flex items-center justify-between px-6 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-sm border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] sticky top-0 z-30">
      
      {/* Mobile Title */}
      <div className="md:hidden font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white text-sm">FX</div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:flex items-center">
        <span className="text-sm text-slate-400 font-medium">Pages / <span className="text-slate-600 dark:text-slate-200 capitalize">{formattedRoute}</span></span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden lg:inline text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Good morning 👋</span>

        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative p-1 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0F172A]"></span>
        </button>

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
