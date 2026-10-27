import React from 'react';
import { Film, Search, Bookmark, ShieldCheck, Home, Sparkles, Filter } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'movies' | 'genres' | 'admin';
  setCurrentTab: (tab: 'home' | 'movies' | 'genres' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  favoritesCount: number;
  openFavorites: () => void;
  selectedGenre: string;
  setSelectedGenre: (g: string) => void;
  genres: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  openFavorites,
  selectedGenre,
  setSelectedGenre,
  genres,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#08080a]/85 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { setCurrentTab('home'); setSelectedGenre('all'); setSearchQuery(''); }}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-wider text-white">
                  KINO<span className="text-rose-500">MAN</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                  UZ
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-1 tracking-wider uppercase font-medium">Kinolar Portali</p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/5">
            <button
              onClick={() => { setCurrentTab('home'); setSelectedGenre('all'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentTab === 'home' && selectedGenre === 'all'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              Bosh sahifa
            </button>

            <button
              onClick={() => { setCurrentTab('movies'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentTab === 'movies'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Barcha Filmlar
            </button>

            {/* Quick Genre Selector Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre !== 'all'
                    ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Filter className="w-4 h-4" />
                {selectedGenre === 'all' ? 'Janrlar' : selectedGenre}
              </button>

              <div className="absolute top-full left-0 mt-2 w-48 py-2 glass-dropdown rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => setSelectedGenre('all')}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-rose-600/20 hover:text-white transition-colors ${
                    selectedGenre === 'all' ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  Hammasi
                </button>
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGenre(g);
                      if (currentTab === 'admin') setCurrentTab('movies');
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-rose-600/20 hover:text-white transition-colors ${
                      selectedGenre === g ? 'text-rose-400 font-bold bg-white/5' : 'text-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab === 'admin') setCurrentTab('movies');
              }}
              placeholder="Film, aktyor yoki rejissyor qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons: Watchlist & Admin Switcher */}
          <div className="flex items-center gap-3">
            {/* Watchlist button */}
            <button
              onClick={openFavorites}
              className="relative p-2.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              title="Sevimlilar"
            >
              <Bookmark className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-[#08080a]">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Admin Panel Toggle Button */}
            <button
              onClick={() => setCurrentTab(currentTab === 'admin' ? 'home' : 'admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                currentTab === 'admin'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentTab === 'admin' ? 'Boshqaruvdan chiqish' : 'Admin Panel'}
              </span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-3 sm:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentTab === 'admin') setCurrentTab('movies');
              }}
              placeholder="Film qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

