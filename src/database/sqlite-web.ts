import type { Loan, Repayment } from '../types/loan';

/**
 * IndexedDB implementation for web platform
 * Provides persistent storage using browser's IndexedDB
 */

const DB_NAME = 'payback_db';
const DB_VERSION = 1;
const LOANS_STORE = 'loans';
const REPAYMENTS_STORE = 'repayments';

let db: IDBDatabase | null = null;

export const initWebSQLite = async (): Promise<void> => {
  try {
    db = await openDatabase();
    console.log('Web IndexedDB database initialized');
  } catch (error) {
    console.error('Failed to initialize web database:', error);
    throw error;
  }
};

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create loans store
      if (!database.objectStoreNames.contains(LOANS_STORE)) {
        const loansStore = database.createObjectStore(LOANS_STORE, { keyPath: 'id' });
        loansStore.createIndex('createdAt', 'createdAt', { unique: false });
        loansStore.createIndex('contactId', 'contactId', { unique: false });
      }

      // Create repayments store
      if (!database.objectStoreNames.contains(REPAYMENTS_STORE)) {
        const repaymentStore = database.createObjectStore(REPAYMENTS_STORE, { keyPath: 'id' });
        repaymentStore.createIndex('loanId', 'loanId', { unique: false });
        repaymentStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

// Loan operations
export const addLoan = async (loan: Loan): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([LOANS_STORE], 'readwrite');
    const store = transaction.objectStore(LOANS_STORE);
    const request = store.add(loan);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const updateLoan = async (loan: Loan): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([LOANS_STORE], 'readwrite');
    const store = transaction.objectStore(LOANS_STORE);
    const request = store.put(loan);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const deleteLoan = async (loanId: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([LOANS_STORE, REPAYMENTS_STORE], 'readwrite');
    const loansStore = transaction.objectStore(LOANS_STORE);
    const repaymentStore = transaction.objectStore(REPAYMENTS_STORE);

    // Delete loan
    const deleteRequest = loansStore.delete(loanId);
    deleteRequest.onerror = () => reject(deleteRequest.error);

    // Delete related repayments
    const index = repaymentStore.index('loanId');
    const range = IDBKeyRange.only(loanId);
    const deleteRepayments = index.openCursor(range);

    deleteRepayments.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        resolve();
      }
    };

    deleteRepayments.onerror = () => reject(deleteRepayments.error);
  });
};

export const getAllLoans = async (): Promise<Loan[]> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([LOANS_STORE], 'readonly');
    const store = transaction.objectStore(LOANS_STORE);
    const index = store.index('createdAt');
    const request = index.openCursor(null, 'prev');

    const loans: Loan[] = [];

    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        loans.push(cursor.value as Loan);
        cursor.continue();
      } else {
        resolve(loans);
      }
    };
  });
};

export const getLoanById = async (loanId: string): Promise<Loan | null> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([LOANS_STORE], 'readonly');
    const store = transaction.objectStore(LOANS_STORE);
    const request = store.get(loanId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

// Repayment operations
export const addRepayment = async (repayment: Repayment): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([REPAYMENTS_STORE], 'readwrite');
    const store = transaction.objectStore(REPAYMENTS_STORE);
    const request = store.add(repayment);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getRepaymentsByLoanId = async (loanId: string): Promise<Repayment[]> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([REPAYMENTS_STORE], 'readonly');
    const store = transaction.objectStore(REPAYMENTS_STORE);
    const index = store.index('loanId');
    const range = IDBKeyRange.only(loanId);
    const request = index.openCursor(range, 'prev');

    const repayments: Repayment[] = [];

    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        repayments.push(cursor.value as Repayment);
        cursor.continue();
      } else {
        resolve(repayments);
      }
    };
  });
};

export const deleteRepayment = async (repaymentId: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([REPAYMENTS_STORE], 'readwrite');
    const store = transaction.objectStore(REPAYMENTS_STORE);
    const request = store.delete(repaymentId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const closeWebSQLite = async (): Promise<void> => {
  if (db) {
    db.close();
    db = null;
  }
};
