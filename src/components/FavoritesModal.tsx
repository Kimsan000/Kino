import React from 'react';
import { Movie } from '../types';
import { X, Bookmark, Trash2, Play } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Movie[];
  onRemove: (id: string) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemove,
  onSelectMovie,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-2xl bg-[#0e0f12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-500">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Sevimlilar Ro'yxati</h3>
              <p className="text-xs text-slate-400">Jami {favorites.length} ta film saqlangan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                <Bookmark className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-300">Hozircha hech narsa saqlanmagan</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Sizga yoqqan filmlarni xatcho'p (bookmark) belgisi orqali bu yerga qo'shishingiz mumkin.
              </p>
            </div>
          ) : (
            favorites.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all group"
              >
                <div 
                  className="flex items-center gap-3.5 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectMovie(movie);
                    onClose();
                  }}
                >
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-14 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-slate-400">{movie.release_year} • {movie.genres.join(', ')}</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-amber-400">
                      ★ {movie.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                    title="Ko'rish"
                  >
                    <Play className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemove(movie.id)}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

