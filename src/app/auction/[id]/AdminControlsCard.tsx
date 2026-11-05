'use client';
import { useTransition } from 'react';
import { deletePlate, finishPlate, toggleStatus, addTime } from '@/app/admin/actions';
import { StopCircle, Trash2, Clock, PlayCircle, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminControlsCard({ plate }: { plate: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAction = (actionFn: () => Promise<any>) => {
    startTransition(async () => {
       const res = await actionFn();
       if (res?.success) {
           router.refresh();
       } else if (res?.error) {
           alert(res.error);
       }
    });
  }

  return (
    <div className="glass-card rounded-[2.5rem] p-8 md:p-10 border-gold-500/20 shadow-[0_0_40px_rgba(212,175,55,0.05)] relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20">
          <Settings size={20} className="text-gold-500" />
        </div>
        <h3 className="text-xl font-bold text-white">Auksion Boshqaruvi</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
           onClick={() => handleAction(() => finishPlate(plate.id))}
           disabled={plate.status === 'finished' || isPending}
           className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-30 disabled:grayscale transition-all text-left group"
        >
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <StopCircle size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">G'olibni tasdiqlash</span>
        </button>
        
        <button 
           onClick={() => handleAction(() => toggleStatus(plate.id))}
           disabled={plate.status === 'finished' || isPending}
           className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 disabled:opacity-30 disabled:grayscale transition-all text-left group"
        >
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            {plate.status === 'active' ? <StopCircle size={18} /> : <PlayCircle size={18} />}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">
            {plate.status === 'active' ? 'Pauza qilish' : 'Davom ettirish'}
          </span>
        </button>

        <button 
           onClick={() => {
              const minutes = prompt("Necha daqiqa qo'shmoqchisiz?", '60');
              if (minutes && !isNaN(Number(minutes))) {
                 handleAction(() => addTime(plate.id, parseInt(minutes)));
              }
           }}
           disabled={plate.status === 'finished' || isPending}
           className="flex items-center gap-3 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 disabled:opacity-30 disabled:grayscale transition-all text-left group"
        >
          <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Vaqtni uzaytirish</span>
        </button>

        <button 
           onClick={() => {
             if (confirm("Ushbu auksion butunlay o'chiriladi. Qaroringiz qat'iymi?")) {
               handleAction(async () => {
                 await deletePlate(plate.id);
                 router.push('/');
                 return { success: true };
               });
             }
           }}
           disabled={isPending}
           className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 disabled:opacity-30 disabled:grayscale transition-all text-left group"
        >
          <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trash2 size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Sotuvdan olish</span>
        </button>
      </div>
    </div>
  );
}
