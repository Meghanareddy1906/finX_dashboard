# FinX — Personal Finance Dashboard

A modern, feature-rich finance dashboard that helps in managing and tracking one's finances. FinX helps users track income, expenses, budgets, goals, subscriptions, and investments -all in one place.

## Live Demo

[ View Live on Vercel](https://fin-x-dashboard.vercel.app)

## About the Project

FinX is a single-page React application that simulates a personal finance dashboard for a fintech product. It was built with the goal of demonstrating UI design quality, component architecture, state management, and user experience thinking.
The app is designed to feel like a real fintech SaaS product, not a basic template with attention to visual hierarchy, smooth interactions, and thoughtful edge case handling.

## Features

### Dashboard Overview
This is the first section of the side navigation bar. It gives an overall view of the user's balance, income, expenses, savings etc along with a visual representation of account balance in the last three months and a donut chart representing category-wise spending. A small summary card of smart insights can also be seen at the top. It also displays a recent activity section which shows the last 5 transactions performed by the user.
- Summary cards: Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- Animated number counters on load
- Balance Trend line chart (3 months)
- Spending by Category donut chart with legend
- Smart Insights card with dynamic data-driven observations
- Recent Activity feed showing 5 most recent transactions

### Transactions
This sections displays all the transactions of the user along with date, description, amount etc. This is very helpful in tracking daily expenses. The actions feature provides an edit and delete option. This helps the user to keep a track on when and where the money is going. New transactions can be added using the "add transaction" option.
- Full transaction list with Date, Description, Category, Amount, Type
- Search, filter by category, sort by date and amount
- Admin: Add, Edit, Delete transactions via glass-style modals
- Export transactions as CSV or JSON (Admin only). A viewer can only view the data but can not make any changes.
- Color-coded amounts, category badges, alternating row tints

### Financial Insights
This is an interesting section of the nav bar which gives the user a monthly comparision of income and expenses as well as a financial health score along with feedback which helps the user understand his spending patterns. It also contains a top spending category along with suggestions on how he/she can improve savings.
- Highest spending category highlight card
- Monthly Comparison bar chart (this month vs last month)
- Financial Health Score - circular gauge scored out of 100
  - Computed from: Savings Ratio (40%), Spending Consistency (30%), Budget Adherence (30%)
  - Color zones: Red 0–40, Amber 41–70, Green 71–100
  - One-line verdict: "Good financial health", "Overspending detected" etc.

### Budget Tracker
This section is helpful for monitoring monthly budgets. The user can set a budget for the month for every possible cateory and FinX will automatically monitor these budgets and sends a warning when the budget exceeds the limit set by the user. There is an edit option that can be used to edit budget for each category. The user can also add budget using the "new budget" feature.
- Set monthly budget limits per category (Admin only)
- Progress bars with smooth color transitions: green -> amber -> red
- Shows % used and remaining amount per category
- Toast notification when a category exceeds its budget
- Amber "+ Set Budget" for unset categories

### Savings Goals
This is an interesting feature that FinX provides. This basically allows the user to set goals (e.g; buying an iphone, planning a vacation) along with target amount and target month and FinX will calculate the amount that has to be saved each month till the target month to be able to complete the goal. It monitors the progress towards the goal. A new goal can be added using the "add goal" feature.
- Create goals with name, target amount, and deadline
- Progress bars per goal
- Auto-calculates estimated months to reach goal
- Pre-filled example goals: Trip to Goa, Emergency Fund

### Subscription Tracker
Subscriptions are hidden expenses that are auto debited every month and are often ignored. This section tracks the users subscriptions and also displays all the subscriptions along with the monthly cost. Cancel option is provided for active subscriptions. Potential monthly savings will also be displayed at the top. New subscriptions can be added using "add subscription" option.
- List of recurring subscriptions with billing cycle and monthly cost
- Cancel subscriptions - status updates reactively
- Total monthly subscription spend summary
- "You can save ₹X by cancelling unused subscriptions" banner

### Investment Hub
This is a unique section that displays a user's investments in one place. It shows the amount invested, value, profits and losses etc. There is a visual representation of asset distribution as well as a growth trend chart across different months. It also shows individual assets along with its profits/losses. A new asset can be added using "add asset" option.
- Portfolio summary: Total Invested, Current Value, Profit/Loss
- Individual investment cards with sparkline charts
- Asset categories: Stocks, Gold, Real Estate, Mutual Funds
- Asset Distribution donut chart with custom colors and legend
- Portfolio Growth line chart
- Add Investment modal (Admin only)

### Role-Based UI
- Admin: full access - add, edit, delete all data, export, set budgets
- Viewer: read-only access across all sections
- Toggle between roles via the navbar pill

### Dark Mode
- Full dark mode across every section, chart, and modal
- Preference saved to localStorage and restored on next visit

### Privacy Mode
- Toggles a blur filter over all monetary values across the entire app
- Useful for screen sharing or public viewing

### Onboarding
- 3-step welcome modal on first visit
- Stored in localStorage and never shows again after dismissal

### Mobile Responsive
- Hamburger menu opens a slide-in drawer sidebar on mobile
- All sections reflow to single column on small screens
- Transactions switch to stacked card layout on mobile
- Touch-friendly tap targets throughout
- 
## Tech Stack

| Technology | Purpose |
|---|---|
| React (Vite) | Frontend framework |
| Tailwind CSS | Styling and responsive design |
| Recharts | All data visualizations |
| Context API | Global state management |

## Getting Started

### Prerequisites
- Node.js v18 or above
- npm v9 or above

### Installation
```bash
# Clone the repository
git clone https://github.com/Meghanareddy1906/finX_dashboard.git

# Navigate into the project
cd finX_dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
```

## Role Switching

Use the **Admin / Viewer** toggle in the top navbar to switch roles.

| Role | Permissions |
|---|---|
| Admin | Add, edit, delete transactions, set budgets, manage goals, export data |
| Viewer | Read-only access to all sections |

## Project Structure
```
src/
├── components/          # Reusable UI components (modals, cards, charts)
├── context/             # Global state via Context API
├── data/                # Mock data
├── views/               # Section pages
│   ├── Dashboard/
│   ├── Transactions/
│   ├── Insights/
│   ├── Budgets/
│   ├── Goals/
│   ├── Subscriptions/
│   └── InvestmentHub/
└── App.jsx              # Root component and routing
```


## Design Decisions

- **Warm ivory background** (#FAF7F2) instead of pure white - reduces eye strain and feels more premium
- **Indigo-to-slate sidebar gradient** creates a strong visual anchor and brand identity
- **Glassmorphism modals** with backdrop blur for a modern layered feel
- **Context API over Redux** - the app's state complexity doesn't justify Redux overhead, Context keeps it simple and readable
- **Recharts** chosen for its React-native integration and smooth animation support

## Screenshots

DASHBOARD  

<img width="1898" height="912" alt="Screenshot 2026-04-06 012648" src="https://github.com/user-attachments/assets/5ef55dd2-427e-4cff-b6e4-f7f1c43c38a5" />

TRANSACTIONS 

<img width="1904" height="909" alt="Screenshot 2026-04-06 012841" src="https://github.com/user-attachments/assets/7078be46-2a5e-443e-ae54-147146f7993d" />

INSIGHTS 

<img width="1913" height="914" alt="Screenshot 2026-04-06 012902" src="https://github.com/user-attachments/assets/6318818f-9b59-4ec4-86cd-75904a246748" />

BUDGETS 

<img width="1914" height="909" alt="Screenshot 2026-04-06 012931" src="https://github.com/user-attachments/assets/d34db2cb-a239-4137-b96a-cb780f8f4c25" />

GOALS 

<img width="1911" height="912" alt="Screenshot 2026-04-06 013004" src="https://github.com/user-attachments/assets/bd823d8f-33b9-43b7-b105-83abefa8815b" />

SUBSCRIPTIONS 

<img width="1908" height="912" alt="Screenshot 2026-04-06 013025" src="https://github.com/user-attachments/assets/a1690027-cfc3-46c1-a4e0-74d6c4b84afb" />

INVESTMENTS 

<img width="1907" height="908" alt="Screenshot 2026-04-06 013054" src="https://github.com/user-attachments/assets/8ad176f9-ec9c-462b-8f6c-630eaa03ff8d" />

## Known Limitations
- All data is mock/static, no real backend integration
- Investment sparklines use simplified mock trend data
- Dark mode may have minor inconsistencies on some chart tooltips
  
## Author

**Meghana Reddy**
[GitHub](https://github.com/Meghanareddy1906)
