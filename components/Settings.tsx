
import React, { useState } from 'react';
import { Category, Budget, IncomeConfig, AccountType } from '../types';
import { Plus, Trash2, Wallet, User, Home, CheckSquare } from 'lucide-react';

interface SettingsProps {
  categories: Category[];
  budgets: Budget[];
  incomes: IncomeConfig[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBudget: (name: string, amount: number, account: AccountType, isFixed: boolean) => void;
  onDeleteBudget: (id: string) => void;
  onAddIncome: (name: string, amount: number, account: AccountType) => void;
  onDeleteIncome: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  categories,
  budgets,
  incomes,
  onAddCategory,
  onDeleteCategory,
  onAddBudget,
  onDeleteBudget,
  onAddIncome,
  onDeleteIncome
}) => {
  const [newCat, setNewCat] = useState('');
  
  // Budget Form State
  const [newBudgetName, setNewBudgetName] = useState(categories[0]?.name || '');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetAccount, setNewBudgetAccount] = useState<AccountType>('Commun');
  const [newBudgetIsFixed, setNewBudgetIsFixed] = useState(false);

  // Income Form State
  const [newIncomeName, setNewIncomeName] = useState('Salaire');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomeAccount, setNewIncomeAccount] = useState<AccountType>('Commun');

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      onAddCategory(newCat.trim());
      setNewCat('');
    }
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newBudgetAmount);
    if (newBudgetName && amount > 0) {
      onAddBudget(newBudgetName, amount, newBudgetAccount, newBudgetIsFixed);
      setNewBudgetAmount('');
      setNewBudgetIsFixed(false);
    }
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newIncomeAmount);
    if (newIncomeName && amount > 0) {
      onAddIncome(newIncomeName, amount, newIncomeAccount);
      setNewIncomeAmount('');
    }
  };

  const getAccountIcon = (acc: AccountType) => {
    if (acc === 'Commun') return <Home size={14} className="text-blue-500" />;
    if (acc === 'Emilie') return <User size={14} className="text-pink-500" />;
    return <Wallet size={14} className="text-emerald-500" />;
  };

  return (
    <div className="space-y-8">
      
      {/* --- REVENUS FIXES --- */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Revenus Mensuels Fixes (Salaires, Aides...)</h3>
        <p className="text-xs text-gray-500 mb-2">Ces montants seront ajoutés automatiquement au solde de chaque mois.</p>
        <div className="space-y-3 mb-4">
          {incomes.map(inc => (
            <div key={inc.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg text-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                    {inc.name} 
                    <span className="bg-gray-100 p-1 rounded-full">{getAccountIcon(inc.account)}</span>
                </span>
                <span className="text-xs text-green-600 font-medium">+{inc.amount}€ / mois</span>
              </div>
              <button 
                onClick={() => onDeleteIncome(inc.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {incomes.length === 0 && (
            <div className="text-center text-gray-400 text-sm italic py-2">Aucun revenu configuré</div>
          )}
        </div>

        {/* Add Income Form */}
        <form onSubmit={handleAddIncome} className="bg-green-50/50 p-3 rounded-xl border border-green-100">
           <label className="block text-xs font-bold text-green-700 uppercase mb-2">Ajouter un revenu</label>
           <div className="flex flex-col gap-2">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newIncomeName}
                  onChange={(e) => setNewIncomeName(e.target.value)}
                  placeholder="Ex: Salaire, CAF, Virement..."
                  className="flex-1 rounded-lg border-gray-300 bg-white border p-2 text-sm"
                />
                 <select
                  value={newIncomeAccount}
                  onChange={(e) => setNewIncomeAccount(e.target.value as AccountType)}
                  className="w-1/3 rounded-lg border-gray-300 bg-white border p-2 text-sm"
                >
                  <option value="Commun">Commun</option>
                  <option value="Emilie">Émilie</option>
                  <option value="Cedric">Cédric</option>
                </select>
             </div>
             <div className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-gray-400">€</span>
                    <input 
                      type="number" 
                      value={newIncomeAmount}
                      onChange={(e) => setNewIncomeAmount(e.target.value)}
                      placeholder="Montant"
                      className="w-full rounded-lg border-gray-300 bg-white border p-2 pl-7 text-sm"
                    />
                </div>
                <button 
                  type="submit"
                  disabled={!newIncomeAmount}
                  className="bg-green-600 text-white p-2 rounded-lg disabled:opacity-50"
                >
                  <Plus size={20} />
                </button>
             </div>
           </div>
        </form>
      </section>

      <hr className="border-gray-100" />

      {/* --- BUDGETS --- */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Budgets & Charges Fixes</h3>
        
        {/* List existing budgets */}
        <div className="space-y-3 mb-4">
          {budgets.map(budget => (
            <div key={budget.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg text-sm">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                    {budget.name}
                    <span className="bg-gray-100 p-1 rounded-full">{getAccountIcon(budget.account)}</span>
                    {budget.isFixed && <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold">Fixe</span>}
                </span>
                <span className="text-xs text-gray-400">Objectif: {budget.amount}€</span>
              </div>
              <button 
                onClick={() => onDeleteBudget(budget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {budgets.length === 0 && (
            <div className="text-center text-gray-400 text-sm italic py-2">Aucun budget défini</div>
          )}
        </div>

        {/* Add Budget Form */}
        <form onSubmit={handleAddBudget} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ajouter un budget ou une charge fixe</label>
           
           <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <select 
                    value={newBudgetName}
                    onChange={(e) => setNewBudgetName(e.target.value)}
                    className="flex-1 rounded-lg border-gray-300 bg-white border p-2 text-sm"
                    >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    </select>
                    <select
                    value={newBudgetAccount}
                    onChange={(e) => setNewBudgetAccount(e.target.value as AccountType)}
                    className="w-1/3 rounded-lg border-gray-300 bg-white border p-2 text-sm"
                    >
                    <option value="Commun">Commun</option>
                    <option value="Emilie">Émilie</option>
                    <option value="Cedric">Cédric</option>
                    </select>
                </div>

                {/* Checkbox for Fixed Expense */}
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setNewBudgetIsFixed(!newBudgetIsFixed)}
                >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newBudgetIsFixed ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {newBudgetIsFixed && <CheckSquare size={14} className="text-white" />}
                    </div>
                    <span className="text-xs text-gray-600 select-none">
                        C'est une dépense fixe mensuelle (ex: Loyer, Forfait)
                    </span>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-gray-400">€</span>
                        <input 
                        type="number" 
                        value={newBudgetAmount}
                        onChange={(e) => setNewBudgetAmount(e.target.value)}
                        placeholder="Montant"
                        className="w-full rounded-lg border-gray-300 bg-white border p-2 pl-7 text-sm"
                        />
                    </div>
                    <button 
                    type="submit"
                    disabled={!newBudgetAmount}
                    className="bg-slate-800 text-white p-2 rounded-lg disabled:opacity-50"
                    >
                    <Plus size={20} />
                    </button>
                </div>
           </div>
        </form>
      </section>

      <hr className="border-gray-100" />

      {/* --- CATEGORIES --- */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Catégories</h3>
        <form onSubmit={handleAddCat} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Nouvelle catégorie..."
            className="flex-1 rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-sm"
          />
          <button 
            type="submit"
            disabled={!newCat.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-lg disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </form>

        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg text-sm">
              <span>{cat.name}</span>
              <button 
                onClick={() => onDeleteCategory(cat.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
