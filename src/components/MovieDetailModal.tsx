import React, { useState, useEffect } from 'react';
import { Movie, Review } from '../types';
import { movieService } from '../services/movieService';
import { telegramService } from '../services/telegramService';
import { 
  X, Star, Play, Bookmark, Clock, Calendar, Globe, User, 
  MessageSquare, Send, CheckCircle2, Film
} from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  autoPlayTrailer?: boolean;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  isFavorite,
  onToggleFavorite,
  autoPlayTrailer = false,
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(autoPlayTrailer);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [reviewRating, setReviewRating] = useState(10);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (movie) {
      setIsPlayingTrailer(autoPlayTrailer);
      movieService.getReviews(movie.id).then(setReviews);
      movieService.incrementViews(movie.id);
    }
  }, [movie, autoPlayTrailer]);

  if (!movie) return null;

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await movieService.addReview({
        movie_id: movie.id,
        author_name: authorName.trim(),
        rating: reviewRating,
        comment: commentText.trim(),
      });
      setReviews([created, ...reviews]);
      // Telegram bildirishnomasi
      telegramService.notifyNewReview(movie.title, authorName.trim(), reviewRating, commentText.trim());
      setAuthorName('');
      setCommentText('');
      setSuccessMsg('Fikringiz muvaffaqiyatli saqlandi!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format embed url
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const vid = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const vid = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#0e0f12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Section: Video Player or Hero Backdrop */}
        <div className="relative w-full bg-black aspect-video max-h-[420px] flex-shrink-0">
          {isPlayingTrailer && movie.trailer_url ? (
            <div className="w-full h-full relative">
              <iframe
                src={getEmbedUrl(movie.trailer_url)}
                title={movie.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlayingTrailer(false)}
                className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-lg bg-black/70 text-xs font-semibold text-white/90 hover:text-white backdrop-blur-md border border-white/20"
              >
                ← Posterga qaytish
              </button>
            </div>
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center relative flex items-center justify-center group"
              style={{ backgroundImage: `url(${movie.backdrop_url || movie.poster_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f12] via-[#0e0f12]/40 to-transparent" />
              
              {/* Play Trailer Trigger Button */}
              {movie.trailer_url && (
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="relative z-10 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-6 h-6 fill-white text-white" />
                  Treylerni ko'rish
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details & Tabs Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Main Info */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{movie.title}</h2>
                {movie.original_title && (
                  <p className="text-sm text-slate-400 font-medium italic mt-0.5">{movie.original_title}</p>
                )}
              </div>

              {/* Bookmark and Rating Badges */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  {movie.rating.toFixed(1)} / 10
                </div>

                <button
                  onClick={() => onToggleFavorite(movie)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    isFavorite
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Saqlangan' : 'Saqlash'}
                </button>
              </div>
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2 border-y border-white/5 py-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {movie.release_year}-yil
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {movie.duration_minutes} daqiqa
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Globe className="w-3.5 h-3.5" />
                {movie.country}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                {movie.quality}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 font-bold">
                {movie.age_rating}
              </span>
              {movie.views_count > 0 && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">{movie.views_count.toLocaleString()} marta ko'rildi</span>
                </>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 pt-4">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="pt-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Film haqida</h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{movie.description}</p>
            </div>

            {/* Director & Cast */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-6">
              {movie.director && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Rejissyor
                  </h4>
                  <p className="text-sm font-semibold text-white">{movie.director}</p>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    Bosh rollarda
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.cast.map((actor) => (
                      <span key={actor} className="text-xs text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Reviews & Comments Section */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-500" />
                Foydalanuvchilar fikrlari ({reviews.length})
              </h3>
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleAddReview} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Ismingiz</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Masalan: Sardor Aliyev"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Bahoyingiz (1-10)</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n} className="bg-[#0e0f12]">
                        {n} ⭐ - {n >= 8 ? 'Ajoyib' : n >= 6 ? 'Yaxshi' : 'O\'rtacha'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Sharhingiz</label>
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Film haqidagi taassurotlaringizni yozib qoldiring..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              {successMsg && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Yuborilmoqda...' : 'Fikrni chop etish'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Hali fikrlar qoldirilmagan. Birinchi bo'lib fikr bildiring!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-rose-600/30 text-rose-300 font-bold text-xs flex items-center justify-center">
                          {rev.author_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-white">{rev.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {rev.rating}/10
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-9">{rev.comment}</p>
                    <p className="text-[10px] text-slate-500 pl-9">
                      {new Date(rev.created_at).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

