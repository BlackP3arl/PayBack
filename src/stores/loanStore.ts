import { create } from 'zustand';
import type { Loan, Repayment } from '../types/loan';

interface LoanState {
  loans: Loan[];
  addLoan: (loan: Loan) => void;
  updateLoan: (loan: Loan) => void;
  deleteLoan: (loanId: string) => void;
  getLoan: (loanId: string) => Loan | undefined;
  getLoansByContact: (contactId: string) => Loan[];
  addRepayment: (loanId: string, repayment: Repayment) => void;
  setLoans: (loans: Loan[]) => void;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: [],

  setLoans: (loans) => set({ loans }),

  addLoan: (loan) => {
    set((state) => ({
      loans: [...state.loans, loan],
    }));
  },

  updateLoan: (updatedLoan) => {
    set((state) => ({
      loans: state.loans.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan)),
    }));
  },

  deleteLoan: (loanId) => {
    set((state) => ({
      loans: state.loans.filter((loan) => loan.id !== loanId),
    }));
  },

  getLoan: (loanId) => {
    return get().loans.find((loan) => loan.id === loanId);
  },

  getLoansByContact: (contactId) => {
    return get().loans.filter((loan) => loan.contactId === contactId);
  },

  addRepayment: (loanId, repayment) => {
    set((state) => ({
      loans: state.loans.map((loan) => {
        if (loan.id === loanId) {
          return {
            ...loan,
            repayments: [...(loan.repayments || []), repayment],
            totalRepaid: (loan.totalRepaid || 0) + repayment.amount,
          };
        }
        return loan;
      }),
    }));
  },
}));
