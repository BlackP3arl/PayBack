export interface Repayment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  notes?: string;
  receiptPath?: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone?: string;
  amount: number;
  currency: string;
  loanDate: string;
  dueDate?: string;
  notes?: string;
  receiptPath?: string;
  totalRepaid: number;
  repayments?: Repayment[];
  status: 'pending' | 'partial' | 'repaid';
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface LoanStats {
  totalOutstanding: number;
  totalLoaned: number;
  totalRepaid: number;
  loansCount: number;
}
