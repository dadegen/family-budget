import React, { useMemo } from 'react';
import { Transaction, AccountType, Budget, IncomeConfig } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Trash2, TrendingDown, TrendingUp, CheckCircle2, Circle, CalendarDays, CheckSquare, Square, Wallet, ArrowRight } from 'lucide-react';
import { ACCOUNT_COLORS } from '../constants';

interface DashboardProps {
  account: AccountType;
  transactions: Transaction[];
  budgets: Budget[];
  incomes: IncomeConfig[]; 
  onDelete: (id: string) => void;
  onToggleVerified: (id: string) => void;
  onAddTransaction: (transaction: any) => void;
}

// Helper to format date groups
const formatDateGroup = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  account, 
  transactions, 
  budgets, 
  incomes, 
  onDelete, 
  onToggleVerified,
  onAddTransaction
}) => {
  
  const currentMonthDate = new Date();
  const currentMonth = currentMonthDate.getMonth();
  const currentYear = currentMonthDate.getFullYear();
  const monthName = currentMonthDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  const todayISO = currentMonthDate.toISOString().split('T')[0];

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return t.account === account && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [account, transactions, currentMonth, currentYear]);

  // Group transactions by Date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    const sorted = [...monthlyTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    sorted.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return groups;
  }, [monthlyTransactions]);

  const stats = useMemo(() => {
    const fixes = monthlyTransactions
      .filter(t => t.type === 'Fixe')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const variables = monthlyTransactions
      .filter(t => t.type === 'Variable')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const transactionIncome = monthlyTransactions
      .filter(t => t.type === 'Revenu')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const fixedMonthlyIncome = incomes
      .filter(i => i.account === account)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalIncome = transactionIncome + fixedMonthlyIncome;
    const totalExpenses = fixes + variables;
    
    return { fixes, variables, totalExpenses, totalIncome, balance: totalIncome - totalExpenses };
  }, [monthlyTransactions, incomes, account]);

  const categoryExpenses = useMemo(() => {
    const expenses = monthlyTransactions.filter(t => t.type !== 'Revenu');
    const grouped: Record<string, number> = {};
    expenses.forEach(t => {
      const cat = t.category;
      grouped[cat] = (grouped[cat] || 0) + t.amount;
    });
    
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Show top 6 categories
  }, [monthlyTransactions]);

  const budgetStats = useMemo(() => {
    const accountBudgets = budgets.filter(b => b.account === account);

    return accountBudgets.map(budget => {
      const matchingTransactions = monthlyTransactions.filter(t => 
        t.category === budget.name && t.type !== 'Revenu'
      );
      
      const spent = matchingTransactions.reduce((sum, t) => sum + t.amount, 0);
      const paidTransaction = budget.isFixed && matchingTransactions.length > 0 ? matchingTransactions[0] : null;

      return {
        ...budget,
        spent,
        remaining: budget.amount - spent,
        percent: Math.min((spent / budget.amount) * 100, 100),
        paidTransaction
      };
    });
  }, [account, monthlyTransactions, budgets]);

  const handleToggleFixedExpense = (e: React.MouseEvent, budget: typeof budgetStats[0]) => {
      e.stopPropagation();
      if (budget.paidTransaction) {
          const matches = monthlyTransactions.filter(t => t.category === budget.name && t.type === 'Fixe');
          matches.forEach(t => onDelete(t.id));
      } else {
          onAddTransaction({
              date: todayISO,
              account: account,
              type: 'Fixe',
              category: budget.name,
              amount: budget.amount,
              description: 'Charge Fixe Mensuelle',
              isVerified: true
          });
      }
  };

  // Card Styles based on account
  const getCardStyle = () => {
    switch (account) {
      case 'Emilie': return 'from-pink-500 to-rose-400 shadow-pink-200';
      case 'Cedric': return 'from-emerald-500 to-teal-400 shadow-emerald-200';
      default: return 'from-blue-600 to-indigo-500 shadow-blue-200';
    }
  };

  return (
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Month Header */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="bg-white/60 backdrop-blur px-3 py-1 rounded-full border border-white shadow-sm flex items-center gap-2">
           <CalendarDays size={14} className="text-slate-400" />
           <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{monthName}</span>
        </div>
      </div>

      {/* Main Wallet Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${getCardStyle()} bg-gradient-to-br transition-all duration-500`}>
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl"></div>
         <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black opacity-10 blur-2xl"></div>

         <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start">
               <div>
                 <p className="text-white/80 text-sm font-medium mb-1">Solde actuel</p>
                 <h2 className="text-4xl font-bold tracking-tight">{stats.balance > 0 ? '+' : ''}{stats.balance.toFixed(0)}€</h2>
               </div>
               <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                 <Wallet size={24} className="text-white" />
               </div>
            </div>

            <div className="flex gap-4 mt-6">
               <div className="bg-black/10 rounded-lg px-3 py-2 flex-1">
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-0.5">
                    <TrendingUp size={12} />
                    <span>Entrées</span>
                  </div>
                  <span className="font-semibold text-lg">{stats.totalIncome.toFixed(0)}€</span>
               </div>
               <div className="bg-black/10 rounded-lg px-3 py-2 flex-1">
                  <div className="flex items-center gap-1 text-white/70 text-xs mb-0.5">
                    <TrendingDown size={12} />
                    <span>Sorties</span>
                  </div>
                  <span className="font-semibold text-lg">{stats.totalExpenses.toFixed(0)}€</span>
               </div>
            </div>
         </div>
      </div>

      {/* Category Expenses Chart */}
      {categoryExpenses.length > 0 && (
         <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 ml-1">Répartition des dépenses</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryExpenses} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f8fafc" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={90} 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(value: number) => [`${value.toFixed(0)}€`, '']}
                    itemStyle={{ color: ACCOUNT_COLORS[account] || '#3b82f6', fontWeight: 'bold' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={ACCOUNT_COLORS[account] || '#3b82f6'} 
                    radius={[0, 6, 6, 0]} 
                    barSize={24}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      )}

      {/* Budgets Section */}
      {budgetStats.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 ml-1">Suivi Budgets</h3>
          <div className="grid grid-cols-1 gap-3">
            {budgetStats.map(b => (
              <div key={b.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-3 flex-1">
                   {/* Checkbox for Fixed */}
                   {b.isFixed ? (
                      <button 
                        onClick={(e) => handleToggleFixedExpense(e, b)}
                        className={`transition-all ${b.paidTransaction ? 'text-emerald-500' : 'text-slate-200'}`}
                      >
                         {b.paidTransaction ? <CheckSquare size={26} className="fill-emerald-50" /> : <Square size={26} />}
                      </button>
                   ) : (
                     // Circular Progress for Variable
                     <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="4"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={b.percent > 100 ? '#ef4444' : account === 'Emilie' ? '#ec4899' : account === 'Cedric' ? '#10b981' : '#3b82f6'}
                            strokeWidth="4"
                            strokeDasharray={`${b.percent}, 100`}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-slate-600">{Math.round(b.percent)}%</span>
                     </div>
                   )}
                   
                   <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{b.name}</span>
                      <span className="text-xs text-slate-400">
                        {b.isFixed ? (b.paidTransaction ? 'Payé' : 'À payer') : `${b.spent.toFixed(0)}€ / ${b.amount}€`}
                      </span>
                   </div>
                </div>
                
                <div className="text-right">
                    <span className={`block font-bold text-sm ${b.remaining < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                        {b.remaining.toFixed(0)}€
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions List Grouped */}
      <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 ml-1">Transactions</h3>
          
          {Object.keys(groupedTransactions).length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Wallet size={24} />
                </div>
                <p className="text-sm font-medium">Aucune dépense ce mois-ci</p>
             </div>
          ) : (
            Object.keys(groupedTransactions).map(date => (
              <div key={date} className="animate-in slide-in-from-bottom-2 duration-500">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2 sticky top-0 bg-slate-50/90 py-1 backdrop-blur-sm z-10 w-fit px-2 rounded-lg">
                    {formatDateGroup(date)}
                 </h4>
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                    {groupedTransactions[date].map(t => (
                       <div key={t.id} className={`p-4 flex items-center justify-between active:bg-slate-50 transition-colors ${t.isVerified ? 'bg-slate-50/50' : ''}`}>
                          <div className="flex items-center gap-3">
                             <button 
                               onClick={() => onToggleVerified(t.id)}
                               className={`transition-all ${t.isVerified ? 'text-green-500 scale-100' : 'text-slate-200 hover:text-slate-300 scale-90'}`}
                             >
                               {t.isVerified ? <CheckCircle2 size={22} fill="#ecfdf5" /> : <Circle size={22} />}
                             </button>
                             <div className="flex flex-col">
                                <span className={`font-bold text-sm text-slate-700 ${t.isVerified ? 'line-through opacity-50' : ''}`}>
                                    {t.category}
                                </span>
                                {t.description && <span className="text-xs text-slate-400">{t.description}</span>}
                             </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className={`font-bold text-sm ${
                                t.type === 'Revenu' 
                                    ? 'text-emerald-600' 
                                    : 'text-slate-900'
                             } ${t.isVerified ? 'opacity-40' : ''}`}>
                                {t.type === 'Revenu' ? '+' : '-'}{t.amount.toFixed(2)}€
                             </span>
                             {/* Delete hidden by default, visible on logic if needed, or swipe */}
                             <button onClick={() => onDelete(t.id)} className="text-slate-200 hover:text-red-400">
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            ))
          )}
      </div>
    </div>
  );
};