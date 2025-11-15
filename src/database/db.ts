import type { Loan, Repayment } from '../types/loan';

// For development, using an in-memory database
// TODO: Implement actual SQLite integration when deploying to mobile
const loansDB: Map<string, Loan> = new Map();
const repaymentDB: Map<string, Repayment[]> = new Map();

export const initDatabase = async (): Promise<void> => {
  try {
    console.log('Database initialized (in-memory for development)');
    // TODO: Initialize actual SQLite connection here for production
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Loan operations
export const addLoan = async (loan: Loan): Promise<void> => {
  loansDB.set(loan.id, loan);
};

export const updateLoan = async (loan: Loan): Promise<void> => {
  loansDB.set(loan.id, loan);
};

export const deleteLoan = async (loanId: string): Promise<void> => {
  loansDB.delete(loanId);
  repaymentDB.delete(loanId);
};

export const getAllLoans = async (): Promise<Loan[]> => {
  return Array.from(loansDB.values());
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
  return loansDB.get(loanId) || null;
};

export const getLoansByContactId = async (contactId: string): Promise<Loan[]> => {
  return Array.from(loansDB.values()).filter((loan) => loan.contactId === contactId);
};

// Repayment operations
export const addRepayment = async (repayment: Repayment): Promise<void> => {
  const loanId = repayment.loanId;
  if (!repaymentDB.has(loanId)) {
    repaymentDB.set(loanId, []);
  }
  repaymentDB.get(loanId)!.push(repayment);
};

export const getRepaymentsByLoanId = async (loanId: string): Promise<Repayment[]> => {
  return repaymentDB.get(loanId) || [];
};

export const deleteRepayment = async (repaymentId: string): Promise<void> => {
  for (const [, repayments] of repaymentDB) {
    const idx = repayments.findIndex((r) => r.id === repaymentId);
    if (idx >= 0) {
      repayments.splice(idx, 1);
      break;
    }
  }
};

export const closeDatabase = async (): Promise<void> => {
  // Cleanup if needed
  console.log('Database connection closed');
};
