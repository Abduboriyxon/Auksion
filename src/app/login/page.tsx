'use client';

import { useActionState, useState } from 'react';
import { loginAction } from './actions';
import { Car, Lock, User, ArrowRight, ShieldCheck, ChevronLeft, Gavel, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [mode, setMode] = useState<'selection' | 'user' | 'admin'>('selection');

  return (
    <div className="min-h-screen bg-obsidian text-slate-50 flex flex-col items-center justify-center p-4 selection:bg-gold-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 animate-fade-in-up">
        {mode === 'selection' ? (
          <div className="flex flex-col items-center">
            <div className="mb-12 text-center flex flex-col items-center">
              <Link href="/" className="mb-8 group">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.2)] group-hover:scale-110 transition-transform duration-500">
                  <Gavel size={40} className="text-obsidian" />
                </div>
              </Link>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                VIP <span className="gold-gradient-text uppercase">Auksion</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-sm">Tizimga kirish uchun turini tanlang</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <button 
                onClick={() => setMode('user')} 
                className="group glass-card border-slate-800/40 p-12 rounded-[2.5rem] hover:border-gold-500/30 hover:bg-obsidian-light/60 transition-all duration-500 flex flex-col items-center text-center gap-8 shadow-2xl hover:-translate-y-2"
              >
                <div className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 group-hover:scale-110 group-hover:bg-gold-500/20 transition-all duration-500 shadow-inner">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Ishtirokchi</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Auksionlarda qatnashish va o'z takliflaringizni kiritish uchun
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 group-hover:bg-gold-500 group-hover:text-obsidian transition-all duration-500">
                  <ArrowRight size={20} />
                </div>
              </button>
              
              <button 
                onClick={() => setMode('admin')} 
                className="group glass-card border-slate-800/40 p-12 rounded-[2.5rem] hover:border-indigo-500/30 hover:bg-obsidian-light/60 transition-all duration-500 flex flex-col items-center text-center gap-8 shadow-2xl hover:-translate-y-2"
              >
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-inner">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Administrator</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Tizimni to'liq boshqarish va auksionlarni tashkil etish uchun
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  <Lock size={20} />
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto relative h-full">
            <button 
              onClick={() => setMode('selection')} 
              className="absolute -top-16 left-0 text-slate-500 hover:text-gold-400 flex items-center gap-2 transition-all font-bold group uppercase tracking-widest text-xs"
            >
              <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center group-hover:border-gold-500/30 group-hover:bg-gold-500/5">
                <ChevronLeft size={16} />
              </div>
              Ortga
            </button>

            <div className="glass-card-gold rounded-[3rem] p-10 md:p-12 shadow-2xl border-gold-500/20">
              <div className="mb-10 text-center flex flex-col items-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${mode === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-gold-500/10 text-gold-500 border border-gold-500/20'}`}>
                  {mode === 'admin' ? <ShieldCheck size={36} /> : <User size={36} />}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                  <Sparkles size={12} className="text-gold-500" /> {mode === 'admin' ? 'Xavfsiz Kirish' : 'Ro\'yxatdan o\'tish'}
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {mode === 'admin' ? "Admin Panel" : "Ismingizni kiritish"}
                </h2>
              </div>

              <form action={formAction} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                    {mode === 'admin' ? 'Login' : 'Ismingiz'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-gold-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      defaultValue={mode === 'admin' ? "admin" : ""}
                      placeholder={mode === 'admin' ? "admin" : "Murodjon"}
                      required
                      className="input-field w-full !pl-12 bg-obsidian border-2 border-slate-800 font-bold"
                    />
                  </div>
                </div>

                {mode === 'admin' && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Kalit so'z</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-400 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        defaultValue="1234"
                        placeholder="••••••••"
                        required
                        className="input-field w-full !pl-12 bg-obsidian border-2 border-slate-800 font-bold focus:ring-indigo-500/20 focus:border-indigo-500/50"
                      />
                    </div>
                  </div>
                )}

                {state?.error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
                    <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                       <span>!</span>
                    </div>
                    {state.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className={`gold-button w-full !py-4 text-lg !rounded-2xl group disabled:opacity-50 ${mode === 'admin' ? 'from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 !text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]' : ''}`}
                >
                  {isPending ? (
                    <span className="flex items-center gap-3 justify-center">
                       <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                       Kirish...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      Kirish <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-slate-600 text-[10px] uppercase tracking-widest font-black opacity-30 relative z-10">
        &copy; 2026 VIP AUKSION | Secure Platform
      </div>
    </div>
  );
}
