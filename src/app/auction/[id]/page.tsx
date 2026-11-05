import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Clock, History, AlertCircle, ChevronLeft, Gavel, Sparkles } from 'lucide-react';
import Link from 'next/link';
import BidClientCard from './BidClientCard';
import AdminControlsCard from './AdminControlsCard';
import { formatMoneyString } from '@/lib/utils';
import CountdownTimer from '@/components/CountdownTimer';

export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plateId = parseInt(resolvedParams.id, 10);
  if (isNaN(plateId)) notFound();

  const plate = db.prepare('SELECT * FROM plates WHERE id = ?').get(plateId) as any;
  if (!plate) notFound();

  const session = await getSession();

  // Update status if ended
  const now = Date.now();
  if (plate.status === 'active' && now > plate.endTime) {
    db.prepare('UPDATE plates SET status = ? WHERE id = ?').run('finished', plateId);
    plate.status = 'finished';
  }

  const bids = db.prepare(`
    SELECT bids.*, users.name as userName 
    FROM bids 
    JOIN users ON bids.userId = users.id 
    WHERE plateId = ? 
    ORDER BY amount DESC
  `).all(plateId) as any[];

  const isFinished = plate.status === 'finished';

  return (
    <div className="min-h-screen bg-obsidian text-slate-50 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-gold-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-400 font-medium mb-10 transition-all group">
           <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center group-hover:border-gold-500/30 group-hover:bg-gold-500/5 transition-all">
             <ChevronLeft size={18} />
           </div>
           Barcha auksionlar
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Plate & Bidding */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            <div className="glass-card-gold rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 blur-3xl"></div>
                
                <div className="flex flex-col items-center text-center space-y-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500">
                    <Sparkles size={12} /> Premium Lot #{plate.id}
                  </div>

                  {/* Plate Display */}
                  <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-4 border-slate-200 relative">
                    <div className="absolute inset-2 border border-slate-100 rounded-2xl pointer-events-none"></div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="flex flex-col items-center justify-center border-r-2 border-slate-200 pr-6 gap-1">
                        <div className="w-8 h-5 relative">
                           <div className="absolute inset-0 bg-blue-600 rounded-[2px] overflow-hidden flex flex-col items-center justify-center">
                              <div className="w-full h-1/3 bg-blue-700"></div>
                              <div className="w-full h-1/3 bg-blue-600"></div>
                              <div className="w-full h-1/3 bg-blue-500"></div>
                           </div>
                        </div>
                        <span className="text-sm font-black text-slate-800 leading-none">{plate.regionCode}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">UZB</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-5xl md:text-7xl font-black tracking-[0.15em] text-slate-900 uppercase">
                          {plate.number}
                        </span>
                      </div>
                    </div>
                    {/* Security Hologram Effect */}
                    <div className="absolute bottom-4 right-8 w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg opacity-50 flex items-center justify-center">
                       <Gavel size={16} className="text-slate-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
                     <div className="bg-obsidian/40 backdrop-blur-md rounded-[2rem] p-6 border border-slate-800/50 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                          {isFinished ? 'Yakuniy narx' : 'Hozirgi yetakchi taklif'}
                        </span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-bold gold-gradient-text tracking-tight">
                             {formatMoneyString(plate.currentPrice)}
                           </span>
                           <span className="text-sm font-bold text-slate-500">UZS</span>
                        </div>
                     </div>

                     <div className={`rounded-[2rem] p-6 text-left border backdrop-blur-md ${isFinished ? 'bg-rose-500/5 border-rose-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                          {isFinished ? 'Auksion holati' : 'Vaqt qoldi'}
                        </span>
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFinished ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                             <Clock size={16} className={!isFinished ? "animate-pulse" : ""} />
                           </div>
                           <div className="text-xl font-bold font-mono tracking-wider">
                              <CountdownTimer endTime={plate.endTime} isFinished={isFinished} />
                           </div>
                        </div>
                        {!isFinished && (
                          <div className="text-[10px] text-slate-500 mt-2 font-medium italic opacity-60">
                            Yakunlanish: {new Date(plate.endTime).toLocaleString('uz-UZ')}
                          </div>
                        )}
                     </div>
                  </div>
                </div>
            </div>

            {session?.role === 'admin' ? (
              <AdminControlsCard plate={plate} />
            ) : (
              <BidClientCard plateId={plateId} currentPrice={plate.currentPrice} isFinished={isFinished} session={session} />
            )}
          </div>

          {/* Right Column: Bidding History */}
          <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card rounded-[3rem] p-8 md:p-10 flex flex-col h-full max-h-[800px] border-slate-800/40">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-obsidian-light rounded-xl flex items-center justify-center border border-slate-800 shadow-md">
                    <History size={20} className="text-gold-500" />
                  </div>
                  Takliflar Tarixi
                </h3>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-700/50">
                  {bids.length} ta taklif
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                 {bids.map((bid, i) => (
                   <div 
                    key={bid.id} 
                    className={`relative p-5 rounded-2xl border transition-all duration-300 group ${i === 0 ? 'bg-gold-500/5 border-gold-500/20' : 'bg-slate-900/30 border-slate-800 group-hover:border-slate-700'}`}
                   >
                      {i === 0 && (
                        <div className="absolute -top-2.5 -right-2.5 px-3 py-1 bg-gold-500 text-obsidian text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg rotate-12">
                          Yetakchi
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-gold-500 text-obsidian shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                             {i + 1}
                          </div>
                          <div>
                            <div className="text-slate-100 font-bold text-sm">{bid.userName}</div>
                            <div className="text-slate-500 text-[10px] font-medium mt-0.5">{new Date(bid.createdAt).toLocaleString('uz-UZ')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className={`text-lg font-bold font-mono tracking-tight ${i === 0 ? 'text-gold-400' : 'text-slate-300'}`}>
                             {formatMoneyString(bid.amount)}
                           </div>
                           <div className="text-[10px] text-slate-500 font-bold ml-1 italic opacity-60 uppercase tracking-tighter">UZS</div>
                        </div>
                      </div>
                   </div>
                 ))}
                 
                 {bids.length === 0 && (
                   <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-50">
                     <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                        <AlertCircle size={32} className="text-slate-600" />
                     </div>
                     <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hali takliflar yo'q</div>
                     <div className="text-slate-600 text-sm mt-2 max-w-[200px] leading-relaxed">
                       Siz birinchi bo'lib taklif kiritishingiz mumkin!
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
