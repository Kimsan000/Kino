export interface Movie {
  id: string;
  title: string;
  original_title?: string;
  description: string;
  release_year: number;
  duration_minutes: number;
  rating: number; // 0.0 - 10.0
  age_rating: string; // '12+', '16+', '18+', '0+'
  quality: string; // '4K HDR', 'Full HD', 'HD'
  poster_url: string;
  backdrop_url: string;
  trailer_url: string; // YouTube or direct MP4
  director: string;
  cast: string[];
  genres: string[]; // array of genre names or ids
  country: string;
  is_featured: boolean;
  is_popular: boolean;
  views_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  movie_count?: number;
}

export interface Review {
  id: string;
  movie_id: string;
  author_name: string;
  rating: number; // 1-10
  comment: string;
  created_at: string;
}

export interface DashboardStats {
  totalMovies: number;
  totalViews: number;
  totalGenres: number;
  averageRating: number;
  featuredCount: number;
  topGenres: { name: string; count: number }[];
  recentMovies: Movie[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastTested?: string;
}

