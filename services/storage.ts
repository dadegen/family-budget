
import { Transaction, Category, Budget, IncomeConfig } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_BUDGETS, DEFAULT_INCOMES } from '../constants';

const KEYS = {
  TRANSACTIONS: 'budget_family_transactions',
  CATEGORIES: 'budget_family_categories',
  BUDGETS: 'budget_family_budgets',
  INCOMES: 'budget_family_incomes',
};

export const StorageService = {
  getTransactions: (): Transaction[] => {
    try {
      const stored = localStorage.getItem(KEYS.TRANSACTIONS);
      const data = stored ? JSON.parse(stored) : [];
      // Migration: Ensure new fields exist
      return data.map((t: any) => ({
        ...t,
        isVerified: t.isVerified || false // Default to false if missing
      }));
    } catch (e) {
      console.error("Failed to load transactions", e);
      return [];
    }
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getCategories: (): Category[] => {
    try {
      const stored = localStorage.getItem(KEYS.CATEGORIES);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  },

  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getBudgets: (): Budget[] => {
    try {
      const stored = localStorage.getItem(KEYS.BUDGETS);
      const data = stored ? JSON.parse(stored) : DEFAULT_BUDGETS;
      // Migration: Ensure account field exists
      return data.map((b: any) => ({
        ...b,
        account: b.account || 'Commun',
        isFixed: b.isFixed !== undefined ? b.isFixed : false
      }));
    } catch (e) {
      return DEFAULT_BUDGETS;
    }
  },

  saveBudgets: (budgets: Budget[]) => {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getIncomes: (): IncomeConfig[] => {
    try {
        const stored = localStorage.getItem(KEYS.INCOMES);
        return stored ? JSON.parse(stored) : DEFAULT_INCOMES;
    } catch (e) {
        return DEFAULT_INCOMES;
    }
  },

  saveIncomes: (incomes: IncomeConfig[]) => {
      localStorage.setItem(KEYS.INCOMES, JSON.stringify(incomes));
  }
};
