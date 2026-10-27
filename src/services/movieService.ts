import { Movie, Genre, DashboardStats, Review } from '../types';
import { INITIAL_MOVIES, INITIAL_GENRES } from '../data/initialMovies';
import { getSupabaseClient } from '../supabase/client';

const STORAGE_KEY_MOVIES = 'kinoman_movies_db';
const STORAGE_KEY_GENRES = 'kinoman_genres_db';
const STORAGE_KEY_REVIEWS = 'kinoman_reviews_db';

// Helper for LocalStorage
function getLocalMovies(): Movie[] {
  if (typeof window === 'undefined') return INITIAL_MOVIES;
  const stored = localStorage.getItem(STORAGE_KEY_MOVIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_MOVIES, JSON.stringify(INITIAL_MOVIES));
    return INITIAL_MOVIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_MOVIES;
  }
}

function saveLocalMovies(movies: Movie[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_MOVIES, JSON.stringify(movies));
  }
}

function getLocalGenres(): Genre[] {
  if (typeof window === 'undefined') return INITIAL_GENRES;
  const stored = localStorage.getItem(STORAGE_KEY_GENRES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(INITIAL_GENRES));
    return INITIAL_GENRES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_GENRES;
  }
}

function saveLocalGenres(genres: Genre[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(genres));
  }
}

