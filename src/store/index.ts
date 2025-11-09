import { create } from 'zustand';
import { AppState, Contact, Loan, Repayment, LoanWithDetails, ContactWithLoans } from '../types';
import {
  initDatabase,
  getAllContacts,
  getAllLoans,
  getAllRepayments,
  insertContact,
  insertLoan,
  insertRepayment,
  updateLoan as dbUpdateLoan,
  getRepaymentsByLoanId,
} from '../database';
import { generateId } from '../utils/format';

export const useStore = create<AppState>((set, get) => ({
  contacts: [],
  loans: [],
  repayments: [],
  isLoading: false,
  error: null,

  // Load all data from database
  loadData: async () => {
    set({ isLoading: true, error: null });
    try {
      await initDatabase();
      const contacts = await getAllContacts();
      const loans = await getAllLoans();
      const repayments = await getAllRepayments();

      set({
        contacts,
        loans,
        repayments,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false,
      });
    }
  },

  // Add a new contact
  addContact: async (contactData) => {
    try {
      const contact: Contact = {
        id: generateId(),
        ...contactData,
        createdAt: new Date().toISOString(),
      };

      await insertContact(contact);
      set((state) => ({
        contacts: [...state.contacts, contact],
      }));
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  // Add a new loan
  addLoan: async (loanData) => {
    try {
      const loan: Loan = {
        id: generateId(),
        ...loanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await insertLoan(loan);
      set((state) => ({
        loans: [...state.loans, loan],
      }));
    } catch (error) {
      console.error('Error adding loan:', error);
      throw error;
    }
  },

  // Update a loan
  updateLoan: async (id, updates) => {
    try {
      await dbUpdateLoan(id, updates);

      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === id
            ? { ...loan, ...updates, updatedAt: new Date().toISOString() }
            : loan
        ),
      }));
    } catch (error) {
      console.error('Error updating loan:', error);
      throw error;
    }
  },

  // Add a repayment
  addRepayment: async (repaymentData) => {
    try {
      const repayment: Repayment = {
        id: generateId(),
        ...repaymentData,
        createdAt: new Date().toISOString(),
      };

      await insertRepayment(repayment);
      set((state) => ({
        repayments: [...state.repayments, repayment],
      }));
    } catch (error) {
      console.error('Error adding repayment:', error);
      throw error;
    }
  },

  // Get contact with all their loans and calculated totals
  getContactWithLoans: (contactId) => {
    const state = get();
    const contact = state.contacts.find((c) => c.id === contactId);
    if (!contact) return undefined;

    const contactLoans = state.loans.filter((l) => l.contactId === contactId);
    const loansWithDetails: LoanWithDetails[] = contactLoans.map((loan) => {
      const loanRepayments = state.repayments.filter((r) => r.loanId === loan.id);
      const totalPaid = loanRepayments.reduce((sum, r) => sum + r.amount, 0);
      const balanceDue = loan.amount - totalPaid;

      return {
        ...loan,
        contactName: contact.name,
        totalPaid,
        balanceDue,
        repayments: loanRepayments,
      };
    });

    const totalDue = loansWithDetails.reduce((sum, l) => sum + l.balanceDue, 0);

    return {
      ...contact,
      loans: loansWithDetails,
      totalDue,
    };
  },

  // Get all contacts with their loans
  getAllContactsWithLoans: () => {
    const state = get();
    const contactsWithLoans: ContactWithLoans[] = [];

    state.contacts.forEach((contact) => {
      const contactLoans = state.loans.filter((l) => l.contactId === contact.id);
      const loansWithDetails: LoanWithDetails[] = contactLoans.map((loan) => {
        const loanRepayments = state.repayments.filter((r) => r.loanId === loan.id);
        const totalPaid = loanRepayments.reduce((sum, r) => sum + r.amount, 0);
        const balanceDue = loan.amount - totalPaid;

        return {
          ...loan,
          contactName: contact.name,
          totalPaid,
          balanceDue,
          repayments: loanRepayments,
        };
      });

      const totalDue = loansWithDetails.reduce((sum, l) => sum + l.balanceDue, 0);

      // Only include contacts with outstanding balances
      if (totalDue > 0) {
        contactsWithLoans.push({
          ...contact,
          loans: loansWithDetails,
          totalDue,
        });
      }
    });

    return contactsWithLoans;
  },

  // Get total outstanding amount across all loans
  getTotalOutstanding: () => {
    const state = get();
    let total = 0;

    state.loans.forEach((loan) => {
      const loanRepayments = state.repayments.filter((r) => r.loanId === loan.id);
      const totalPaid = loanRepayments.reduce((sum, r) => sum + r.amount, 0);
      const balanceDue = loan.amount - totalPaid;
      total += balanceDue;
    });

    return total;
  },

  // Get loan with details
  getLoanWithDetails: (loanId) => {
    const state = get();
    const loan = state.loans.find((l) => l.id === loanId);
    if (!loan) return undefined;

    const contact = state.contacts.find((c) => c.id === loan.contactId);
    const loanRepayments = state.repayments.filter((r) => r.loanId === loan.id);
    const totalPaid = loanRepayments.reduce((sum, r) => sum + r.amount, 0);
    const balanceDue = loan.amount - totalPaid;

    return {
      ...loan,
      contactName: contact?.name || 'Unknown',
      totalPaid,
      balanceDue,
      repayments: loanRepayments,
    };
  },
}));
