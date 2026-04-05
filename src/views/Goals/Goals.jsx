import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import SkeletonLoader from '../../components/UI/SkeletonLoader';
import Card from '../../components/UI/Card';
import Amount from '../../components/UI/Amount';
import Button from '../../components/UI/Button';
import { Target, Calendar, Plus } from 'lucide-react';

const Goals = () => {
  const { goals, addGoal, totalBalance, role, isLoading, showToast } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetRaw: '', deadline: '', savedAmount: 0 });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetRaw || !newGoal.deadline) return;
    
    addGoal({
      id: Date.now().toString(),
      name: newGoal.name,
      targetRaw: parseFloat(newGoal.targetRaw),
      deadline: newGoal.deadline,
      savedAmount: parseFloat(newGoal.savedAmount) || 0
    });
    
    showToast("Goal created");
    setShowAddModal(false);
    setNewGoal({ name: '', targetRaw: '', deadline: '', savedAmount: 0 });
  };

  if (isLoading) {
     return <SkeletonLoader type="card" />;
  }

  // Simplified logic: Assume 30% of total balance counts towards goals for demonstration.
  // In a real app, you'd allocate specific amounts to specific goals.
  // Here, we'll distribute available balance proportionally.
  let remainingSavingsPool = Math.max(totalBalance * 0.5, 0); // User savings cache

  const enrichedGoals = goals.map(goal => {
    const timeDiff = new Date(goal.deadline) - new Date();
    const monthsLeft = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 30)), 1);
    
    // Allocate funds (use specific saved amount if available, else pool)
    const manualSaved = goal.savedAmount || 0;
    const allocation = manualSaved > 0 ? manualSaved : Math.min(goal.targetRaw, remainingSavingsPool);
    if (!manualSaved) remainingSavingsPool -= allocation;
    
    const percentage = (allocation / goal.targetRaw) * 100;
    const requiredPerMonth = Math.max((goal.targetRaw - allocation) / monthsLeft, 0);

    return {
      ...goal,
      currentAmount: allocation,
      percentage,
      monthsLeft,
      requiredPerMonth
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-700 dark:text-slate-100">🎯 Goals</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your progress towards your dreams.</p>
        </div>
        {role === 'Admin' && (
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={16} /> Add Goal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrichedGoals.map((goal) => (
          <Card key={goal.id} className="flex flex-col group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
               <Target size={24} />
            </div>
            
            <h3 className="font-bold text-lg dark:text-slate-100 mb-1">{goal.name}</h3>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-1 mb-6">
              <Calendar size={14} /> 
              <span>Target: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} ({goal.monthsLeft} months)</span>
            </div>

            <div className="mb-2 flex justify-between items-end">
              <div className="text-2xl font-bold dark:text-slate-200">
                <Amount value={goal.currentAmount} />
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                / <Amount value={goal.targetRaw} />
              </div>
            </div>

            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(goal.percentage, 100)}%` }}
              ></div>
            </div>

            <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
               <p className="text-sm text-slate-600 dark:text-slate-300">
                 Needs <span className="font-semibold text-slate-800 dark:text-slate-100"><Amount value={goal.requiredPerMonth} /></span> / month to reach goal on time.
               </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Goal</h2>
             <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Goal Name</label>
                  <input required type="text" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} placeholder="e.g. Vacation to Bali" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Amount (₹)</label>
                  <input required type="number" min="1" value={newGoal.targetRaw} onChange={e => setNewGoal({...newGoal, targetRaw: e.target.value})} placeholder="0" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline</label>
                  <input required type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Starting Saved Amount (₹)</label>
                  <input type="number" min="0" value={newGoal.savedAmount} onChange={e => setNewGoal({...newGoal, savedAmount: e.target.value})} placeholder="0 (Optional)" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Goal</Button>
                </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Goals;
