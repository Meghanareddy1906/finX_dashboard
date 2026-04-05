import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Amount from '../../components/UI/Amount';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Info, Briefcase, Plus, Search, HelpCircle } from 'lucide-react';
import SkeletonLoader from '../../components/UI/SkeletonLoader';

const InvestmentHub = () => {
  const { investments, role, theme, formatAmount, isLoading } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);

  const [newInv, setNewInv] = useState({ asset: '', category: 'Stocks', invested: '' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    // In a real app we'd dispatch context
    setShowAddModal(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  // --- Portfolio Calculations ---
  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
  const currentValue = investments.reduce((sum, inv) => sum + inv.current, 0);
  const profitLoss = currentValue - totalInvested;
  const plPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
  const isProfit = profitLoss >= 0;

  // Category Distribution
  // Category Distribution (Enforced fixed proportions)
  const donutData = [
    { name: 'Stocks', value: currentValue * 0.35, color: '#6366F1' },
    { name: 'Mutual Funds', value: currentValue * 0.30, color: '#8B5CF6' },
    { name: 'Gold', value: currentValue * 0.20, color: '#F59E0B' },
    { name: 'Real Estate', value: currentValue * 0.15, color: '#10B981' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-lg p-3 border border-slate-100">
          <p className="text-sm font-semibold text-slate-800">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: data.color }}></span>
            {data.name}: {formatAmount(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Portfolio Trend (Mock aggregation from investments)
  const trendData = [
    { name: 'Month 1', value: totalInvested * 0.9 },
    { name: 'Month 2', value: totalInvested * 0.95 },
    { name: 'Month 3', value: totalInvested * 1.02 },
    { name: 'Today', value: currentValue },
  ];

  const textColor = theme === 'dark' ? '#E2E8F0' : '#0F172A';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-700 dark:text-slate-100">📈 Investment Hub</h1>
          <p className="text-slate-500 dark:text-slate-400">Track portfolios and explore market opportunities.</p>
        </div>
        {role === 'Admin' && (
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={16} /> Add Investment
          </Button>
        )}
      </div>

      {investments.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl mb-4">
                📈
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">No investments added</h3>
            <p className="text-sm text-slate-400 mb-4">Start tracking your portfolio by adding your first investment</p>
            {role === 'Admin' && (
                <Button variant="primary" onClick={() => setShowAddModal(true)}>+ Add Investment</Button>
            )}
        </div>
      ) : (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card gradient="indigo">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Invested</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    <Amount value={totalInvested} />
                  </p>
                </div>
              </div>
            </Card>
            
            <Card gradient="emerald">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Current Value</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    <Amount value={currentValue} />
                  </p>
                </div>
              </div>
            </Card>

            <Card gradient={isProfit ? 'emerald' : 'rose'}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isProfit ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'}`}>
                  {isProfit ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total P&L</p>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-2xl font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isProfit ? '+' : '-'}<Amount value={Math.abs(profitLoss)} />
                    </p>
                    <span className={`text-sm font-medium ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                      ({isProfit ? '+' : ''}{plPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Asset Distribution" gradient="indigo">
              <div className="h-48 mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {donutData.map((entry, idx) => (
                   <div key={idx} className="flex items-center text-xs dark:text-slate-300">
                     <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                     <span className="flex-1">{entry.name}</span>
                     <span className="font-semibold">{Math.round((entry.value/currentValue)*100)}%</span>
                   </div>
                ))}
              </div>
            </Card>
            
            <Card title="Growth Trend" gradient="indigo">
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderColor: theme === 'dark' ? '#334155' : '#E2E8F0', borderRadius: '12px' }}
                      itemStyle={{ color: '#10B981', fontWeight: 600 }}
                      formatter={(value) => [`₹${value}`, 'Value']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={1500} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="flex justify-between items-center mt-8 mb-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Individual Assets</h3>
            {role === 'Admin' && (
              <Button variant="primary" onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus size={16} /> Add Asset
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map(inv => {
              const p_l = inv.current - inv.invested;
              const perc = (p_l / inv.invested) * 100;
              const isP = p_l >= 0;
              
              const trendLineData = inv.trend.map((val, i) => ({ i, val }));
              const strokeC = isP ? '#10B981' : '#EF4444';

              return (
                <Card key={inv.id} className="relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">{inv.asset}</h4>
                      <p className="text-xs text-slate-500">{inv.category}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isP ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                      {isP ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {isP ? '+' : ''}{perc.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Invested</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300"><Amount value={inv.invested}/></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Current</p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100"><Amount value={inv.current}/></p>
                    </div>
                  </div>

                  <div className="h-12 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendLineData}>
                        <Line type="monotone" dataKey="val" stroke={strokeC} strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Add Investment Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-in fade-in z-50">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          <Card className="modal-card w-[90vw] md:w-full max-w-[480px] relative z-50 p-6 !bg-white dark:!bg-[#1E293B]">
             <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Add New Investment</h2>
             <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Asset Name</label>
                  <input required placeholder="e.g. Nifty 50" className="w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select className="w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2">
                    <option>Stocks</option>
                    <option>Mutual Funds</option>
                    <option>Gold</option>
                    <option>Real Estate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Invested Amount (₹)</label>
                  <input required type="number" placeholder="0.00" className="w-full rounded-xl border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 py-2" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Investment</Button>
                </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvestmentHub;
