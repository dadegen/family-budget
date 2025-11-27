import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus, Home, User, Wallet, UserCircle } from 'lucide-react';
import { AccountType, Transaction, Category, Budget, IncomeConfig } from './types';
import { StorageService } from './services/storage';
import { Dashboard } from './components/Dashboard';
import { Modal } from './components/ui/Modal';
import { AddTransactionForm } from './components/AddTransactionForm';
import { Settings } from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState<AccountType>('Commun');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [incomes, setIncomes] = useState<IncomeConfig[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    setTransactions(StorageService.getTransactions());
    setCategories(StorageService.getCategories());
    setBudgets(StorageService.getBudgets());
    setIncomes(StorageService.getIncomes());
  }, []);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'timestamp' | 'isVerified'> & { isVerified?: boolean }) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      isVerified: newTx.isVerified ?? false 
    } as Transaction;

    const transactionsToAdd = [transaction];

    if (
        newTx.category === 'Virement compte commun' && 
        newTx.type !== 'Revenu' && 
        (newTx.account === 'Emilie' || newTx.account === 'Cedric')
    ) {
        const autoIncomeTx: Transaction = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            date: newTx.date,
            account: 'Commun',
            type: 'Revenu',
            category: 'Virement reçu',
            amount: newTx.amount,
            description: `Virement reçu de ${newTx.account}`,
            isVerified: newTx.isVerified ?? false 
        };
        transactionsToAdd.push(autoIncomeTx);
    }
    
    setTransactions(prev => {
        const updated = [...transactionsToAdd, ...prev];
        StorageService.saveTransactions(updated);
        return updated;
    });
    
    if (isAddModalOpen) setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => {
        const updated = prev.filter(t => t.id !== id);
        StorageService.saveTransactions(updated);
        return updated;
    });
  };

  const handleToggleVerified = (id: string) => {
    setTransactions(prev => {
        const updated = prev.map(t => 
            t.id === id ? { ...t, isVerified: !t.isVerified } : t
        );
        StorageService.saveTransactions(updated);
        return updated;
    });
  };

  const handleAddCategory = (name: string) => {
    const newCat = { id: crypto.randomUUID(), name };
    setCategories(prev => {
        const updated = [...prev, newCat];
        StorageService.saveCategories(updated);
        return updated;
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => {
        const updated = prev.filter(c => c.id !== id);
        StorageService.saveCategories(updated);
        return updated;
    });
  };

  const handleAddBudget = (name: string, amount: number, account: AccountType, isFixed: boolean) => {
    if (budgets.some(b => b.name === name && b.account === account)) {
      alert(`Un budget "${name}" pour ${account} existe déjà.`);
      return;
    }
    const newBudget: Budget = { id: crypto.randomUUID(), name, amount, account, isFixed };
    setBudgets(prev => {
        const updated = [...prev, newBudget];
        StorageService.saveBudgets(updated);
        return updated;
    });
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => {
        const updated = prev.filter(b => b.id !== id);
        StorageService.saveBudgets(updated);
        return updated;
    });
  };

  const handleAddIncome = (name: string, amount: number, account: AccountType) => {
      const newIncome: IncomeConfig = { id: crypto.randomUUID(), name, amount, account };
      setIncomes(prev => {
          const updated = [...prev, newIncome];
          StorageService.saveIncomes(updated);
          return updated;
      });
  };

  const handleDeleteIncome = (id: string) => {
      setIncomes(prev => {
          const updated = prev.filter(i => i.id !== id);
          StorageService.saveIncomes(updated);
          return updated;
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 pb-safe">
      
      {/* Subtle Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between bg-slate-50/80 backdrop-blur-md">
        <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                Budget<span className="text-blue-600">Famille</span>
            </h1>
            <span className="text-xs text-slate-400 font-medium">Bon retour !</span>
        </div>
        <button 
          onClick={() => setIsSettingsModalOpen(true)}
          className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm active:scale-95 transition-all"
        >
          <SettingsIcon size={20} />
        </button>
      </header>

      {/* Segmented Control */}
      <div className="px-6 mb-4 sticky top-[72px] z-20">
        <div className="bg-slate-200/50 p-1 rounded-2xl flex backdrop-blur-sm">
          {(['Commun', 'Emilie', 'Cedric'] as AccountType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm scale-[1.00]' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'Commun' ? '🏠 Commun' : tab === 'Emilie' ? '👩 Émilie' : '👨 Cédric'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 relative z-10">
        <Dashboard 
          account={activeTab} 
          transactions={transactions} 
          budgets={budgets}
          incomes={incomes}
          onDelete={handleDeleteTransaction}
          onToggleVerified={handleToggleVerified}
          onAddTransaction={handleAddTransaction} 
        />
      </main>

      {/* Floating Action Button (FAB) Centered */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full shadow-2xl shadow-slate-900/40 text-white transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Ajouter"
      >
        <AddTransactionForm 
            categories={categories} 
            onSubmit={handleAddTransaction} 
            onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        title="Réglages"
      >
        <Settings 
          categories={categories}
          budgets={budgets}
          incomes={incomes}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddBudget={handleAddBudget}
          onDeleteBudget={handleDeleteBudget}
          onAddIncome={handleAddIncome}
          onDeleteIncome={handleDeleteIncome}
        />
      </Modal>

    </div>
  );
}

export default App;