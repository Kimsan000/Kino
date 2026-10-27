import React, { useState, useEffect, useMemo } from 'react';
import { Movie, Genre } from './types';
import { movieService } from './services/movieService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieCard } from './components/MovieCard';
import { MovieDetailModal } from './components/MovieDetailModal';
import { FavoritesModal } from './components/FavoritesModal';
import { AdminLayout } from './admin/AdminLayout';
import { 
  Sparkles, Film, Flame, Award, SlidersHorizontal, 
  Search, Shield, Heart, ArrowUp 
} from 'lucide-react';

const STORAGE_FAVORITES_KEY = 'kinoman_favorites_ids';

export function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'movies' | 'genres' | 'admin'>('home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popular'>('newest');

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Selected Movie for Modal
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [autoPlayTrailer, setAutoPlayTrailer] = useState(false);

  // Load movies & genres
  const loadData = async () => {
    try {
      setLoading(true);
      const [allMovies, allGenres] = await Promise.all([
        movieService.getMovies(),
        movieService.getGenres(),
      ]);
      setMovies(allMovies);
      setGenres(allGenres);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (movie: Movie) => {
    setFavoriteIds((prev) => {
      let updated: string[];
      if (prev.includes(movie.id)) {
        updated = prev.filter((id) => id !== movie.id);
      } else {
        updated = [...prev, movie.id];
      }
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const favoriteMovies = useMemo(() => {
    return movies.filter((m) => favoriteIds.includes(m.id));
  }, [movies, favoriteIds]);

  // Filtered and Sorted Movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter((m) => {
        const matchesSearch =
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.original_title && m.original_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesGenre = selectedGenre === 'all' || m.genres.includes(selectedGenre);

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popular') return (b.views_count || 0) - (a.views_count || 0);
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });
  }, [movies, searchQuery, selectedGenre, sortBy]);

  const featuredMovies = useMemo(() => {
    return movies.filter((m) => m.is_featured);
  }, [movies]);

  const popularMovies = useMemo(() => {
    return movies.filter((m) => m.is_popular);
  }, [movies]);

  const handleOpenTrailer = (movie: Movie) => {
    setSelectedMovie(movie);
    setAutoPlayTrailer(true);
  };

  const handleOpenDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setAutoPlayTrailer(false);
  };

  const genreNames = genres.map((g) => g.name);

  // If in admin mode, show the full admin dashboard
  if (currentTab === 'admin') {
    return (
      <AdminLayout
        onExitAdmin={() => {
          setCurrentTab('home');
          loadData();
        }}
        onPreviewMovie={handleOpenDetails}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favoriteIds.length}
        openFavorites={() => setIsFavoritesOpen(true)}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genreNames}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {/* Hero Section (only when no active search and on 'home' tab) */}
        {!searchQuery && selectedGenre === 'all' && currentTab === 'home' && (
          <HeroBanner
            movies={featuredMovies.length > 0 ? featuredMovies : movies}
            onSelectMovie={handleOpenDetails}
            onPlayTrailer={handleOpenTrailer}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* Filter and Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
          
          {/* Genre Category Pills */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {searchQuery ? `Qidiruv natijalari: "${searchQuery}"` : selectedGenre === 'all' ? 'Kinolar Kolleksiyasi' : `${selectedGenre} Janridagi Filmlar`}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                  {filteredMovies.length} ta film
                </span>
              </div>

              {/* Sort Switcher */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'rating' | 'popular')}
                  className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="newest" className="bg-[#0e0f12]">Eng yangilari</option>
                  <option value="rating" className="bg-[#0e0f12]">IMDb Reytingi bo'yicha</option>
                  <option value="popular" className="bg-[#0e0f12]">Eng ko'p ko'rilgan</option>
                </select>
              </div>
            </div>

            {/* Quick Genre Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGenre === 'all'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                Barchasi
              </button>

              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGenre === g.name
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Films Row (When on home & not searching) */}
          {!searchQuery && selectedGenre === 'all' && currentTab === 'home' && popularMovies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">Eng Ommabop Kinolar</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularMovies.slice(0, 5).map((movie) => (
                  <MovieCard
                    key={`popular-${movie.id}`}
                    movie={movie}
                    onSelect={handleOpenDetails}
                    onPlay={handleOpenTrailer}
                    isFavorite={isFavorite(movie.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main Movie Grid */}
          <div className="space-y-4">
            {!searchQuery && selectedGenre === 'all' && currentTab === 'home' && (
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Barcha Filmlar</h3>
              </div>
            )}

            {loading ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Filmlar yuklanmoqda...</p>
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white/[0.01] rounded-3xl border border-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Hech qanday film topilmadi</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Qidiruv so'zini o'zgartirib ko'ring yoki boshqa janrni tanlang.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-rose-400"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={handleOpenDetails}
                    onPlay={handleOpenTrailer}
                    isFavorite={isFavorite(movie.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#050507] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl text-white tracking-wider">
                KINO<span className="text-rose-500">MAN</span> UZ
              </span>
              <p className="text-xs text-slate-500">O'zbekistondagi eng zamonaviy kinolar portali</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right space-y-2">
            <p>© {new Date().getFullYear()} KINOMAN. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center justify-center md:justify-end gap-4 text-slate-500">
              <button
                onClick={() => setCurrentTab('admin')}
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Boshqaruv Tizimi
              </button>
              <span>•</span>
              <a href="#root" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5" /> Yuqoriga
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Movie Detail Modal (With Video Trailer Player & Reviews) */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isFavorite={selectedMovie ? isFavorite(selectedMovie.id) : false}
        onToggleFavorite={toggleFavorite}
        autoPlayTrailer={autoPlayTrailer}
      />

      {/* Favorites / Watchlist Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteMovies}
        onRemove={(id) => {
          const m = movies.find((item) => item.id === id);
          if (m) toggleFavorite(m);
        }}
        onSelectMovie={handleOpenDetails}
      />
    </div>
  );
}

export default App;

