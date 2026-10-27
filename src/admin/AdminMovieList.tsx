import React, { useState, useMemo } from 'react';
import { Movie } from '../types';
import { 
  Search, Plus, Filter, Star, Edit3, Trash2, Eye, 
  ArrowUpDown, CheckCircle, AlertTriangle, X 
} from 'lucide-react';

interface AdminMovieListProps {
  movies: Movie[];
  genres: string[];
  onAddNew: () => void;
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onPreview: (movie: Movie) => void;
}

export const AdminMovieList: React.FC<AdminMovieListProps> = ({
  movies,
  genres,
  onAddNew,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'views'>('newest');
  const [deleteCandidate, setDeleteCandidate] = useState<Movie | null>(null);

  // Filtered and sorted movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        const matchesSearch =
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (movie.original_title && movie.original_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.cast.some((actor) => actor.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesGenre =
          selectedGenre === 'all' || movie.genres.includes(selectedGenre);

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'views') return (b.views_count || 0) - (a.views_count || 0);
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const confirmDelete = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Kinolar Boshqaruvi</h2>
          <p className="text-xs text-slate-400">
            Jami {movies.length} ta film mavjud (Filtrlangan: {filteredMovies.length})
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi kino qo'shish
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0f1117] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nomi, rejissyor yoki aktyor..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Genre select */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="all">Barcha Janrlar</option>
              {genres.map((g) => (
                <option key={g} value={g} className="bg-[#0f1117]">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By select */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'views')}
              className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="newest" className="bg-[#0f1117]">Eng yangilar</option>
              <option value="rating" className="bg-[#0f1117]">Eng yuqori reyting</option>
              <option value="views" className="bg-[#0f1117]">Eng ko'p ko'rilgan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Table */}
      <div className="rounded-2xl bg-[#0f1117] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Poster & Nomi</th>
                <th className="py-3.5 px-4">Yili & Sifati</th>
                <th className="py-3.5 px-4">Janrlar</th>
                <th className="py-3.5 px-4">IMDb</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Ko'rishlar</th>
                <th className="py-3.5 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Bunday parametrlar bo'yicha film topilmadi.
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Poster and Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="max-w-[200px] sm:max-w-[260px]">
                          <div className="font-bold text-white truncate text-sm">
                            {movie.title}
                          </div>
                          {movie.original_title && (
                            <div className="text-[11px] text-slate-400 italic truncate">
                              {movie.original_title}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Rejissyor: {movie.director || 'Noma\'lum'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Year & Quality */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{movie.release_year}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                          {movie.quality}
                        </span>
                        <span className="text-[10px] text-slate-400">{movie.age_rating}</span>
                      </div>
                    </td>

                    {/* Genres */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {movie.genres.map((g) => (
                          <span key={g} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-emerald-400">
                        <Star className="w-3.5 h-3.5 fill-emerald-400" />
                        {movie.rating.toFixed(1)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {movie.is_featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Premyera
                          </span>
                        )}
                        {movie.is_popular && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            Top
                          </span>
                        )}
                        {!movie.is_featured && !movie.is_popular && (
                          <span className="text-[11px] text-slate-500">Oddiy</span>
                        )}
                      </div>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">
                        {(movie.views_count || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreview(movie)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          title="Oldindan ko'rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(movie)}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(movie)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0f1117] border border-rose-500/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Filmni o'chirishni tasdiqlaysizmi?</h3>
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-rose-400">"{deleteCandidate.title}"</span> filmi ma'lumotlar bazasidan butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                Ha, o'chirilsin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

