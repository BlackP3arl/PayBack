import * as SQLite from 'expo-sqlite';
import { Contact, Loan, Repayment } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

// Initialize database
export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync('payback.db');

    // Create tables
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phoneNumber TEXT,
        email TEXT,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS loans (
        id TEXT PRIMARY KEY,
        contactId TEXT NOT NULL,
        amount REAL NOT NULL,
        dateIssued TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        notes TEXT,
        attachmentUri TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (contactId) REFERENCES contacts(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS repayments (
        id TEXT PRIMARY KEY,
        loanId TEXT NOT NULL,
        amount REAL NOT NULL,
        repaymentDate TEXT NOT NULL,
        notes TEXT,
        attachmentUri TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (loanId) REFERENCES loans(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_loans_contactId ON loans(contactId);
      CREATE INDEX IF NOT EXISTS idx_repayments_loanId ON repayments(loanId);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Contact operations
export const getAllContacts = async (): Promise<Contact[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync<Contact>('SELECT * FROM contacts ORDER BY name ASC');
  return result;
};

export const getContactById = async (id: string): Promise<Contact | null> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getFirstAsync<Contact>('SELECT * FROM contacts WHERE id = ?', [id]);
  return result || null;
};

export const insertContact = async (contact: Contact): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    'INSERT INTO contacts (id, name, phoneNumber, email, createdAt) VALUES (?, ?, ?, ?, ?)',
    [contact.id, contact.name, contact.phoneNumber || null, contact.email || null, contact.createdAt]
  );
};

export const updateContact = async (id: string, contact: Partial<Contact>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const updates: string[] = [];
  const values: any[] = [];

  if (contact.name !== undefined) {
    updates.push('name = ?');
    values.push(contact.name);
  }
  if (contact.phoneNumber !== undefined) {
    updates.push('phoneNumber = ?');
    values.push(contact.phoneNumber);
  }
  if (contact.email !== undefined) {
    updates.push('email = ?');
    values.push(contact.email);
  }

  if (updates.length > 0) {
    values.push(id);
    await db.runAsync(
      `UPDATE contacts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
};

// Loan operations
export const getAllLoans = async (): Promise<Loan[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync<Loan>('SELECT * FROM loans ORDER BY dateIssued DESC');
  return result;
};

export const getLoansByContactId = async (contactId: string): Promise<Loan[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync<Loan>(
    'SELECT * FROM loans WHERE contactId = ? ORDER BY dateIssued DESC',
    [contactId]
  );
  return result;
};

export const getLoanById = async (id: string): Promise<Loan | null> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getFirstAsync<Loan>('SELECT * FROM loans WHERE id = ?', [id]);
  return result || null;
};

export const insertLoan = async (loan: Loan): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    'INSERT INTO loans (id, contactId, amount, dateIssued, dueDate, notes, attachmentUri, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      loan.id,
      loan.contactId,
      loan.amount,
      loan.dateIssued,
      loan.dueDate,
      loan.notes || null,
      loan.attachmentUri || null,
      loan.createdAt,
      loan.updatedAt,
    ]
  );
};

export const updateLoan = async (id: string, loan: Partial<Loan>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const updates: string[] = [];
  const values: any[] = [];

  if (loan.dueDate !== undefined) {
    updates.push('dueDate = ?');
    values.push(loan.dueDate);
  }
  if (loan.notes !== undefined) {
    updates.push('notes = ?');
    values.push(loan.notes);
  }
  if (loan.attachmentUri !== undefined) {
    updates.push('attachmentUri = ?');
    values.push(loan.attachmentUri);
  }

  if (updates.length > 0) {
    updates.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await db.runAsync(
      `UPDATE loans SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
};

// Repayment operations
export const getAllRepayments = async (): Promise<Repayment[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync<Repayment>('SELECT * FROM repayments ORDER BY repaymentDate DESC');
  return result;
};

export const getRepaymentsByLoanId = async (loanId: string): Promise<Repayment[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getAllAsync<Repayment>(
    'SELECT * FROM repayments WHERE loanId = ? ORDER BY repaymentDate DESC',
    [loanId]
  );
  return result;
};

export const insertRepayment = async (repayment: Repayment): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    'INSERT INTO repayments (id, loanId, amount, repaymentDate, notes, attachmentUri, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      repayment.id,
      repayment.loanId,
      repayment.amount,
      repayment.repaymentDate,
      repayment.notes || null,
      repayment.attachmentUri || null,
      repayment.createdAt,
    ]
  );
};

// Clear all data (for testing)
export const clearAllData = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execAsync(`
    DELETE FROM repayments;
    DELETE FROM loans;
    DELETE FROM contacts;
  `);
};
