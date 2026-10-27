-- ====================================================================
-- KINOMAN - SUPABASE / POSTGRESQL MA'LUMOTLAR BAZASI STRUKTURASI (SQL)
-- ====================================================================
-- Ushbu faylni Supabase boshqaruv panelining "SQL Editor" bo'limida
-- bitta bosish orqali to'liq ishga tushirishingiz mumkin.

-- 1. KINOLAR JADVALI (movies)
CREATE TABLE IF NOT EXISTS public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    original_title TEXT,
    description TEXT,
    release_year INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    rating NUMERIC(3, 1) DEFAULT 7.5,
    age_rating TEXT DEFAULT '16+',
    quality TEXT DEFAULT '4K HDR',
    poster_url TEXT NOT NULL,
    backdrop_url TEXT NOT NULL,
    trailer_url TEXT,
    director TEXT,
    cast_members TEXT[] DEFAULT '{}',
    genres TEXT[] DEFAULT '{}',
    country TEXT DEFAULT 'AQSH',
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. JANRLAR JADVALI (genres)
CREATE TABLE IF NOT EXISTS public.genres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Film',
    description TEXT
);

-- 3. FOYDALANUVCHI SHARHLARI (reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id TEXT REFERENCES public.movies(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. INDEKSLAR (Tezkor qidiruv va filtrlash uchun)
CREATE INDEX IF NOT EXISTS idx_movies_year ON public.movies(release_year);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON public.movies(rating);
CREATE INDEX IF NOT EXISTS idx_movies_featured ON public.movies(is_featured);
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON public.reviews(movie_id);

-- 5. ROW LEVEL SECURITY (RLS) SOZLAMALARI
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Ommaviy o'qish huquqi (hamma ko'ra oladi)
CREATE POLICY "Kinolarni ommaviy ko'rish" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Janrlarni ommaviy ko'rish" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Sharhlarni ommaviy ko'rish" ON public.reviews FOR SELECT USING (true);

-- Admin va foydalanuvchilar uchun yozish/o'chirish huquqi (Anon key orqali)
CREATE POLICY "Kinolarni boshqarish" ON public.movies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Janrlarni boshqarish" ON public.genres FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Sharhlarni qo'shish" ON public.reviews FOR INSERT WITH CHECK (true);

-- 6. DASTLABKI JANRLARNI YUKLASH (Seed Genres)
INSERT INTO public.genres (id, name, slug, icon) VALUES
    ('jangari', 'Jangari', 'jangari', 'Sword'),
    ('komediya', 'Komediya', 'komediya', 'Smile'),
    ('drama', 'Drama', 'drama', 'Heart'),
    ('fantastika', 'Fantastika', 'fantastika', 'Rocket'),
    ('qorqinchli', 'Qo''rqinchli', 'qorqinchli', 'Ghost'),
    ('sarguzasht', 'Sarguzasht', 'sarguzasht', 'Compass'),
    ('multfilm', 'Multfilm', 'multfilm', 'Sparkles'),
    ('tarixiy', 'Tarixiy', 'tarixiy', 'Crown'),
    ('kriminal', 'Kriminal', 'kriminal', 'ShieldAlert'),
    ('triller', 'Triller', 'triller', 'Eye'),
    ('uzbek', 'O''zbek kinosi', 'uzbek', 'Film')
ON CONFLICT (id) DO NOTHING;

-- 7. DASTLABKI FILMLARNI YUKLASH (Seed Movies)
INSERT INTO public.movies (
    id, title, original_title, description, release_year, duration_minutes, 
    rating, age_rating, quality, poster_url, backdrop_url, trailer_url, 
    director, cast_members, genres, country, is_featured, is_popular, views_count
) VALUES
(
    'dune-part-two',
    'Dyuna: 2-Qism',
    'Dune: Part Two',
    'Pol Atreydes Chani va Fremenlar bilan birlashib, uning oilasini yo''q qilgan fitnachilardan qasos olish yo''liga tushadi.',
    2024,
    166,
    8.8,
    '16+',
    '4K HDR',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    'https://www.youtube.com/embed/Way9Dexny3w',
    'Deni Vilnyov',
    ARRAY['Timoti Shalame', 'Zendaya', 'Rebekka Fergyuson', 'Xaver Bardem'],
    ARRAY['Fantastika', 'Sarguzasht', 'Drama'],
    'AQSH',
    true,
    true,
    45200
),
(
    'oppenheimer',
    'Oppengeymer',
    'Oppenheimer',
    'Nazariy fizik J. Robert Oppengeymer Ikkinchi Jahon Urushi paytida Manxetten loyihasi laboratoriyasini boshqaradi.',
    2023,
    180,
    8.9,
    '18+',
    '4K HDR',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    'https://www.youtube.com/embed/uYPbbksJxIg',
    'Kristofer Nolan',
    ARRAY['Killian Merfi', 'Emili Blant', 'Mett Deymon', 'Robert Dauni Jr.'],
    ARRAY['Drama', 'Tarixiy'],
    'AQSH',
    true,
    true,
    58900
)
ON CONFLICT (id) DO NOTHING;

