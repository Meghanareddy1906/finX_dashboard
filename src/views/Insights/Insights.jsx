import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import SkeletonLoader from '../../components/UI/SkeletonLoader';
import Card from '../../components/UI/Card';
import Amount from '../../components/UI/Amount';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, AlertTriangle, Info } from 'lucide-react';

const Insights = () => {
  const { transactions, savingsRate, budgets, theme, isLoading } = useFinance();

  if (isLoading) {
    return (
      <div className="space-y-6">
         <SkeletonLoader type="card" />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader type="chart" />
            <SkeletonLoader type="chart" />
         </div>
      </div>
    );
  }

  // Calculate highest spending category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
  
  const sortedCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const highestCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'N/A';
  const highestAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;

  // Comparison Mode: Last 2 months
  const monthlyData = transactions.reduce((acc, txn) => {
    const d = new Date(txn.date);
    const monthKey = d.toLocaleString('default', { month: 'short' });
    
    if (!acc[monthKey]) acc[monthKey] = { name: monthKey, income: 0, expense: 0 };
    if (txn.type === 'income') acc[monthKey].income += txn.amount;
    else acc[monthKey].expense += txn.amount;
    
    return acc;
  }, {});
  
  const comparisonData = Object.values(monthlyData).reverse().slice(-2); // Take last 2 entries

  // Calculate Financial Health Score precisely:
  // 1. Savings Ratio (40% weight) -> map 0-30% to 0-40 points
  const rateNum = parseFloat(savingsRate);
  let savingsScore = Math.min((Math.max(rateNum, 0) / 30) * 40, 40);

  // 2. Spending Consistency (30% weight) -> variance across top 3 categories
  const sortedExpenses = Object.values(expensesByCategory).sort((a,b) => b-a);
  const topSpent = sortedExpenses[0] || 1; 
  const avgSpent = sortedExpenses.reduce((a,b)=>a+b, 0) / (sortedExpenses.length || 1);
  const varianceRatio = topSpent / (avgSpent || 1);
  // If variance is low (<1.5), consistency is high (30 points). If variance is high (>3), consistency is low (0 points).
  let consistencyScore = 30 - ((Math.min(Math.max(varianceRatio - 1.5, 0), 1.5) / 1.5) * 30);
  
  // 3. Budget Adherence (30% weight)
  const currentMonthExpenseTotal = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.amount, 0);
  const totalBudget = Object.values(budgets).reduce((a,b) => a+b, 0);
  const budgetRatio = totalBudget > 0 ? (currentMonthExpenseTotal / totalBudget) : 1;
  // If ratio <= 0.8 -> 30pts. If ratio >= 1.2 -> 0pts.
  let budgetScore = 30 - ((Math.min(Math.max(budgetRatio - 0.8, 0), 0.4) / 0.4) * 30);

  let healthScore = Math.round(savingsScore + consistencyScore + budgetScore);
  healthScore = Math.min(Math.max(healthScore, 0), 100);

  let healthStatus = { color: '#22C55E', text: 'Good financial health', icon: Trophy };
  if (healthScore <= 40) {
    healthStatus = { color: '#EF4444', text: 'Overspending detected', icon: AlertTriangle };
  } else if (healthScore <= 70) {
    healthStatus = { color: '#F59E0B', text: 'Needs improvement', icon: Info };
  }

  const GAUGE_COLORS = [healthStatus.color, theme === 'dark' ? '#334155' : '#E2E8F0'];
  const gaugeData = [
    { name: 'Score', value: healthScore },
    { name: 'Remaining', value: 100 - healthScore }
  ];

  const textColor = theme === 'dark' ? '#E2E8F0' : '#0F172A';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">💡 Financial Insights</h1>
        <p className="text-slate-500 dark:text-slate-400">Deeper analysis into your financial habits.</p>
      </div>

      <Card className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[rgba(255,255,255,0.06)] shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-indigo-50 dark:bg-slate-800 rounded-2xl">
            <Trophy className="text-indigo-500 dark:text-yellow-400" size={32} />
          </div>
          <div>
            <h3 className="text-slate-500 font-medium mb-1">Top Spending Category</h3>
            <div className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {highestCategory} (<Amount value={highestAmount} />)
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Your highest expense this period was on <span className="font-semibold">{highestCategory}</span>. Keep an eye on this to boost your savings rate!
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Comparison Bar Chart */}
        <Card title="Monthly Comparison" className="border border-[#E2E8F0] dark:border-[rgba(255,255,255,0.06)]">
           <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#E2E8F0' : '#64748B', fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#E2E8F0' : '#64748B' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: theme === 'dark' ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 0.6)' }}
                  contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', borderColor: theme === 'dark' ? '#334155' : '#E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  formatter={(value) => [`₹${value}`, '']}
                />
                <Legend iconType="circle" />
                <Bar dataKey="income" name="Income" fill="url(#colorInc)" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
                <Bar dataKey="expense" name="Expense" fill="url(#colorExp)" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Health Score Gauge */}
        <Card title="Financial Health Score" className="border border-[#E2E8F0] dark:border-[rgba(255,255,255,0.06)]">
           <div className="h-72 flex flex-col justify-center items-center relative">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={0}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} stroke="transparent" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 pointer-events-none">
              <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{healthScore}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">out of 100</span>
            </div>
            
            <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <healthStatus.icon color={healthStatus.color} size={18} />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{healthStatus.text}</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Insights;
