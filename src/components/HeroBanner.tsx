import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { Play, Info, Bookmark, Star, ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

interface HeroBannerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movies,
  onSelectMovie,
  onPlayTrailer,
  isFavorite,
  onToggleFavorite,
}) => {
  const featured = movies.filter((m) => m.is_featured).length > 0
    ? movies.filter((m) => m.is_featured)
    : movies.slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const currentMovie = featured[currentIndex] || featured[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const favorited = isFavorite(currentMovie.id);

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden bg-black select-none">
      {/* Background Backdrop Image */}
      <div 
        key={currentMovie.id}
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-105"
        style={{ backgroundImage: `url(${currentMovie.backdrop_url || currentMovie.poster_url})` }}
      >
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/70 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-md tracking-wider uppercase flex items-center gap-1 shadow-lg shadow-rose-600/40">
              Premyera
            </span>
            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/20 text-emerald-400 font-semibold rounded flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              IMDb {currentMovie.rating.toFixed(1)}
            </span>
            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/20 text-white/90 font-medium rounded flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {currentMovie.release_year}
            </span>
            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/20 text-white/90 font-medium rounded flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentMovie.duration_minutes} daq
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold rounded text-[11px]">
              {currentMovie.quality}
            </span>
            <span className="px-2 py-0.5 bg-white/10 text-slate-300 border border-white/15 font-semibold rounded text-[11px]">
              {currentMovie.age_rating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {currentMovie.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentMovie.genres.map((g) => (
              <span key={g} className="text-xs text-slate-300 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                {g}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
            {currentMovie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlayTrailer(currentMovie)}
              className="flex items-center gap-2.5 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Play className="w-5 h-5 fill-white text-white" />
              Treyler ko'rish
            </button>

            <button
              onClick={() => onSelectMovie(currentMovie)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Info className="w-5 h-5 text-slate-300" />
              Batafsil
            </button>

            <button
              onClick={() => onToggleFavorite(currentMovie)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
                favorited
                  ? 'bg-rose-600/30 border-rose-500 text-rose-400'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title={favorited ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
            >
              <Bookmark className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Navigation arrows for carousel */}
      {featured.length > 1 && (
        <div className="absolute right-6 bottom-16 flex items-center gap-2 z-20">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            title="Oldingi film"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-300 px-1">
            {currentIndex + 1} / {featured.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            title="Keyingi film"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

