import type { Loan, Repayment } from '../types/loan';
import { isNativePlatform } from '../utils/platform';
import * as nativeSQLite from './sqlite-native';
import * as webSQLite from './sqlite-web';

/**
 * Platform-agnostic database module
 * Automatically selects SQLite for native platforms (iOS/Android)
 * and IndexedDB for web platform
 */

type DatabaseImpl = typeof nativeSQLite | typeof webSQLite;

let dbImpl: DatabaseImpl | null = null;

export const initDatabase = async (): Promise<void> => {
  try {
    if (isNativePlatform()) {
      dbImpl = nativeSQLite;
      await nativeSQLite.initNativeSQLite();
    } else {
      dbImpl = webSQLite;
      await webSQLite.initWebSQLite();
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

const getDb = () => {
  if (!dbImpl) throw new Error('Database not initialized');
  return dbImpl;
};

// Loan operations
export const addLoan = async (loan: Loan): Promise<void> => {
  return getDb().addLoan(loan);
};

export const updateLoan = async (loan: Loan): Promise<void> => {
  return getDb().updateLoan(loan);
};

export const deleteLoan = async (loanId: string): Promise<void> => {
  return getDb().deleteLoan(loanId);
};

export const getAllLoans = async (): Promise<Loan[]> => {
  return getDb().getAllLoans();
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
  return getDb().getLoanById(loanId);
};

// Repayment operations
export const addRepayment = async (repayment: Repayment): Promise<void> => {
  return getDb().addRepayment(repayment);
};

export const getRepaymentsByLoanId = async (loanId: string): Promise<Repayment[]> => {
  return getDb().getRepaymentsByLoanId(loanId);
};

export const deleteRepayment = async (repaymentId: string): Promise<void> => {
  return getDb().deleteRepayment(repaymentId);
};

export const closeDatabase = async (): Promise<void> => {
  if (isNativePlatform()) {
    await nativeSQLite.closeNativeSQLite();
  } else {
    await webSQLite.closeWebSQLite();
  }
  dbImpl = null;
};
