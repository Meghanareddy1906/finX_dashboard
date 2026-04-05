import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import SkeletonLoader from '../../components/UI/SkeletonLoader';
import Card from '../../components/UI/Card';
import Amount from '../../components/UI/Amount';
import Button from '../../components/UI/Button';
import { AlertCircle, Plus } from 'lucide-react';

const Budgets = () => {
  const { budgets, transactions, role, updateBudget, isLoading, theme } = useFinance();
  const [toast, setToast] = useState(null);
  
  const [editModalCategory, setEditModalCategory] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudgetCat, setNewBudgetCat] = useState('');
  const [newBudgetAmt, setNewBudgetAmt] = useState('');

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editAmount === '' || parseFloat(editAmount) < 0) return;
    updateBudget(editModalCategory, parseFloat(editAmount));
    setEditModalCategory(null);
    setEditAmount('');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newBudgetCat || newBudgetAmt === '' || parseFloat(newBudgetAmt) < 0) return;
    updateBudget(newBudgetCat, parseFloat(newBudgetAmt));
    setShowAddModal(false);
    setNewBudgetCat('');
    setNewBudgetAmt('');
  };



  // Calculate spent per category for the current month
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const spentByCategory = currentMonthTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const CATEGORIES = [
    { name: 'Food', colorClass: 'bg-indigo-500' },
    { name: 'Travel', colorClass: 'bg-emerald-500' },
    { name: 'Entertainment', colorClass: 'bg-amber-500' },
    { name: 'Utilities', colorClass: 'bg-purple-500' },
    { name: 'Subscriptions', colorClass: 'bg-red-500' }
  ];

  const categoryBudgetItems = CATEGORIES.map((cat) => {
    const category = cat.name;
    const limit = budgets[category] || 0;
    const spent = spentByCategory[category] || 0;
    const hasBudget = limit > 0;
    const percentage = hasBudget ? (spent / limit) * 100 : 0;
    const remaining = Math.max(limit - spent, 0);
    
    let status = 'none'; // No budget set
    let activeColor = cat.colorClass;
    
    if (hasBudget) {
      status = 'safe'; // 🟢 Safe
      activeColor = 'bg-emerald-500';
      if (percentage >= 100) {
        status = 'exceeded'; // 🔴 Exceeded
        activeColor = 'bg-red-500';
      } else if (percentage >= 70) {
        status = 'warning'; // 🟡 Near Limit
        activeColor = 'bg-yellow-500';
      }
    }

    return { category, limit, spent, percentage, remaining, status, colorClass: activeColor, defaultColor: cat.colorClass, hasBudget };
  });

  // Check for newly exceeded budgets to trigger toasts
  useEffect(() => {
    const exceeded = categoryBudgetItems.filter(b => b.status === 'exceeded');
    if (exceeded.length > 0) {
      setToast(`Alert: You have exceeded your budget for ${exceeded.map(e => e.category).join(', ')}!`);
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [JSON.stringify(budgets), JSON.stringify(spentByCategory)]);

  if (isLoading) {
     return <SkeletonLoader type="card" />;
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-4 md:right-8 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-right">
          <AlertCircle className="text-red-500" />
          <p className="text-red-700 dark:text-red-400 font-medium">{toast}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-700 dark:text-slate-100">📁 Budgets</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor your spending limits for this month.</p>
        </div>
        {role === 'Admin' && (
          <Button variant="primary" onClick={() => { setNewBudgetCat(CATEGORIES[0].name); setShowAddModal(true); }} className="gap-2 relative z-10 cursor-pointer">
            <Plus size={16} /> New Budget
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryBudgetItems.map((item) => (
          <Card key={item.category} className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.defaultColor}`}></span>
                <h3 className="font-semibold text-lg dark:text-slate-200">{item.category}</h3>
              </div>
              {role === 'Admin' && (!item.hasBudget ? (
                <button 
                  onClick={() => { setEditModalCategory(item.category); setEditAmount(''); }} 
                  className="relative z-10 text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors cursor-pointer"
                >
                  + Set Budget
                </button>
              ) : null)}
            </div>

            {item.hasBudget ? (
               <>
                 <div className="mb-2 flex justify-between text-sm items-center">
                   <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                     <Amount value={item.spent} /> of 
                     <span className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                       <Amount value={item.limit} />
                       {role === 'Admin' && (
                         <button onClick={() => { setEditModalCategory(item.category); setEditAmount(item.limit); }} className="relative z-10 p-1 text-slate-400 hover:text-indigo-500 transition-colors bg-slate-100 dark:bg-slate-800 rounded cursor-pointer pointer-events-auto">
                           <span dangerouslySetInnerHTML={{ __html: '&#9998;' }} />
                         </button>
                       )}
                     </span>
                     used
                   </span>
                   <span className="font-medium dark:text-slate-200">{item.percentage.toFixed(0)}%</span>
                 </div>
               </>
            ) : (
               <div className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                 No budget limit set. Spent: <Amount value={item.spent} />
               </div>
            )}

            {/* Progress Bar Container */}
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4 relative">
              <div 
                className={`h-full ${item.colorClass} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              ></div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-sm">
               <span className="text-slate-500 dark:text-slate-400">Status</span>
               <span className={`font-medium ${
                 item.status === 'safe' ? 'text-emerald-500' : 
                 item.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500'
               }`}>
                 {item.status === 'safe' && 'Good Standing'}
                 {item.status === 'warning' && 'Nearing Limit'}
                 {item.status === 'exceeded' && 'Limit Exceeded'}
               </span>
            </div>
          </Card>
         ))}
      </div>

      {/* Edit Budget Modal */}
      {editModalCategory && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setEditModalCategory(null)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Edit Budget Limit</h2>
             <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{editModalCategory} - Monthly Budget Limit (₹)</label>
                  <input required type="number" min="0" step="0.01" value={editAmount} onChange={e => setEditAmount(e.target.value)} placeholder="e.g. 5000" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button type="button" variant="ghost" onClick={() => setEditModalCategory(null)}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
             </form>
          </Card>
        </div>
      )}

      {/* Add New Budget Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Set Category Budget</h2>
             <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Category</label>
                  <select required value={newBudgetCat} onChange={e => setNewBudgetCat(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Budget Limit (₹)</label>
                  <input required type="number" min="0" step="0.01" value={newBudgetAmt} onChange={e => setNewBudgetAmt(e.target.value)} placeholder="e.g. 5000" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Budget</Button>
                </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Budgets;
