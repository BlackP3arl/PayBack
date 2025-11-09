// Core data types for PayBack app

export interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  contactId: string;
  amount: number;
  dateIssued: string;
  dueDate: string;
  notes?: string;
  attachmentUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  repaymentDate: string;
  notes?: string;
  attachmentUri?: string;
  createdAt: string;
}

export interface LoanWithDetails extends Loan {
  contactName: string;
  totalPaid: number;
  balanceDue: number;
  repayments: Repayment[];
}

export interface ContactWithLoans extends Contact {
  loans: LoanWithDetails[];
  totalDue: number;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  ContactSelector: undefined;
  AddLoan: { contactId: string; contactName: string };
  LoanSummary: { contactId: string; contactName: string };
  LoanDetail: { loanId: string };
  AddRepayment: { loanId: string; contactId: string };
};

// Store state types
export interface AppState {
  contacts: Contact[];
  loans: Loan[];
  repayments: Repayment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadData: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Promise<void>;
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLoan: (id: string, updates: Partial<Omit<Loan, 'id' | 'createdAt' | 'contactId' | 'amount'>>) => Promise<void>;
  addRepayment: (repayment: Omit<Repayment, 'id' | 'createdAt'>) => Promise<void>;

  // Computed values
  getContactWithLoans: (contactId: string) => ContactWithLoans | undefined;
  getAllContactsWithLoans: () => ContactWithLoans[];
  getTotalOutstanding: () => number;
  getLoanWithDetails: (loanId: string) => LoanWithDetails | undefined;
}

// Theme types
export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    error: string;
    success: string;
  };
}

// Filter and sort types
export type SortOption = 'name' | 'amount' | 'dueDate';
export type SortDirection = 'asc' | 'desc';
