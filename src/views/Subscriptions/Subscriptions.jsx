import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import SkeletonLoader from '../../components/UI/SkeletonLoader';
import Card from '../../components/UI/Card';
import Amount from '../../components/UI/Amount';
import Button from '../../components/UI/Button';
import { Repeat, AlertCircle, TrendingDown, CheckCircle2, Plus } from 'lucide-react';

const Subscriptions = () => {
  const { subscriptions, addSubscription, cancelSubscription, role, isLoading, showToast } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', amount: '', renewalDate: '', isUnused: false });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSub.name || !newSub.amount || !newSub.renewalDate) return;
    
    addSubscription({
      id: Date.now().toString(),
      name: newSub.name,
      amount: parseFloat(newSub.amount),
      renewalDate: parseInt(newSub.renewalDate),
      isYearly: false,
      isUnused: newSub.isUnused
    });
    
    showToast("Subscription added");
    setShowAddModal(false);
    setNewSub({ name: '', amount: '', renewalDate: '', isUnused: false });
  };

  if (isLoading) {
     return <SkeletonLoader type="table" />;
  }

  const activeSubscriptions = subscriptions.filter(s => !s.isUnused);
  const unusedSubscriptions = subscriptions.filter(s => s.isUnused);

  const totalMonthlyActive = activeSubscriptions.reduce((sum, s) => sum + (s.isYearly ? s.amount / 12 : s.amount), 0);
  const totalMonthlyUnused = unusedSubscriptions.reduce((sum, s) => sum + (s.isYearly ? s.amount / 12 : s.amount), 0);
  
  const potentialSavings = totalMonthlyUnused;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-700 dark:text-slate-100">🔄 Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your recurring expenses.</p>
        </div>
        
        {role === 'Admin' && (
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={16} /> Add Subscription
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#F1F5F9] dark:bg-[#1E293B] !border-t-[3px] !border-t-[#6366F1] dark:!border-white/5 border-none dark:border-solid text-[#1E293B] dark:text-white" isSmall={true}>
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#6366F1]/10 dark:bg-indigo-900/40 rounded-xl">
                 <Repeat size={24} className="text-[#6366F1] dark:text-indigo-400" />
              </div>
              <h3 className="font-medium text-[#1E293B] dark:text-slate-200">Active Monthly Spend</h3>
           </div>
           <div className="text-4xl font-bold text-[#6366F1] dark:text-indigo-400">
             <Amount value={totalMonthlyActive} />
           </div>
        </Card>

        <Card className="bg-[#F1F5F9] dark:bg-[#1E293B] !border-t-[3px] !border-t-[#10B981] dark:!border-white/5 border-none dark:border-solid text-[#1E293B] dark:text-white" isSmall={true}>
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#10B981]/10 dark:bg-emerald-900/40 rounded-xl">
                 <TrendingDown size={24} className="text-[#10B981] dark:text-emerald-400" />
              </div>
              <h3 className="font-medium text-[#1E293B] dark:text-slate-200">Potential Monthly Savings</h3>
           </div>
           <div className="text-4xl font-bold text-[#10B981] dark:text-emerald-400">
             <Amount value={potentialSavings} />
           </div>
        </Card>
      </div>

      {unusedSubscriptions.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 text-orange-800 dark:text-orange-400">
             <AlertCircle />
             <p className="font-semibold">You can save <Amount value={potentialSavings} /> per month by cancelling inactive subscriptions.</p>
          </div>
          {role === 'Admin' && (
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100 dark:border-orange-500/30 dark:text-orange-300 dark:hover:bg-orange-500/20 whitespace-nowrap">
               Review Cancellations
            </Button>
          )}
        </div>
      )}

      <Card title="All Subscriptions">
        <div className="overflow-x-auto">
          {subscriptions.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-4">
                 ☕
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">No subscriptions yet!</h3>
              <p className="text-slate-500">Add a subscription to start tracking your recurring expenses.</p>
            </div>
          ) : (
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-700">
                  <th className="py-3 px-4 text-sm font-medium text-slate-500">Service</th>
                  <th className="py-3 px-4 text-sm font-medium text-slate-500">Billing Cycle</th>
                  <th className="py-3 px-4 text-sm font-medium text-slate-500">Monthly Cost</th>
                  <th className="py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  {role === 'Admin' && <th className="py-3 px-4 text-sm font-medium text-slate-500 text-right">Action</th>}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map(sub => {
                  const monthlyCost = sub.isYearly ? sub.amount / 12 : sub.amount;
                  return (
                    <tr key={sub.id} className="border-b border-slate-100 dark:border-navy-700/50 hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                      <td className="py-4 px-4 font-medium dark:text-slate-200">{sub.name}</td>
                      <td className="py-4 px-4 text-sm dark:text-slate-400">Renews on {sub.renewalDate}{sub.renewalDate === 1 || sub.renewalDate === 21 || sub.renewalDate === 31 ? 'st' : sub.renewalDate === 2 || sub.renewalDate === 22 ? 'nd' : sub.renewalDate === 3 || sub.renewalDate === 23 ? 'rd' : 'th'} {sub.isYearly ? '(Yearly)' : '(Monthly)'}</td>
                      <td className="py-4 px-4 font-semibold dark:text-slate-200">
                        <Amount value={monthlyCost} />
                      </td>
                      <td className="py-4 px-4">
                        {sub.isUnused ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                             <AlertCircle size={12} /> Unused
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                             <CheckCircle2 size={12} /> Active
                          </span>
                        )}
                      </td>
                      {role === 'Admin' && (
                        <td className="py-4 px-4 text-right">
                           {!sub.isUnused && (
                             <button onClick={() => { cancelSubscription(sub.id); showToast('Subscription cancelled'); }} className="text-sm text-red-500 hover:text-red-600 font-medium">Cancel</button>
                           )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      
      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Subscription</h2>
             <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Name</label>
                  <input required value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} placeholder="e.g. Netflix" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Cost (₹)</label>
                  <input required type="number" min="1" value={newSub.amount} onChange={e => setNewSub({...newSub, amount: e.target.value})} placeholder="0" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Date (Day of Month)</label>
                  <input required type="number" min="1" max="31" value={newSub.renewalDate} onChange={e => setNewSub({...newSub, renewalDate: e.target.value})} placeholder="15" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                  <button type="button" onClick={() => setNewSub({...newSub, isUnused: !newSub.isUnused})} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${!newSub.isUnused ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                    {!newSub.isUnused ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Subscription</Button>
                </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