export const movieService = {
  // === MOVIES CRUD ===
  async getMovies(): Promise<Movie[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Normalize from Supabase column names
          const mapped: Movie[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            original_title: item.original_title,
            description: item.description,
            release_year: item.release_year,
            duration_minutes: item.duration_minutes,
            rating: Number(item.rating),
            age_rating: item.age_rating,
            quality: item.quality,
            poster_url: item.poster_url,
            backdrop_url: item.backdrop_url,
            trailer_url: item.trailer_url,
            director: item.director,
            cast: Array.isArray(item.cast_members) ? item.cast_members : (item.cast || []),
            genres: Array.isArray(item.genres) ? item.genres : [],
            country: item.country,
            is_featured: Boolean(item.is_featured),
            is_popular: Boolean(item.is_popular),
            views_count: item.views_count || 0,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));
          // Cache to local storage
          saveLocalMovies(mapped);
          return mapped;
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local database:', e);
      }
    }

    return getLocalMovies();
  },

  async getMovieById(id: string): Promise<Movie | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            title: data.title,
            original_title: data.original_title,
            description: data.description,
            release_year: data.release_year,
            duration_minutes: data.duration_minutes,
            rating: Number(data.rating),
            age_rating: data.age_rating,
            quality: data.quality,
            poster_url: data.poster_url,
            backdrop_url: data.backdrop_url,
            trailer_url: data.trailer_url,
            director: data.director,
            cast: Array.isArray(data.cast_members) ? data.cast_members : (data.cast || []),
            genres: Array.isArray(data.genres) ? data.genres : [],
            country: data.country,
            is_featured: Boolean(data.is_featured),
            is_popular: Boolean(data.is_popular),
            views_count: data.views_count || 0,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        }
      } catch (e) {
        console.warn('Supabase getMovieById failed:', e);
      }
    }

    const local = getLocalMovies();
    return local.find((m) => m.id === id) || null;
  },

  async addMovie(movie: Omit<Movie, 'created_at' | 'updated_at'>): Promise<Movie> {
    const newMovie: Movie = {
      ...movie,
      id: movie.id || movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `kino-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views_count: movie.views_count || 0,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('movies').insert({
          id: newMovie.id,
          title: newMovie.title,
          original_title: newMovie.original_title || null,
          description: newMovie.description,
          release_year: newMovie.release_year,
          duration_minutes: newMovie.duration_minutes,
          rating: newMovie.rating,
          age_rating: newMovie.age_rating,
          quality: newMovie.quality,
          poster_url: newMovie.poster_url,
          backdrop_url: newMovie.backdrop_url,
          trailer_url: newMovie.trailer_url,
          director: newMovie.director,
          cast_members: newMovie.cast,
          genres: newMovie.genres,
          country: newMovie.country,
          is_featured: newMovie.is_featured,
          is_popular: newMovie.is_popular,
          views_count: newMovie.views_count,
          created_at: newMovie.created_at,
          updated_at: newMovie.updated_at,
        });
      } catch (e) {
        console.error('Supabase addMovie error:', e);
      }
    }

    // Always update local database as well
    const current = getLocalMovies();
    const updated = [newMovie, ...current.filter((m) => m.id !== newMovie.id)];
    saveLocalMovies(updated);

    return newMovie;
  },

  async updateMovie(movie: Movie): Promise<Movie> {
    const updatedMovie: Movie = {
      ...movie,
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('movies')
          .update({
            title: updatedMovie.title,
            original_title: updatedMovie.original_title || null,
            description: updatedMovie.description,
            release_year: updatedMovie.release_year,
            duration_minutes: updatedMovie.duration_minutes,
            rating: updatedMovie.rating,
            age_rating: updatedMovie.age_rating,
            quality: updatedMovie.quality,
            poster_url: updatedMovie.poster_url,
            backdrop_url: updatedMovie.backdrop_url,
            trailer_url: updatedMovie.trailer_url,
            director: updatedMovie.director,
            cast_members: updatedMovie.cast,
            genres: updatedMovie.genres,
            country: updatedMovie.country,
            is_featured: updatedMovie.is_featured,
            is_popular: updatedMovie.is_popular,
            views_count: updatedMovie.views_count,
            updated_at: updatedMovie.updated_at,
          })
          .eq('id', updatedMovie.id);
      } catch (e) {
        console.error('Supabase updateMovie error:', e);
      }
    }

    const current = getLocalMovies();
    const updated = current.map((m) => (m.id === updatedMovie.id ? updatedMovie : m));
    saveLocalMovies(updated);

    return updatedMovie;
  },

  async deleteMovie(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('movies').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteMovie error:', e);
      }
    }

    const current = getLocalMovies();
    const updated = current.filter((m) => m.id !== id);
    saveLocalMovies(updated);

    return true;
  },

  async incrementViews(id: string): Promise<void> {
    const current = getLocalMovies();
    const movie = current.find((m) => m.id === id);
    if (movie) {
      movie.views_count = (movie.views_count || 0) + 1;
      saveLocalMovies(current);

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase
            .from('movies')
            .update({ views_count: movie.views_count })
            .eq('id', id);
        } catch {
          // ignore background metric error
        }
      }
    }
  },

  // === GENRES ===
  async getGenres(): Promise<Genre[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('genres').select('*');
        if (!error && data && data.length > 0) {
          saveLocalGenres(data);
          return data;
        }
      } catch (e) {
        console.warn('Supabase getGenres failed:', e);
      }
    }
    return getLocalGenres();
  },

  async addGenre(genre: Omit<Genre, 'id'> & { id?: string }): Promise<Genre> {
    const id = genre.id || genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newGenre: Genre = {
      id,
      name: genre.name,
      slug: genre.slug || id,
      icon: genre.icon || 'Film',
      description: genre.description || '',
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('genres').insert(newGenre);
      } catch (e) {
        console.error('Supabase addGenre error:', e);
      }
    }

    const current = getLocalGenres();
    const updated = [...current.filter((g) => g.id !== newGenre.id), newGenre];
    saveLocalGenres(updated);
    return newGenre;
  },

  async deleteGenre(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('genres').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteGenre error:', e);
      }
    }

    const current = getLocalGenres();
    const updated = current.filter((g) => g.id !== id);
    saveLocalGenres(updated);
    return true;
  },

  // === REVIEWS ===
  async getReviews(movieId: string): Promise<Review[]> {
    const stored = localStorage.getItem(`${STORAGE_KEY_REVIEWS}_${movieId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'rev-1',
        movie_id: movieId,
        author_name: 'Bobur Mirzo',
        rating: 9,
        comment: 'Ajoyib kino! Har bir sahnasi hayratlanarli darajada yuqori sifatda ishlangan.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'rev-2',
        movie_id: movieId,
        author_name: 'Shaxlo Karimova',
        rating: 10,
        comment: 'Ovoz effektlari va grafika shunchaki daxshat! Kinomanga rahmat!',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ];
  },

  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    const reviews = await this.getReviews(review.movie_id);
    const updated = [newReview, ...reviews];
    localStorage.setItem(`${STORAGE_KEY_REVIEWS}_${review.movie_id}`, JSON.stringify(updated));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('reviews').insert(newReview);
      } catch (e) {
        console.error('Supabase addReview error:', e);
      }
    }

    return newReview;
  },

  // === STATS ===
  async getStats(): Promise<DashboardStats> {
    const movies = await this.getMovies();
    const genres = await this.getGenres();

    const totalMovies = movies.length;
    const totalViews = movies.reduce((sum, m) => sum + (m.views_count || 0), 0);
    const totalGenres = genres.length;
    const averageRating = totalMovies > 0
      ? Number((movies.reduce((sum, m) => sum + (m.rating || 0), 0) / totalMovies).toFixed(1))
      : 0;
    const featuredCount = movies.filter((m) => m.is_featured).length;

    // Genre count distribution
    const genreMap: Record<string, number> = {};
    movies.forEach((m) => {
      m.genres.forEach((g) => {
        genreMap[g] = (genreMap[g] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalMovies,
      totalViews,
      totalGenres,
      averageRating,
      featuredCount,
      topGenres,
      recentMovies: movies.slice(0, 5),
    };
  },

  // === SYNC LOCAL TO SUPABASE ===
  async syncToSupabase(): Promise<{ success: boolean; message: string; count: number }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        success: false,
        message: 'Supabase-ga ulanmagan. Iltimos, sozlamalardan Supabase URL va Key kiriting.',
        count: 0,
      };
    }

    try {
      const localMovies = getLocalMovies();
      const payload = localMovies.map((m) => ({
        id: m.id,
        title: m.title,
        original_title: m.original_title || null,
        description: m.description,
        release_year: m.release_year,
        duration_minutes: m.duration_minutes,
        rating: m.rating,
        age_rating: m.age_rating,
        quality: m.quality,
        poster_url: m.poster_url,
        backdrop_url: m.backdrop_url,
        trailer_url: m.trailer_url,
        director: m.director,
        cast_members: m.cast,
        genres: m.genres,
        country: m.country,
        is_featured: m.is_featured,
        is_popular: m.is_popular,
        views_count: m.views_count,
      }));

      const { error } = await supabase.from('movies').upsert(payload, { onConflict: 'id' });
      if (error) {
        return {
          success: false,
          message: `Sinxronizatsiya xatosi: ${error.message}`,
          count: 0,
        };
      }

      return {
        success: true,
        message: `${localMovies.length} ta kino muvaffaqiyatli Supabase ma'lumotlar bazasiga sinxronlashtirildi!`,
        count: localMovies.length,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Xatolik: ${errorMsg}`,
        count: 0,
      };
    }
  },

  // Reset to sample data
  resetToSampleData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MOVIES, JSON.stringify(INITIAL_MOVIES));
      localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(INITIAL_GENRES));
    }
  }
};

