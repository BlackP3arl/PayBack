import { create } from 'zustand';
import type { Loan, Repayment } from '../types/loan';
import * as db from '../database/db';

interface LoanState {
  loans: Loan[];
  addLoan: (loan: Loan) => Promise<void>;
  updateLoan: (loan: Loan) => Promise<void>;
  deleteLoan: (loanId: string) => Promise<void>;
  getLoan: (loanId: string) => Loan | undefined;
  getLoansByContact: (contactId: string) => Loan[];
  addRepayment: (loanId: string, repayment: Repayment) => Promise<void>;
  setLoans: (loans: Loan[]) => void;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: [],

  setLoans: (loans) => set({ loans }),

  addLoan: async (loan) => {
    await db.addLoan(loan);
    set((state) => ({
      loans: [...state.loans, loan],
    }));
  },

  updateLoan: async (updatedLoan) => {
    await db.updateLoan(updatedLoan);
    set((state) => ({
      loans: state.loans.map((loan) => (loan.id === updatedLoan.id ? updatedLoan : loan)),
    }));
  },

  deleteLoan: async (loanId) => {
    await db.deleteLoan(loanId);
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

  addRepayment: async (loanId, repayment) => {
    await db.addRepayment(repayment);
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
