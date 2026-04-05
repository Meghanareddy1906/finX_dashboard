import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Button from './UI/Button';
import { CheckCircle2, ChevronRight, PieChart } from 'lucide-react';

const OnboardingModal = () => {
  const { isOnboardingDone, completeOnboarding } = useFinance();
  const [step, setStep] = useState(1);

  if (isOnboardingDone) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Animated Background blob */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="mb-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 flex items-center justify-center mb-2">
              <PieChart size={32} />
            </div>
          </div>
          
          <div className="text-center">
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-2">Welcome to FinX</h2>
                <p className="text-slate-500 dark:text-slate-400">Track your finances easily with stunning visualizations and powerful tools.</p>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-2">Complete Control</h2>
                <p className="text-slate-500 dark:text-slate-400">Set budgets, track savings goals, and manage subscriptions all in one place.</p>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
                <p className="text-slate-500 dark:text-slate-400">We've loaded some realistic demo data so you can see how things work immediately.</p>
              </>
            )}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-indigo-500' : step > i ? 'w-2 bg-indigo-500/50' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
            ></div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 relative z-10 mt-4">
          {step > 1 && step < 3 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button variant="primary" className="w-full" onClick={() => setStep(step + 1)}>
              Continue <ChevronRight size={18} />
            </Button>
          ) : (
            <Button variant="primary" className="w-full" onClick={completeOnboarding}>
              Got it! <CheckCircle2 size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
