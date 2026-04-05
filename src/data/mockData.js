export const generateMockTransactions = (count) => {
  const categories = ['Food', 'Travel', 'Entertainment', 'Utilities', 'Subscriptions'];
  const types = ['income', 'expense'];
  const descriptions = {
    'Food': ['Groceries', 'Restaurant', 'Cafe', 'Swiggy', 'Zomato'],
    'Travel': ['Uber', 'Ola', 'Metro Recharged', 'Flight Booking', 'Fuel'],
    'Entertainment': ['Movie Tickets', 'Concert', 'Bowling', 'Gaming'],
    'Utilities': ['Electricity Bill', 'Water Bill', 'Internet', 'Phone Recharge'],
    'Subscriptions': ['Netflix', 'Spotify', 'Amazon Prime', 'Gym Membership']
  };

  const transactions = [];
  let balance = 150000;
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    // Generate dates within last 3 months
    const date = new Date(now.getTime() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0);
    
    // 80% chance of expense
    const type = Math.random() > 0.2 ? 'expense' : 'income';
    
    let category = 'Salary';
    let description = 'Tech Corp - Monthly Salary';
    let amount = 0;
    
    if (type === 'income') {
      amount = Math.floor(Math.random() * 40000) + 60000; // 60k - 100k
    } else {
      category = categories[Math.floor(Math.random() * categories.length)];
      description = descriptions[category][Math.floor(Math.random() * descriptions[category].length)];
      // Different amount ranges per category
      if (category === 'Food') amount = Math.floor(Math.random() * 2000) + 200;
      else if (category === 'Travel') amount = Math.floor(Math.random() * 3000) + 100;
      else if (category === 'Entertainment') amount = Math.floor(Math.random() * 4000) + 500;
      else if (category === 'Utilities') amount = Math.floor(Math.random() * 5000) + 500;
      else if (category === 'Subscriptions') amount = Math.floor(Math.random() * 1000) + 199;
    }
    
    transactions.push({
      id: `txn-${Math.random().toString(36).substr(2, 9)}`,
      date: date.toISOString(),
      description,
      category,
      amount,
      type
    });
  }

  // Sort latest first
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const MOCK_SUBSCRIPTIONS = [
  { id: 'sub-1', name: 'Netflix Premium', amount: 649, isUnused: false, renewalDate: 15 },
  { id: 'sub-2', name: 'Spotify Duo', amount: 149, isUnused: false, renewalDate: 22 },
  { id: 'sub-3', name: 'Amazon Prime', amount: 1499, isUnused: true, isYearly: true, renewalDate: 1 },
  { id: 'sub-4', name: 'Gym Membership', amount: 1500, isUnused: true, renewalDate: 5 },
  { id: 'sub-5', name: 'Hotstar', amount: 899, isUnused: false, isYearly: true, renewalDate: 18 }
];

export const MOCK_GOALS = [
  { id: 'goal-1', name: 'Trip to Goa', targetRaw: 10000, deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString() },
  { id: 'goal-2', name: 'Emergency Fund', targetRaw: 50000, deadline: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString() },
  { id: 'goal-3', name: 'New Laptop', targetRaw: 80000, deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString() }
];

export const MOCK_BUDGETS = {
  'Food': 8000,
  'Travel': 5000,
  'Entertainment': 4000,
  'Utilities': 6000,
  'Subscriptions': 3000
};

export const MOCK_INVESTMENTS = [
  { id: 'inv-1', asset: 'Reliance Industries', category: 'Stocks', invested: 15000, current: 17200, trend: [15000, 15500, 16100, 16800, 17200] },
  { id: 'inv-2', asset: 'HDFC Bank', category: 'Stocks', invested: 20000, current: 19500, trend: [20000, 20500, 19800, 19200, 19500] },
  { id: 'inv-3', asset: 'Digital Gold', category: 'Gold', invested: 50000, current: 54000, trend: [50000, 51000, 52000, 53500, 54000] },
  { id: 'inv-4', asset: 'Nifty 50 Index', category: 'Mutual Funds', invested: 100000, current: 115000, trend: [100000, 102000, 108000, 112000, 115000] },
  { id: 'inv-5', asset: 'Navi Mumbai Plot', category: 'Real Estate', invested: 500000, current: 500000, trend: [500000, 500000, 500000, 500000, 500000] }
];

export const MOCK_INVESTMENT_OPTIONS = [
  { id: 'opt-1', title: 'Nifty 50 Index Fund', type: 'Mutual Fund', roi: '12-15%', risk: 'Medium', desc: 'Invest in top 50 Indian companies. Ideal for long-term wealth creation.', recommended: true },
  { id: 'opt-2', title: 'SBI Fixed Deposit', type: 'FD', roi: '7.1%', risk: 'Low', desc: 'Secure your capital with guaranteed returns over a fixed tenure.' },
  { id: 'opt-3', title: 'Digital Gold (24K)', type: 'Gold ETF', roi: '8-10%', risk: 'Medium', desc: 'Hedge against inflation. 99.9% pure gold stored in secure vaults.', trending: true },
  { id: 'opt-4', title: 'Small Cap Growth Fund', type: 'SIP', roi: '18-22%', risk: 'High', desc: 'High risk, high reward fund targeting emerging market leaders.' },
  { id: 'opt-5', title: 'Corporate Bonds (AAA)', type: 'Bond', roi: '9.5%', risk: 'Low', desc: 'Stable fixed-income instruments from highly rated corporations.' },
  { id: 'opt-6', title: 'Tech Sector ETF', type: 'Mutual Fund', roi: '14-16%', risk: 'High', desc: 'Targeted exposure to India’s booming IT and software landscape.' }
];
