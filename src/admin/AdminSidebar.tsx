import React from 'react';
import { 
  LayoutDashboard, Film, PlusCircle, FolderTree, 
  Database, ArrowLeft, RefreshCw, Sparkles, Shield
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'movies' | 'add-movie' | 'genres' | 'supabase';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  moviesCount: number;
  genresCount: number;
  onResetData: () => void;
  supabaseConnected: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onExitAdmin,
  moviesCount,
  genresCount,
  onResetData,
  supabaseConnected,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      subtitle: 'Statistika va hisobotlar',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'movies' as AdminTab,
      label: 'Kinolar',
      subtitle: 'Barcha filmlar bazasi',
      icon: Film,
      badge: moviesCount,
    },
    {
      id: 'add-movie' as AdminTab,
      label: 'Kino qo\'shish',
      subtitle: 'Yangi premyera kiritish',
      icon: PlusCircle,
      badge: '+',
    },
    {
      id: 'genres' as AdminTab,
      label: 'Janrlar',
      subtitle: 'Toifalar boshqaruvi',
      icon: FolderTree,
      badge: genresCount,
    },
    {
      id: 'supabase' as AdminTab,
      label: 'Supabase & SQL',
      subtitle: 'Ma\'lumotlar bazasi',
      icon: Database,
      badge: supabaseConnected ? 'Faol' : 'Mock',
      badgeColor: supabaseConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300',
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-[#0c0d10] border-r border-white/5 flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand & Admin Badge */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
            <Shield className="w-5 h-5 text-black font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white">KINOMAN</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-black uppercase">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Boshqaruv Tizimi</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          Asosiy Bo'limlar
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className={`text-[11px] ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge !== null && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg ${
                    item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Database Status & Footer Actions */}
      <div className="p-4 border-t border-white/5 space-y-2 bg-black/20">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-400 font-medium">Baza holati:</span>
          </div>
          <span className={`font-bold ${supabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
            {supabaseConnected ? 'Supabase SQL' : 'Mahalliy (Local)'}
          </span>
        </div>

        {/* Reset Sample Data Button */}
        <button
          onClick={onResetData}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          title="Barcha filmlarni dastlabki holatga qaytarish"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Namunaviy bazani tiklash
        </button>

        {/* Exit Admin Button */}
        <button
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all border border-white/10 hover:border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Saytga qaytish
        </button>
      </div>
    </aside>
  );
};

