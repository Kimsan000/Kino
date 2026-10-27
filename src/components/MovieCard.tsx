import React from 'react';
import { Movie } from '../types';
import { Star, Play, Bookmark, Clock } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative bg-[#12141a] rounded-2xl overflow-hidden border border-white/5 hover:border-rose-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-600/10 cursor-pointer flex flex-col"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30 rounded-md">
            {movie.quality}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white/20 backdrop-blur-md text-slate-200 rounded">
            {movie.age_rating}
          </span>
        </div>

        {/* Rating and Favorite */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <div className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-emerald-400 font-bold text-xs rounded-md border border-white/10 flex items-center gap-1">
            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
            {movie.rating.toFixed(1)}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-black/60 border-white/20 text-slate-300 hover:text-white hover:bg-black/90'
            }`}
            title={isFavorite ? "O'chirish" : "Saqlash"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(movie);
            }}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 transform scale-75 group-hover:scale-100 transition-all duration-300"
            title="Treyler ko'rish"
          >
            <Play className="w-6 h-6 fill-white text-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-rose-400 transition-colors">
            {movie.title}
          </h3>
          {movie.original_title && movie.original_title !== movie.title && (
            <p className="text-[11px] text-slate-400 line-clamp-1 italic">
              {movie.original_title}
            </p>
          )}
        </div>

        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>{movie.release_year}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {movie.duration_minutes} daq
            </span>
          </div>

          <div className="flex gap-1">
            {movie.genres.slice(0, 1).map((g) => (
              <span key={g} className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-300">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

