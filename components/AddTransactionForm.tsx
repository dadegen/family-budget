import React, { useState } from 'react';
import { Transaction, AccountType, ExpenseType, Category } from '../types';
import { ShoppingBag, Home, Zap, Coffee, Smartphone, Globe, Bus, Heart, Briefcase, Gift, ArrowRightLeft, DollarSign, Plus, ArrowRight } from 'lucide-react';

interface AddTransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'isVerified'>) => void;
  onCancel: () => void;
}

// Icon Helper
const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('course')) return <ShoppingBag size={18} />;
    if (n.includes('loyer')) return <Home size={18} />;
    if (n.includes('elec') || n.includes('gaz')) return <Zap size={18} />;
    if (n.includes('sortie') || n.includes('resto')) return <Coffee size={18} />;
    if (n.includes('tel') || n.includes('internet')) return <Smartphone size={18} />;
    if (n.includes('transport') || n.includes('essence')) return <Bus size={18} />;
    if (n.includes('sante') || n.includes('doc')) return <Heart size={18} />;
    if (n.includes('salaire')) return <Briefcase size={18} />;
    if (n.includes('virement')) return <ArrowRightLeft size={18} />;
    return <Globe size={18} />;
};

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ categories, onSubmit, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<AccountType>('Commun');
  const [type, setType] = useState<ExpenseType>('Variable');
  const [category, setCategory] = useState<string>(categories[0]?.name || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      date,
      account,
      type,
      category,
      amount: parseFloat(amount),
      description
    });
  };

  const presetAmounts = [5, 10, 20, 50];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      
      {/* 1. HUGE AMOUNT INPUT */}
      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="flex items-center justify-center relative w-full">
             <span className={`text-4xl font-bold mr-2 ${type === 'Revenu' ? 'text-emerald-500' : 'text-slate-800'}`}>€</span>
             <input
                type="number"
                step="0.01"
                inputMode="decimal"
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`text-6xl font-bold bg-transparent border-none text-center w-48 focus:ring-0 p-0 placeholder-slate-200 ${type === 'Revenu' ? 'text-emerald-600' : 'text-slate-800'}`}
             />
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-2">
            {type === 'Revenu' ? 'Montant reçu' : 'Montant payé'}
        </p>
        
        {/* Quick Amount Pills */}
        <div className="flex gap-2 mt-6">
            {presetAmounts.map(val => (
                <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="px-4 py-1.5 bg-slate-100 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    {val}€
                </button>
            ))}
        </div>
      </div>

      {/* 2. SETTINGS AREA */}
      <div className="bg-slate-50 rounded-3xl p-6 space-y-5 shadow-inner">
        
        {/* Type Switcher */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl">
           {(['Variable', 'Fixe', 'Revenu'] as const).map((t) => (
             <button
                key={t}
                type="button"
                onClick={() => { setType(t); if(t==='Revenu') setCategory('Salaire'); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    type === t 
                    ? 'bg-white text-slate-800 shadow-sm scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                {t}
             </button>
           ))}
        </div>

        {/* Account & Date Row */}
        <div className="flex gap-3">
             <div className="flex-1 bg-white p-2 rounded-xl border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Compte</label>
                <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value as AccountType)}
                    className="w-full bg-transparent font-bold text-slate-700 text-sm border-none focus:ring-0 p-1"
                >
                    <option value="Commun">🏠 Commun</option>
                    <option value="Cedric">👨 Cédric</option>
                    <option value="Emilie">👩 Émilie</option>
                </select>
             </div>
             <div className="w-1/3 bg-white p-2 rounded-xl border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-slate-700 text-sm border-none focus:ring-0 p-1"
                />
             </div>
        </div>

        {/* Category Grid */}
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2">Catégorie</label>
            <div className="grid grid-cols-3 gap-2 max-h-[160px] overflow-y-auto no-scrollbar pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                            category === cat.name 
                            ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                            : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span className={`mb-1 ${category === cat.name ? 'text-blue-500' : 'text-slate-400'}`}>
                            {getCategoryIcon(cat.name)}
                        </span>
                        <span className="text-[10px] font-bold truncate w-full text-center">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Optional Note */}
        <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajouter une note..."
            className="w-full bg-transparent border-b border-slate-200 py-2 text-sm text-slate-600 placeholder-slate-400 focus:border-blue-500 focus:ring-0 transition-colors"
        />

        {/* Actions */}
        <button
          type="submit"
          disabled={!amount}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
              !amount ? 'bg-slate-300' : type === 'Revenu' ? 'bg-emerald-600' : 'bg-blue-600'
          }`}
        >
          {type === 'Revenu' ? <Plus size={24} /> : <ArrowRight size={24} />}
          <span>Confirmer {amount && `${amount}€`}</span>
        </button>
      </div>
    </form>
  );
};