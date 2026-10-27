import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { 
  Save, X, Image, Film, Video, Star, Calendar, 
  Clock, Globe, User, Check, Sparkles, Layers 
} from 'lucide-react';

interface AdminMovieFormProps {
  initialMovie?: Movie | null;
  allGenres: string[];
  onSave: (movieData: Omit<Movie, 'created_at' | 'updated_at'> | Movie) => void;
  onCancel: () => void;
}

export const AdminMovieForm: React.FC<AdminMovieFormProps> = ({
  initialMovie,
  allGenres,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialMovie);

  const [title, setTitle] = useState(initialMovie?.title || '');
  const [originalTitle, setOriginalTitle] = useState(initialMovie?.original_title || '');
  const [id, setId] = useState(initialMovie?.id || '');
  const [description, setDescription] = useState(initialMovie?.description || '');
  const [releaseYear, setReleaseYear] = useState(initialMovie?.release_year || new Date().getFullYear());
  const [durationMinutes, setDurationMinutes] = useState(initialMovie?.duration_minutes || 120);
  const [rating, setRating] = useState(initialMovie?.rating || 8.0);
  const [ageRating, setAgeRating] = useState(initialMovie?.age_rating || '16+');
  const [quality, setQuality] = useState(initialMovie?.quality || '4K HDR');
  const [posterUrl, setPosterUrl] = useState(initialMovie?.poster_url || '');
  const [backdropUrl, setBackdropUrl] = useState(initialMovie?.backdrop_url || '');
  const [trailerUrl, setTrailerUrl] = useState(initialMovie?.trailer_url || '');
  const [director, setDirector] = useState(initialMovie?.director || '');
  const [castInput, setCastInput] = useState(initialMovie?.cast?.join(', ') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialMovie?.genres || ['Jangari']);
  const [country, setCountry] = useState(initialMovie?.country || 'AQSH');
  const [isFeatured, setIsFeatured] = useState(initialMovie?.is_featured || false);
  const [isPopular, setIsPopular] = useState(initialMovie?.is_popular || false);

  // Auto-slug ID generator when typing title (only if not editing)
  useEffect(() => {
    if (!isEditing && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setId(generated);
    }
  }, [title, isEditing]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Iltimos, kino nomi va tavsifini kiriting!');
      return;
    }

    const castList = castInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const movieData: Movie = {
      id: id || `kino-${Date.now()}`,
      title: title.trim(),
      original_title: originalTitle.trim() || undefined,
      description: description.trim(),
      release_year: Number(releaseYear),
      duration_minutes: Number(durationMinutes),
      rating: Number(Number(rating).toFixed(1)),
      age_rating: ageRating,
      quality,
      poster_url: posterUrl.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      backdrop_url: backdropUrl.trim() || posterUrl.trim() || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80',
      trailer_url: trailerUrl.trim() || 'https://www.youtube.com/embed/Way9Dexny3w',
      director: director.trim(),
      cast: castList,
      genres: selectedGenres,
      country: country.trim() || 'AQSH',
      is_featured: isFeatured,
      is_popular: isPopular,
      views_count: initialMovie?.views_count || 120,
    };

    onSave(movieData);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-black text-white">
            {isEditing ? `"${initialMovie?.title}" filmini tahrirlash` : 'Yangi Kino Qo\'shish'}
          </h2>
          <p className="text-xs text-slate-400">
            Kino ma'lumotlarini to'ldiring. Barcha maydonlar avtomatik saqlanadi.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Main Info (2 cols) */}
          <div className="lg:col-span-2 space-y-5 bg-[#0f1117] p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-rose-500" />
              Asosiy Ma'lumotlar
            </h3>

            {/* Title & Original Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kino Nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Qasoskorlar: Intiho"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asl Nomi (Original / Inglizcha)
                </label>
                <input
                  type="text"
                  value={originalTitle}
                  onChange={(e) => setOriginalTitle(e.target.value)}
                  placeholder="Masalan: Avengers: Endgame"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Slug / ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Film ID (Unikal identifikator / Slug)
              </label>
              <input
                type="text"
                required
                value={id}
                disabled={isEditing}
                onChange={(e) => setId(e.target.value)}
                placeholder="avengers-endgame"
                className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-slate-300 font-mono disabled:opacity-50 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Film Tavsifi (Syujeti) *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Film haqida to'liq tavsif, syujet qisqacha mazmuni..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Genres Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Janrlar (Bir nechtasini tanlash mumkin)
              </label>
              <div className="flex flex-wrap gap-2">
                {allGenres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      type="button"
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Numerical details: Year, Duration, Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Yili
                </label>
                <input
                  type="number"
                  min={1920}
                  max={2030}
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Davomiyligi (daq)
                </label>
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  IMDb Reyting (0-10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Quality, Age Rating, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sifati</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="4K HDR" className="bg-[#0f1117]">4K HDR</option>
                  <option value="Full HD" className="bg-[#0f1117]">Full HD (1080p)</option>
                  <option value="HD" className="bg-[#0f1117]">HD (720p)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Yosh chegarasi</label>
                <select
                  value={ageRating}
                  onChange={(e) => setAgeRating(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="0+" className="bg-[#0f1117]">0+ (Hamma uchun)</option>
                  <option value="12+" className="bg-[#0f1117]">12+ (O'smirlar)</option>
                  <option value="16+" className="bg-[#0f1117]">16+ (Kattalar)</option>
                  <option value="18+" className="bg-[#0f1117]">18+ (Faqat kattalar)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Mamlakat
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="AQSH, O'zbekiston, Buyuk Britaniya..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Director & Cast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Rejissyor
                </label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="Kristofer Nolan..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aktyorlar (vergul bilan ajrating)
                </label>
                <input
                  type="text"
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  placeholder="Aktyor 1, Aktyor 2, Aktyor 3..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Media, Links & Flags (1 col) */}
          <div className="space-y-5">
            {/* Media URLs Card */}
            <div className="bg-[#0f1117] p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-rose-500" />
                Media va Rasmlar
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Poster URL manzili
                </label>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="https://...poster.jpg"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Poster Live Preview */}
              {posterUrl && (
                <div className="relative aspect-[2/3] w-28 rounded-xl overflow-hidden border border-white/10 shadow-lg mx-auto">
                  <img
                    src={posterUrl}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-1 left-1 right-1 text-center text-[9px] bg-black/70 py-0.5 rounded text-white">
                    Ko'rinish
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Fon Rasmi (Backdrop) URL
                </label>
                <input
                  type="url"
                  value={backdropUrl}
                  onChange={(e) => setBackdropUrl(e.target.value)}
                  placeholder="https://...backdrop.jpg"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  Treyler URL (YouTube)
                </label>
                <input
                  type="url"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Featured / Popular flags */}
            <div className="bg-[#0f1117] p-6 rounded-2xl border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Namoyish Sozlamalari
              </h3>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Bosh sahifada (Premyera)</div>
                  <div className="text-[11px] text-slate-400">Asosiy katta bannerda aylantirib ko'rsatiladi</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Ommabop / Trendda</div>
                  <div className="text-[11px] text-slate-400">Ommabop filmlar to'plamida yuqorida turadi</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Bekor qilish
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'O\'zgarishlarni saqlash' : 'Kinoni saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
};

