import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, Crown, Gavel, LayoutDashboard, Globe } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-80 bg-obsidian border-b md:border-b-0 md:border-r border-slate-900 md:h-screen sticky top-0 flex flex-col p-8 shrink-0 z-50">
        <div className="mb-12 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-500">
            <Crown size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white uppercase">Admin <span className="text-indigo-400">Panel</span></h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Vip Auksion</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3 mb-12">
          <Link href="/admin" className="flex items-center gap-4 px-5 py-4 rounded-[1.25rem] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold transition-all shadow-xl">
            <LayoutDashboard size={20} />
            Bosh sahifa
          </Link>
          <Link href="/" className="flex items-center gap-4 px-5 py-4 rounded-[1.25rem] hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-500 hover:text-slate-300 font-bold transition-all">
            <Globe size={20} />
            Saytga o'tish
          </Link>
        </nav>

        <div className="pt-8 border-t border-slate-900">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
               {session.name.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-200 truncate">{session.name}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Administrator</div>
             </div>
          </div>
          <form action={async () => {
            'use server';
            await logout();
            redirect('/login');
          }}>
            <button className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all font-bold group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              Chiqish
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
           {children}
        </div>
      </main>
    </div>
  );
}
