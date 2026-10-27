import React from 'react';
import { DashboardStats, Movie } from '../types';
import { 
  Film, Eye, Star, FolderTree, Plus, Sparkles, TrendingUp, 
  ArrowRight, Edit3, Trash2, Database, ShieldCheck 
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardProps {
  stats: DashboardStats;
  setActiveTab: (tab: AdminTab) => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  setActiveTab,
  onEditMovie,
  onDeleteMovie,
  onSelectMovie,
}) => {
  const statCards = [
    {
      title: 'Jami Kinolar',
      value: stats.totalMovies,
      desc: 'Bazadagi faol filmlar soni',
      icon: Film,
      color: 'from-rose-600 to-red-500',
      badge: `${stats.featuredCount} ta premyera`,
    },
    {
      title: 'Jami Ko\'rishlar',
      value: stats.totalViews.toLocaleString(),
      desc: 'Foydalanuvchilar tomoshasi',
      icon: Eye,
      color: 'from-blue-600 to-indigo-500',
      badge: '+12% bu oy',
    },
    {
      title: 'O\'rtacha Reyting',
      value: `${stats.averageRating} / 10`,
      desc: 'IMDb va foydalanuvchilar bahosi',
      icon: Star,
      color: 'from-amber-500 to-yellow-400',
      badge: 'Yuqori sifat',
    },
    {
      title: 'Janrlar & Toifalar',
      value: stats.totalGenres,
      desc: 'Mavjud kino toifalari',
      icon: FolderTree,
      color: 'from-emerald-600 to-teal-500',
      badge: 'Barcha janrlar',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-red-950/20 to-black border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Admin Boshqaruv Markazi
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Tizim faol
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">Xush kelibsiz, Admin! 👋</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Kino portalingizni to'liq nazorat qiling: yangi premyeralar qo'shing, ma'lumotlarni tahrirlang yoki Supabase PostgreSQL bazasi bilan sinxronlashtiring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('add-movie')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            Yangi kino qo'shish
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-sm border border-white/10 hover:border-white/20 transition-all"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            Supabase SQL
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-[#0f1117] border border-white/5 hover:border-white/10 transition-all hover:shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                  {card.badge}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{card.value}</h3>
              <p className="text-sm font-semibold text-slate-300 mt-1">{card.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Top Genres and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Genre Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-rose-500" />
                Janrlar bo'yicha filmlar taqsimoti
              </h3>
              <p className="text-xs text-slate-400">Har bir toifadagi filmlar soni va ulushi</p>
            </div>
            <button
              onClick={() => setActiveTab('genres')}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              Barcha janrlar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {stats.topGenres.slice(0, 5).map((genre) => {
              const percentage = stats.totalMovies > 0
                ? Math.round((genre.count / stats.totalMovies) * 100)
                : 0;

              return (
                <div key={genre.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{genre.name}</span>
                    <span className="text-slate-400">{genre.count} ta film ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick System Status Card */}
        <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Tizim va Xavfsizlik
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Admin panel 100% himoyalangan, CRUD amallari real vaqtda yangilanadi.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">SQL DDL Sxema:</span>
              <span className="font-bold text-emerald-400">Tayyor (v1.0)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Offline Mock Rejim:</span>
              <span className="font-bold text-blue-400">Faol (LocalStorage)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-400">Frontend Dvigateli:</span>
              <span className="font-bold text-slate-200">React 19 + Vite</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('movies')}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            Kinolar Jadvaliga O'tish
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Movies Table */}
      <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              So'nggi Qo'shilgan Filmlar
            </h3>
            <p className="text-xs text-slate-400">Eng oxirgi qo'shilgan yoki yangilangan filmlar ro'yxati</p>
          </div>
          <button
            onClick={() => setActiveTab('movies')}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
          >
            Barchasini ko'rish ({stats.totalMovies}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Film</th>
                <th className="py-3 px-4">Yili & Sifati</th>
                <th className="py-3 px-4">Janrlar</th>
                <th className="py-3 px-4">IMDb</th>
                <th className="py-3 px-4">Ko'rishlar</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => onSelectMovie(movie)}
                    >
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-9 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-rose-400 transition-colors">
                          {movie.title}
                        </div>
                        <div className="text-[11px] text-slate-500">{movie.director}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{movie.release_year}</div>
                    <span className="text-[10px] text-amber-400 font-bold">{movie.quality}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((g) => (
                        <span key={g} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-bold text-emerald-400">
                      <Star className="w-3.5 h-3.5 fill-emerald-400" />
                      {movie.rating.toFixed(1)}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-300 font-medium">{(movie.views_count || 0).toLocaleString()}</span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditMovie(movie)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteMovie(movie.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

