'use client';

import { useActionState, useState } from 'react';
import { placeBidAction } from './actions';
import { LogIn, ArrowUpCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatMoneyString } from '@/lib/utils';

export default function BidClientCard({ plateId, currentPrice, isFinished, session }: { plateId: number, currentPrice: string, isFinished: boolean, session: any }) {
  const placeBidWithId = placeBidAction.bind(null, plateId);
  const [state, formAction, isPending] = useActionState(placeBidWithId, null);
  
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val);
  };

  if (!session) {
    return (
      <div className="glass-card rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center border-slate-800/50">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 border border-slate-800 text-gold-500 shadow-lg">
           <LogIn size={32} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Auksionda Ishtirok Eting</h3>
        <p className="text-slate-400 mb-10 max-w-sm leading-relaxed">
          Narx taklif qilish va ushbu eksklyuziv lotni yutib olish uchun tizimga kiring.
        </p>
        <Link href="/login" className="gold-button w-full sm:w-auto">
           Kirish / Ro'yxatdan o'tish
        </Link>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="glass-card rounded-[2.5rem] p-10 text-center flex flex-col items-center justify-center h-full min-h-[300px] border-slate-800/50 opacity-80">
        <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/20 text-rose-400">
           <ArrowUpCircle size={32} className="rotate-45" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Auksion Yakunlangan</h3>
        <p className="text-slate-500 mb-0 max-w-sm">Ushbu lot uchun kimoshuv savdosi o'z nihoyasiga yetdi.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden border-slate-800/50">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
      
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 bg-obsidian-light rounded-xl flex items-center justify-center border border-slate-800">
           <ArrowUpCircle size={20} className="text-gold-500" />
        </div>
        Narx Taklif Qilish
      </h3>
      
      <form action={formAction} className="space-y-8 relative z-10">
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-slate-500 ml-1">Sizning taklifingiz</label>
          <div className="relative group">
            <input 
              type="text" 
              inputMode="numeric"
              name="amount" 
              value={amount}
              onChange={handleAmountChange}
              placeholder="Masalan: 12 000 000"
              required 
              className="w-full pl-6 pr-20 py-5 text-3xl bg-obsidian border-2 border-slate-800 rounded-[1.5rem] text-gold-400 focus:outline-none focus:border-gold-500/50 focus:ring-4 focus:ring-gold-500/10 transition-all font-mono font-black placeholder:text-slate-800"
            />
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-600 font-black text-xl">
              UZS
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Formatlangan summa:</span>
             <span className="text-xl font-black text-slate-200 font-mono">
               {amount ? formatMoneyString(amount) : '0'} <span className="text-xs text-slate-500">UZS</span>
             </span>
          </div>
          
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter flex items-center gap-2 px-1">
             <div className="w-1 h-1 rounded-full bg-slate-700"></div>
             Minimal taklif: {formatMoneyString(parseInt(currentPrice) + 100000)} UZS dan yuqori
          </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-start gap-3 animate-fade-in-up">
            <AlertCircle size={18} className="shrink-0 mt-0.5" /> {state.error}
          </div>
        )}

        {state?.success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold flex items-start gap-3 animate-fade-in-up">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
               <span className="text-[10px]">✓</span> 
            </div>
            Taklifingiz muvaffaqiyatli qabul qilindi!
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending || !amount}
          className="gold-button w-full flex items-center justify-center gap-3 !py-5 text-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
        >
          {isPending ? (
            <span className="flex items-center gap-3">
              <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin"></span>
              Yuborilmoqda...
            </span>
          ) : (
            <>
              Taklifni tasdiqlash
              <ArrowUpCircle size={24} className="group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
