
export type AccountType = 'Commun' | 'Emilie' | 'Cedric';
export type ExpenseType = 'Fixe' | 'Variable' | 'Revenu';

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  account: AccountType;
  type: ExpenseType;
  category: string;
  amount: number;
  description: string;
  timestamp: number;
  isVerified: boolean; // New field for checkboxes
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  account: AccountType; // New field to assign budget to specific account
  isFixed?: boolean; // New field to identify fixed monthly expenses (bills)
}

export interface IncomeConfig {
  id: string;
  name: string;
  amount: number;
  account: AccountType;
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  incomes: IncomeConfig[];
}
