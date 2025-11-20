import type { Loan, Repayment } from '../types/loan';

// In-memory implementation for development and testing
// TODO: Implement actual SQLite when deploying to production mobile builds
const loansDB: Map<string, Loan> = new Map();
const repaymentDB: Map<string, Repayment[]> = new Map();

/**
 * Native SQLite implementation for iOS and Android
 * Currently using in-memory fallback for development
 * TODO: Replace with actual SQLite for production mobile builds
 */

export const initNativeSQLite = async (): Promise<void> => {
  try {
    console.log('Native SQLite database initialized (in-memory fallback)');
    // TODO: Initialize actual SQLite connection here for production
    // const sqlite = CapacitorSQLite;
    // await sqlite.createConnection(...)
  } catch (error) {
    console.error('Failed to initialize native SQLite:', error);
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

export const closeNativeSQLite = async (): Promise<void> => {
  console.log('Native database connection closed');
};
