'use client';

import { useActionState } from 'react';
import { addPlate } from './actions';
import { Plus, Hash, Tag, Coins, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AddPlateForm() {
  const [state, formAction, isPending] = useActionState(addPlate, null);

  return (
    <form action={formAction} className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Hudud kodi</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-gold-500 transition-colors">
            <Hash size={16} />
          </div>
          <input 
            name="regionCode" 
            placeholder="01" 
            required 
            className="input-field w-full !pl-12 !py-4 bg-obsidian-light/50 border-2 border-slate-800 font-black font-mono tracking-widest" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Davlat Raqami</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-gold-500 transition-colors">
            <Tag size={16} />
          </div>
          <input 
            name="number" 
            placeholder="777 AAA" 
            required 
            className="input-field w-full !pl-12 !py-4 bg-obsidian-light/50 border-2 border-slate-800 font-black font-mono tracking-widest uppercase placeholder:normal-case" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Boshlang'ich Narx</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-gold-500 transition-colors">
            <Coins size={16} />
          </div>
          <input 
            type="number" 
            name="startingPrice" 
            placeholder="5 000 000" 
            required 
            min="1000" 
            className="input-field w-full !pl-12 !py-4 bg-obsidian-light/50 border-2 border-slate-800 font-black font-mono" 
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-700 font-black text-xs uppercase tracking-widest">
            UZS
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-shake">
          <AlertCircle size={18} />
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
          <CheckCircle2 size={18} />
          Yangi lot muvaffaqiyatli qo'shildi!
        </div>
      )}

      <button 
        type="submit" 
        disabled={isPending} 
        className="gold-button w-full !py-5 !rounded-2xl group disabled:opacity-50 disabled:grayscale"
      >
        {isPending ? (
          <span className="flex items-center gap-3 justify-center">
             <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin"></span>
             Saqlanmoqda...
          </span>
        ) : (
          <span className="flex justify-center items-center gap-2 group">
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> 
            Tizimga qo'shish
          </span>
        )}
      </button>
    </form>
  );
}
