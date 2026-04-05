import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import Layout from './components/Layout/Layout';
import OnboardingModal from './components/OnboardingModal';

function App() {
  return (
    <FinanceProvider>
      <Layout />
      <OnboardingModal />
    </FinanceProvider>
  );
}

export default App;
