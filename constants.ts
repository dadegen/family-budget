
import { Category, Budget, IncomeConfig } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Courses' },
  { id: '2', name: 'Loyer' },
  { id: '3', name: 'Électricité' },
  { id: '4', name: 'Sorties' },
  { id: '5', name: 'Téléphonie' },
  { id: '6', name: 'Divers' },
  { id: '7', name: 'Transport' },
  { id: '8', name: 'Santé' },
  { id: '9', name: 'Salaire' },
  { id: '10', name: 'Aides' },
  { id: '11', name: 'Virement compte commun' },
];

export const DEFAULT_BUDGETS: Budget[] = [
  { id: '1', name: 'Courses', amount: 600, account: 'Commun', isFixed: false },
  { id: '2', name: 'Loyer', amount: 850, account: 'Commun', isFixed: true },
];

export const DEFAULT_INCOMES: IncomeConfig[] = [
    // Empty by default, user will add them
];

export const ACCOUNT_COLORS = {
  Commun: '#3b82f6', // blue-500
  Emilie: '#ec4899', // pink-500
  Cedric: '#10b981', // emerald-500
};
