import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import SkeletonLoader from '../../components/UI/SkeletonLoader';
import Card from '../../components/UI/Card';
import Amount from '../../components/UI/Amount';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Area, AreaChart } from 'recharts';

const Dashboard = ({ setCurrentView }) => {
  const { 
    totalIncome, totalExpenses, totalBalance, savingsRate, 
    transactions, isLoading, theme
  } = useFinance();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <SkeletonLoader key={i} type="card" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="chart" />
          <SkeletonLoader type="chart" />
        </div>
      </div>
    );
  }

  // Summary Cards Data
  const summaryCards = [
    { title: 'Total Balance', amount: totalBalance, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', borderTop: 'border-t-[3px] border-indigo-500' },
    { title: 'Monthly Income', amount: totalIncome, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', borderTop: 'border-t-[3px] border-emerald-500' },
    { title: 'Monthly Expenses', amount: totalExpenses, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', borderTop: 'border-t-[3px] border-red-500' },
    { title: 'Savings Rate', amount: savingsRate, suffix: '%', icon: PiggyBank, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', isRate: true, borderTop: 'border-t-[3px] border-violet-500' }
  ];

  // Process data for Line Chart (Balance Trend over last 3 months)
  // Simplified grouping by month
  const monthlyData = transactions.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const monthYear = date.toLocaleString('default', { month: 'short' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { name: monthYear, income: 0, expense: 0, balance: 0 };
    }
    
    if (txn.type === 'income') acc[monthYear].income += txn.amount;
    else acc[monthYear].expense += txn.amount;
    
    acc[monthYear].balance = acc[monthYear].income - acc[monthYear].expense;
    return acc;
  }, {});

  // Convert to array and take last 3 months
  const trendData = Object.values(monthlyData).reverse().slice(-3); // mock is mostly last 3 months anyway

  // Process data for Donut Chart (Expenses by Category)
  // Fix #9 - Filter correctly to current month exactly (done globally in context, but expensesByCategory uses raw transactions array!)
  // Oh wait, transactions in Context is ALL transactions. Let's filter current month explicitly here just in case.
  const currentMonthTxns = transactions.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const expensesByCategory = currentMonthTxns
    .filter(t => t.type === 'expense')
    .reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});
    
  const textColor = theme === 'dark' ? '#E2E8F0' : '#0F172A';
  const CATEGORY_COLORS = {
    'Food': '#6366F1',
    'Travel': '#10B981',
    'Entertainment': '#F59E0B',
    'Utilities': '#8B5CF6',
    'Subscriptions': '#EF4444'
  };

  const donutData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94A3B8' }))
    .sort((a, b) => b.value - a.value); // sort descending

  // Smart Insights generator
  const foodSpend = currentMonthTxns.filter(t => t.category === 'Food').reduce((sum, t) => sum + t.amount, 0);
  const travelSpend = currentMonthTxns.filter(t => t.category === 'Travel').reduce((sum, t) => sum + t.amount, 0);
  const highestSpend = Object.entries(expensesByCategory).sort((a,b) => b[1] - a[1])[0] || ['Unknown'];
  
  const recentTransactions = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const getRelativeTime = (dateStr) => {
    const rDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(rDate.getFullYear(), rDate.getMonth(), rDate.getDate());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-slate-700 dark:text-slate-100">📊 Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's a snapshot of your finances.</p>
        </div>
      </div>

      {/* Smart Insights Array */}
      <div className="bg-white dark:bg-[#1E293B] border-l-[3px] border-[#6366F1] rounded-r-xl shadow-sm flex gap-3 items-start animate-in fade-in w-full px-[20px] py-[16px]">
         <Lightbulb className="text-indigo-500 shrink-0 mt-0.5" size={20} />
         <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">Smart Insights</h4>
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
               <li>Your savings rate is currently sitting at <strong className="text-indigo-500">{savingsRate}%</strong> this month.</li>
               <li>You've spent the most on <strong className="text-indigo-500">{highestSpend[0]}</strong> so far.</li>
               {foodSpend > travelSpend && <li>Food expenses are tracking higher than <strong className="text-indigo-500">Travel</strong> this period.</li>}
            </ul>
         </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className={`flex flex-col ${card.borderTop}`} gradient="none" isSmall={true}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={card.color} size={24} />
              </div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </h3>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-auto">
              {card.isRate ? (
                <span>{card.amount}{card.suffix}</span>
              ) : (
                <Amount value={card.amount} />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Line Chart */}
        <Card title="Balance Trend" className="w-full lg:w-2/3">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 12 }}
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderColor: theme === 'dark' ? '#334155' : '#E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#6366F1', fontWeight: 600 }}
                  formatter={(value) => [`₹${value}`, 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#6366F1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBalance)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card title="Spending by Category" className="flex flex-col h-full w-full lg:w-1/3">
          <div className="h-48 mt-2 flex shrink-0 items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                  animationBegin={200}
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderColor: theme === 'dark' ? '#334155' : '#E2E8F0', borderRadius: '12px', zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value) => [`₹${value}`, 'Amount']}
                />
              </RechartsPie>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm text-slate-500 dark:text-slate-400">Total Spent</span>
              <span className="font-bold text-lg dark:text-slate-100">
                <Amount value={totalExpenses} />
              </span>
            </div>
            
          </div>
          
          <div className="mt-4 flex-1 flex flex-col justify-end">
             <div className="space-y-3 mb-4">
               {donutData.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                      {entry.name}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-100"><Amount value={entry.value} /></span>
                      <span className="text-slate-400 w-8 text-right">{Math.round((entry.value/totalExpenses)*100)}%</span>
                    </div>
                  </div>
               ))}
             </div>
             
             <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-100">
                <span>Total Spent</span>
                <Amount value={totalExpenses} />
             </div>
          </div>
        </Card>

      </div>
      
      {/* Recent Activity */}
      <div className="mt-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Card className="flex flex-col h-full w-full">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Recent Activity</h3>
             <button onClick={() => setCurrentView && setCurrentView('transactions')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 transition-colors">
                View All <span aria-hidden="true">→</span>
             </button>
           </div>
           
           <div className="space-y-4">
             {recentTransactions.length === 0 ? (
                <div className="py-6 text-center text-slate-500 dark:text-slate-400 font-medium">
                  No recent activity yet
                </div>
             ) : (
                recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border border-transparent dark:border-slate-800/50 hover:border-slate-100 dark:hover:border-slate-700">
                     <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-lg shrink-0">
                           {txn.category === 'Food' ? '🍔' : txn.category === 'Travel' ? '✈️' : txn.category === 'Entertainment' ? '🎬' : txn.category === 'Utilities' ? '💡' : '📦'}
                        </div>
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{txn.description}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{getRelativeTime(txn.date)}</p>
                        </div>
                     </div>
                     <span className={`font-bold text-sm shrink-0 whitespace-nowrap ${txn.type === 'income' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-100'}`}>
                        {txn.type === 'income' ? '+' : '-'}<Amount value={txn.amount} />
                     </span>
                  </div>
                ))
             )}
           </div>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
