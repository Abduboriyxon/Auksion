import { getSession, logout } from '@/lib/auth';
import db from '@/lib/db';
import Link from 'next/link';
import { formatMoneyString } from '@/lib/utils';
import { Gavel, Clock, LogIn, LogOut, ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';

export default async function HomePage() {
  const session = await getSession();
  
  const now = Date.now();
  db.prepare('UPDATE plates SET status = ? WHERE endTime < ? AND status = ?').run('finished', now, 'active');
  
  const allPlates = db.prepare('SELECT * FROM plates ORDER BY status ASC, endTime ASC').all() as any[];

  const platesWithWinners = allPlates.map(plate => {
    let winner = null;
    if (plate.status === 'finished') {
       winner = db.prepare(`SELECT users.name as userName, bids.amount FROM bids JOIN users ON bids.userId = users.id WHERE plateId = ? ORDER BY amount DESC LIMIT 1`).get(plate.id) as any;
    }
    return { ...plate, winner };
  });

  return (
    <div className="min-h-screen bg-obsidian text-slate-50 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Gavel size={20} className="text-obsidian" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gold-200 to-gold-500 bg-clip-text text-transparent">VIP AUKSION</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">Exotic Plates</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-200">{session.name}</span>
                  {session.role === 'admin' && (
                    <Link href="/admin" className="text-[10px] uppercase tracking-wider text-gold-500 font-bold hover:text-gold-400 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                </div>
                <form action={async () => { 'use server'; await logout(); }}>
                  <button className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all">
                    <LogOut size={18} />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="px-6 py-2 bg-slate-900 border border-slate-700 hover:border-gold-500/50 text-slate-200 font-medium rounded-full transition-all text-sm flex items-center gap-2 group">
                <LogIn size={16} className="text-gold-500 group-hover:translate-x-0.5 transition-transform" /> Kirish
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles size={14} /> Eng sara raqamlar markazi
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Sizning <span className="gold-gradient-text">Obro'yingiz</span> <br /> 
            Brendingizda Aks Etadi
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Eksklyuziv avtomobil raqamlari auksioni. O'zbekistondagi eng nufuzli va ishonchli platforma.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="#auctions" className="gold-button w-full sm:w-auto text-center">
               Auksionlarni ko'rish
             </a>
             <div className="px-6 py-3 rounded-full border border-slate-800 text-slate-300 font-medium flex items-center gap-2">
               <TrendingUp size={18} className="text-emerald-500" /> 100+ Ochiq auksionlar
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="auctions" className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-white">Faol Auksionlar</h3>
            <p className="text-slate-500 font-medium">Hozirda sotuvda mavjud bo'lgan eksklyuziv raqamlar</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">{platesWithWinners.length} ta lot mavjud</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {platesWithWinners.map((plate, index) => (
            <Link 
              href={`/auction/${plate.id}`} 
              key={plate.id} 
              className="group relative flex flex-col glass-card border-slate-800/40 hover:border-gold-500/40 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/5 blur-[60px] rounded-full group-hover:bg-gold-500/10 transition-all duration-500"></div>
              
              <div className="p-8 relative z-10 space-y-8 flex-1 flex flex-col">
                {/* Plate Badge */}
                <div className="flex items-center justify-between">
                   <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                     Lot #{plate.id}
                   </div>
                   {plate.status === 'active' ? (
                     <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                       <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                       Active
                     </div>
                   ) : (
                    <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      Finished
                    </div>
                   )}
                </div>

                {/* Plate Design */}
                <div className="relative py-4">
                  <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 group-hover:bg-white/10 transition-colors duration-500">
                    <div className="w-14 h-14 rounded-xl bg-obsidian flex flex-col items-center justify-center border border-slate-800 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-500 leading-none mb-0.5">UZ</span>
                      <span className="text-xl font-bold text-white leading-none">{plate.regionCode}</span>
                    </div>
                    <div className="flex-1 text-center">
                       <span className="text-4xl md:text-5xl font-black tracking-[0.1em] text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-500 inline-block">
                         {plate.number}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{plate.status === 'finished' ? 'Yakuniy narx' : 'Hozirgi narx'}</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-bold text-white tracking-tight">{formatMoneyString(plate.currentPrice)}</span>
                       <span className="text-sm font-bold text-slate-500">UZS</span>
                    </div>
                  </div>

                  {plate.status === 'finished' && plate.winner && (
                    <div className="flex items-center gap-2 py-2 px-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <ShieldCheck size={14} className="text-gold-500" />
                      </div>
                      <span className="text-xs text-slate-400">G'olib: <span className="text-slate-200 font-bold">{plate.winner.userName}</span></span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} className={plate.status === 'active' ? "text-gold-500 animate-pulse" : ""} />
                    <span className="text-xs font-bold font-mono tracking-wider">
                      <CountdownTimer endTime={plate.endTime} isFinished={plate.status === 'finished'} />
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-gold-500 group-hover:text-obsidian transition-all duration-300">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {platesWithWinners.length === 0 && (
            <div className="col-span-full py-32 text-center rounded-[3rem] border border-dashed border-slate-800 bg-slate-900/20">
              <div className="w-20 h-20 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800">
                 <Gavel size={32} className="text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400">Hozircha auksionlar mavjud emas</h3>
              <p className="text-slate-600 mt-2 max-w-sm mx-auto">Tez orada eng sara avtomobil raqamlari sotuvga chiqariladi. Bizni kuzatishda davom eting.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-obsidian border-t border-slate-900 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <Gavel size={16} className="text-gold-500" />
             </div>
             <span className="font-bold tracking-tight text-slate-300">VIP AUKSION</span>
           </div>
           <p className="text-slate-600 text-sm max-w-md text-center">
             Premium avtoraqamlar sotuvi bo'yicha eng yirik va xavfsiz maydon. 
             Barcha auksionlar rasmiy qoidalar asosida o'tkaziladi.
           </p>
           <div className="text-slate-700 text-xs font-mono">
             &copy; 2026 VIP AUKSION. Barcha huquqlar himoyalangan.
           </div>
        </div>
      </footer>
    </div>
  );
}
