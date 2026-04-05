import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import SkeletonLoader from '../../components/UI/SkeletonLoader';
import Card from '../../components/UI/Card';
import Amount from '../../components/UI/Amount';
import Button from '../../components/UI/Button';
import { Search, Filter, Download, Plus, Trash2, Edit } from 'lucide-react';

const Transactions = () => {
  const { transactions, role, deleteTransaction, addTransaction, editTransaction, isLoading, formatAmount, showToast } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTxn, setNewTxn] = useState({ date: '', description: '', category: 'Food', amount: '', type: 'expense' });
  const [editModalTxn, setEditModalTxn] = useState(null);
  const [deletingTxnId, setDeletingTxnId] = useState(null);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editModalTxn.date || !editModalTxn.description || !editModalTxn.category || !editModalTxn.amount) return;
    const amountVal = parseFloat(editModalTxn.amount);
    if (amountVal <= 0) return;

    editTransaction({
      ...editModalTxn,
      amount: amountVal
    });
    
    showToast("Transaction updated");
    setEditModalTxn(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTxn.date || !newTxn.description || !newTxn.category || !newTxn.amount) return;
    const amountVal = parseFloat(newTxn.amount);
    if (amountVal <= 0) return;

    addTransaction({
      id: Date.now().toString(),
      date: newTxn.date,
      description: newTxn.description,
      category: newTxn.category,
      amount: amountVal,
      type: newTxn.type
    });
    
    showToast("Transaction added");
    setShowAddModal(false);
    setNewTxn({ date: '', description: '', category: 'Food', amount: '', type: 'expense' });
  };
  
  if (isLoading) {
    return <SkeletonLoader type="table" />;
  }

  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const downloadCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => 
        [new Date(t.date).toLocaleDateString(), t.description.replace(/,/g, ''), t.category, t.type, t.amount].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const jsonStr = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-700 dark:text-slate-100">💳 Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage your financial records.</p>
        </div>
        
        {role === 'Admin' && (
          <div className="flex gap-2">
            <div className="relative group/export">
              <Button variant="outline" className="gap-2">
                <Download size={16} /> Export
              </Button>
              <div className="absolute right-0 mt-2 w-32 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-50">
                <button onClick={downloadCSV} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">As CSV</button>
                <button onClick={downloadJSON} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm">As JSON</button>
              </div>
            </div>
            
            <Button variant="primary" onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus size={16} /> Add New
            </Button>
          </div>
        )}
      </div>

      <Card>
        {/* Filters Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none min-w-[150px]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl mb-4">
                 💳
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">No transactions yet</h3>
              <p className="text-sm text-slate-400 mb-4">{role === 'Admin' ? 'Start by adding your first transaction' : 'No transactions have been recorded yet'}</p>
              {role === 'Admin' && (
                <Button variant="primary" onClick={() => setShowAddModal(true)}>+ Add Transaction</Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Date</th>
                  <th className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Description</th>
                  <th className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Category</th>
                  <th className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 text-right">Amount</th>
                  {role === 'Admin' && <th className="py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, index) => (
                  <tr 
                    key={txn.id} 
                    className={`border-b border-slate-100 dark:border-slate-700/50 even:bg-slate-50 dark:even:bg-white/[0.02] hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-colors animate-in fade-in slide-in-from-bottom-2`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 px-4 text-sm dark:text-slate-300">
                      {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium dark:text-slate-200">{txn.description}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        {txn.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Amount 
                        value={txn.amount} 
                        prefix={txn.type === 'income' ? '+' : '-'} 
                        className={`font-semibold ${txn.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}
                      />
                    </td>
                    {role === 'Admin' && (
                      <td className="py-3 px-4">
                        {deletingTxnId === txn.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs text-slate-500 mr-1">Delete?</span>
                            <button onClick={() => { deleteTransaction(txn.id); setDeletingTxnId(null); showToast("Deleted successfully"); }} className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600">Yes</button>
                            <button onClick={() => setDeletingTxnId(null)} className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-200 rounded dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300">No</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setEditModalTxn(txn)} className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => setDeletingTxnId(txn.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              </table>

              {/* Mobile Stacked Card View */}
              <div className="md:hidden flex flex-col gap-3 mt-4">
                {filteredTransactions.map((txn, index) => (
                  <div key={`mob-${txn.id}`} className="bg-white dark:bg-[#1E293B] rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                       <div>
                         <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{txn.description}</p>
                         <p className="text-xs text-slate-500 mt-1">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                       </div>
                       <Amount 
                        value={txn.amount} 
                        prefix={txn.type === 'income' ? '+' : '-'} 
                        className={`font-semibold ${txn.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-200'}`}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        {txn.category}
                      </span>
                      {role === 'Admin' && (
                        <div className="flex gap-2">
                          {deletingTxnId === txn.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => { deleteTransaction(txn.id); setDeletingTxnId(null); showToast("Deleted successfully"); }} className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600">Yes</button>
                              <button onClick={() => setDeletingTxnId(null)} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg dark:bg-slate-700 dark:text-slate-300">No</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditModalTxn(txn)} className="p-2 text-slate-400 hover:text-indigo-500 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer"><Edit size={16} /></button>
                              <button onClick={() => setDeletingTxnId(txn.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer"><Trash2 size={16} /></button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Add New Transaction</h2>
             <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input required type="date" value={newTxn.date} onChange={e => setNewTxn({...newTxn, date: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <input required type="text" value={newTxn.description} onChange={e => setNewTxn({...newTxn, description: e.target.value})} placeholder="e.g. Grocery Run" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select required value={newTxn.category} onChange={e => setNewTxn({...newTxn, category: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Salary">Salary</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                    <input required type="number" min="0.01" step="0.01" value={newTxn.amount} onChange={e => setNewTxn({...newTxn, amount: e.target.value})} placeholder="0.00" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type:</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="txnType" value="expense" checked={newTxn.type === 'expense'} onChange={() => setNewTxn({...newTxn, type: 'expense'})} className="accent-indigo-500" />
                    <span className="text-sm dark:text-slate-200">Expense</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="txnType" value="income" checked={newTxn.type === 'income'} onChange={() => setNewTxn({...newTxn, type: 'income'})} className="accent-indigo-500" />
                    <span className="text-sm dark:text-slate-200">Income</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Transaction</Button>
                </div>
             </form>
          </Card>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editModalTxn && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setEditModalTxn(null)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Edit Transaction</h2>
             <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input required type="date" value={editModalTxn.date} onChange={e => setEditModalTxn({...editModalTxn, date: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <input required type="text" value={editModalTxn.description} onChange={e => setEditModalTxn({...editModalTxn, description: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select required value={editModalTxn.category} onChange={e => setEditModalTxn({...editModalTxn, category: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option value="Food">Food</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Subscriptions">Subscriptions</option>
                      <option value="Salary">Salary</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                    <input required type="number" min="0.01" step="0.01" value={editModalTxn.amount} onChange={e => setEditModalTxn({...editModalTxn, amount: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type:</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="editType" value="expense" checked={editModalTxn.type === 'expense'} onChange={() => setEditModalTxn({...editModalTxn, type: 'expense'})} className="accent-indigo-500" />
                    <span className="text-sm dark:text-slate-200">Expense</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="editType" value="income" checked={editModalTxn.type === 'income'} onChange={() => setEditModalTxn({...editModalTxn, type: 'income'})} className="accent-indigo-500" />
                    <span className="text-sm dark:text-slate-200">Income</span>
                  </label>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <Button type="button" variant="ghost" onClick={() => setEditModalTxn(null)}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
             </form>
          </Card>
        </div>
      )}
      
    </div>
  );
};

export default Transactions;
