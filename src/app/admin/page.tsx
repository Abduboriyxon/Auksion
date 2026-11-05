import db from '@/lib/db';
import AddPlateForm from './AddPlateForm';
import { Plus, Car, Trash2, StopCircle, PlayCircle, Edit, Sparkles, TrendingUp, History, Users } from 'lucide-react';
import { finishPlate, deletePlate, reactivatePlate } from './actions';
import { formatMoneyString } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboard() {
  const plates = db.prepare('SELECT * FROM plates ORDER BY regionCode ASC, number ASC').all() as any[];
  
  const platesWithBids = plates.map(plate => {
    const bids = db.prepare(`
      SELECT bids.amount, bids.createdAt, users.name as userName 
      FROM bids 
      JOIN users ON bids.userId = users.id 
      WHERE plateId = ? 
      ORDER BY amount DESC
    `).all(plate.id) as any[];
    return { ...plate, bids };
  });

  // Calculate some stats
  const totalAuctions = plates.length;
  const activeAuctions = plates.filter(p => p.status === 'active').length;
  const totalBids = platesWithBids.reduce((acc, p) => acc + p.bids.length, 0);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Boshqaruv <span className="gold-gradient-text uppercase">Dashboard</span></h1>
           <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">VIP Auksion Tizimini Boshqarish</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 shrink-0">
           <div className="glass-card flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-slate-800/40">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Lotlar</span>
              <span className="text-xl font-black text-slate-200">{totalAuctions}</span>
           </div>
           <div className="glass-card flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-indigo-500/20 bg-indigo-500/5">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Faol</span>
              <span className="text-xl font-black text-indigo-400">{activeAuctions}</span>
           </div>
           <div className="glass-card flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-gold-500/20 bg-gold-500/5">
              <span className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1">Takliflar</span>
              <span className="text-xl font-black text-gold-400">{totalBids}</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left: Add New Form */}
        <div className="xl:col-span-4 glass-card-gold rounded-[2.5rem] p-8 md:p-10 border-gold-500/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl pointer-events-none group-hover:bg-gold-500/10 transition-all duration-700"></div>
          
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20">
               <Plus className="text-gold-500" />
            </div>
            Yangi Lot
          </h2>
          <AddPlateForm />
        </div>

        {/* Right: Table List */}
        <div className="xl:col-span-8 glass-card border-slate-800/40 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 pb-0 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-inner">
                 <History className="text-slate-500" />
              </div>
              Barcha Lotlar
            </h2>
            <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-gold-500 transition-all flex items-center gap-2">
               Yangilash <TrendingUp size={12} />
            </Link>
          </div>

          <div className="p-8 pt-6">
            <div className="overflow-x-auto -mx-8 px-8 custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="text-slate-500 font-black uppercase tracking-[0.15em] text-[10px] border-b border-slate-800/60">
                    <th className="pb-6 px-4">Viloyat / Raqam</th>
                    <th className="pb-6 px-4">Narxlar (UZS)</th>
                    <th className="pb-6 px-4">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {platesWithBids.map((plate) => (
                    <tr key={plate.id} className="hover:bg-slate-900/40 transition-all group">
                      <td className="py-8 px-4">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white flex flex-col items-center justify-center border-2 border-slate-200 shadow-xl group-hover:scale-110 transition-transform">
                            <span className="text-[8px] font-black text-slate-400 leading-none mb-0.5">UZ</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{plate.regionCode}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-2xl font-black tracking-widest text-white group-hover:gold-gradient-text">
                              {plate.number}
                            </span>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                               Lot #{plate.id} • {plate.status}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-4">
                        <div className="space-y-1">
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Boshlang'ich: {formatMoneyString(plate.startingPrice)}</div>
                          <div className="text-lg font-black text-emerald-400 font-mono tracking-tight">{formatMoneyString(plate.currentPrice)}</div>
                          <div className="flex items-center gap-2">
                             <div className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400">
                               {plate.bids.length} taklif
                             </div>
                             {plate.bids.length > 0 && (
                               <span className="text-[9px] font-bold text-slate-600 truncate max-w-[120px]">
                                 Oxirgi: {plate.bids[0].userName}
                               </span>
                             )}
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {plate.status === 'active' ? (
                            <form action={async () => { 'use server'; await finishPlate(plate.id); }}>
                              <button className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg" title="To'xtatish">
                                <StopCircle size={18}/>
                              </button>
                            </form>
                          ) : (
                            <form action={async () => { 'use server'; await reactivatePlate(plate.id); }}>
                              <button className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg" title="Davom ettirish">
                                <PlayCircle size={18}/>
                              </button>
                            </form>
                          )}
                          <Link href={`/admin/edit/${plate.id}`} className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-lg" title="Tahrirlash">
                             <Edit size={18}/>
                          </Link>
                          <form action={async () => { 'use server'; await deletePlate(plate.id); }}>
                             <button className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-lg" title="O'chirish">
                                <Trash2 size={18}/>
                             </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {platesWithBids.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-40">
                           <Car size={48} className="text-slate-600" />
                           <span className="text-sm font-black uppercase tracking-widest text-slate-500">Lotlar mavjud emas</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
