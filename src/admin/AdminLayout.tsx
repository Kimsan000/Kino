import React, { useState, useEffect } from 'react';
import { Movie, Genre, DashboardStats } from '../types';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminMovieList } from './AdminMovieList';
import { AdminMovieForm } from './AdminMovieForm';
import { AdminGenres } from './AdminGenres';
import { AdminSupabaseConfig } from './AdminSupabaseConfig';
import { movieService } from '../services/movieService';
import { checkSupabaseConnection } from '../supabase/client';
import { Menu, X, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  onPreviewMovie: (movie: Movie) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onExitAdmin,
  onPreviewMovie,
}) => {
  // Always start at 'dashboard' as requested by user!
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      const [m, g, s, conn] = await Promise.all([
        movieService.getMovies(),
        movieService.getGenres(),
        movieService.getStats(),
        checkSupabaseConnection(),
      ]);
      setMovies(m);
      setGenres(g);
      setStats(s);
      setSupabaseConnected(conn.success);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddNewMovie = () => {
    setEditingMovie(null);
    setActiveTab('add-movie');
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setActiveTab('add-movie');
  };

  const handleSaveMovie = async (movieData: Omit<Movie, 'created_at' | 'updated_at'> | Movie) => {
    try {
      if (editingMovie) {
        await movieService.updateMovie(movieData as Movie);
        showToast('Film muvaffaqiyatli tahrirlandi!');
      } else {
        await movieService.addMovie(movieData);
        showToast('Yangi film muvaffaqiyatli qo\'shildi!');
      }
      setEditingMovie(null);
      await loadData();
      setActiveTab('movies');
    } catch (err) {
      showToast('Xatolik yuz berdi!', 'error');
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await movieService.deleteMovie(id);
      showToast('Film muvaffaqiyatli o\'chirildi!');
      await loadData();
    } catch (err) {
      showToast('Filmni o\'chirishda xatolik!', 'error');
    }
  };

  const handleAddGenre = async (newGenre: Omit<Genre, 'id'>) => {
    try {
      await movieService.addGenre(newGenre);
      showToast('Yangi janr qo\'shildi!');
      await loadData();
    } catch (err) {
      showToast('Janr qo\'shishda xatolik!', 'error');
    }
  };

  const handleDeleteGenre = async (id: string) => {
    try {
      await movieService.deleteGenre(id);
      showToast('Janr o\'chirildi!');
      await loadData();
    } catch (err) {
      showToast('Janrni o\'chirishda xatolik!', 'error');
    }
  };

  const handleResetSampleData = async () => {
    if (window.confirm('Barcha filmlar va janrlar dastlabki holatga qaytarilsinmi?')) {
      movieService.resetToSampleData();
      await loadData();
      showToast('Dastlabki namunaviy baza tiklandi!');
    }
  };

  const genreNames = genres.map((g) => g.name);

  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0f1117] border border-white/10 shadow-2xl animate-fade-in">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          )}
          <span className="text-xs font-semibold text-white">{toast.message}</span>
        </div>
      )}

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0c0d10] border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-white/5 text-slate-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-white text-base">ADMIN PANEL</span>
        </div>

        <button
          onClick={onExitAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-xs text-slate-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Sayt
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExitAdmin={onExitAdmin}
          moviesCount={movies.length}
          genresCount={genres.length}
          onResetData={handleResetSampleData}
          supabaseConnected={supabaseConnected}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-[#0c0d10] h-full overflow-y-auto">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              onExitAdmin={onExitAdmin}
              moviesCount={movies.length}
              genresCount={genres.length}
              onResetData={handleResetSampleData}
              supabaseConnected={supabaseConnected}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        {/* Render Tab Content */}
        {activeTab === 'dashboard' && stats && (
          <AdminDashboard
            stats={stats}
            setActiveTab={setActiveTab}
            onEditMovie={handleEditMovie}
            onDeleteMovie={handleDeleteMovie}
            onSelectMovie={onPreviewMovie}
          />
        )}

        {activeTab === 'movies' && (
          <AdminMovieList
            movies={movies}
            genres={genreNames}
            onAddNew={handleAddNewMovie}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
            onPreview={onPreviewMovie}
          />
        )}

        {activeTab === 'add-movie' && (
          <AdminMovieForm
            initialMovie={editingMovie}
            allGenres={genreNames}
            onSave={handleSaveMovie}
            onCancel={() => {
              setEditingMovie(null);
              setActiveTab('movies');
            }}
          />
        )}

        {activeTab === 'genres' && (
          <AdminGenres
            genres={genres}
            movies={movies}
            onAddGenre={handleAddGenre}
            onDeleteGenre={handleDeleteGenre}
          />
        )}

        {activeTab === 'supabase' && (
          <AdminSupabaseConfig onRefreshMovies={loadData} />
        )}
      </main>
    </div>
  );
};

