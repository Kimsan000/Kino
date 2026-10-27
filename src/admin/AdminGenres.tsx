import React, { useState } from 'react';
import { Genre, Movie } from '../types';
import { FolderTree, Plus, Trash2, Tag, Check, Sparkles } from 'lucide-react';

interface AdminGenresProps {
  genres: Genre[];
  movies: Movie[];
  onAddGenre: (genre: Omit<Genre, 'id'>) => void;
  onDeleteGenre: (id: string) => void;
}

export const AdminGenres: React.FC<AdminGenresProps> = ({
  genres,
  movies,
  onAddGenre,
  onDeleteGenre,
}) => {
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreDesc, setNewGenreDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    onAddGenre({
      name: newGenreName.trim(),
      slug: newGenreName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: 'Film',
      description: newGenreDesc.trim() || undefined,
    });

    setNewGenreName('');
    setNewGenreDesc('');
  };

  // Calculate count for each genre
  const getMovieCount = (genreName: string) => {
    return movies.filter((m) => m.genres.includes(genreName)).length;
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-white">Janrlar va Toifalar</h2>
        <p className="text-xs text-slate-400">
          Kino saytingizdagi barcha toifalarni boshqaring yoki yangi janr qo'shing.
        </p>
      </div>

      {/* Add Genre Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-[#0f1117] border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-rose-500" />
          Yangi Janr Qo'shish
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Janr Nomi *
            </label>
            <input
              type="text"
              required
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              placeholder="Masalan: Anime, Hujjatli, Detektiv..."
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tavsifi (Ixtiyoriy)
            </label>
            <input
              type="text"
              value={newGenreDesc}
              onChange={(e) => setNewGenreDesc(e.target.value)}
              placeholder="Qisqacha tavsif..."
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
        >
          <Check className="w-4 h-4" />
          Janrni qo'shish
        </button>
      </form>

      {/* Existing Genres Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {genres.map((genre) => {
          const count = getMovieCount(genre.name);

          return (
            <div
              key={genre.id}
              className="p-4 rounded-2xl bg-[#0f1117] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 flex items-center justify-center">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{genre.name}</h4>
                  <p className="text-[11px] text-slate-400">{count} ta film mavjud</p>
                </div>
              </div>

              <button
                onClick={() => onDeleteGenre(genre.id)}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors opacity-70 group-hover:opacity-100"
                title="O'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

