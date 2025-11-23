import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { useLoanStore } from '../stores/loanStore';
import { initDatabase, getAllLoans, getRepaymentsByLoanId } from '../database/db';
import type { Loan } from '../types/loan';

export const useAppInit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setInitialized = useAppStore((state) => state.setInitialized);
  const setLoans = useLoanStore((state) => state.setLoans);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);

        // Initialize database
        await initDatabase();

        // Load loans from database
        const loans = await getAllLoans();

        // Load repayments for each loan
        const loansWithRepayments: Loan[] = await Promise.all(
          loans.map(async (loan) => {
            const repayments = await getRepaymentsByLoanId(loan.id);
            return {
              ...loan,
              repayments,
            };
          })
        );

        // Set loans in store
        setLoans(loansWithRepayments);

        setInitialized(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize app';
        setError(message);
        console.error('App initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setInitialized, setLoans]);

  return { isLoading, error };
};
