import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'kinoman_supabase_url';
const STORAGE_KEY_KEY = 'kinoman_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) : null;

  return {
    url: storedUrl || envUrl || '',
    anonKey: storedKey || envKey || '',
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);
    
    // Refresh client
    cachedClient = null;
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey || url === 'YOUR_SUPABASE_URL') {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
    return cachedClient;
  } catch (err) {
    console.error('Supabase client init error:', err);
    return null;
  }
}

export async function checkSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL va Anon Key kiritilmagan. Mahaliy xotiradan (Mock DB) foydalanilmoqda.',
    };
  }

  try {
    const { error } = await client.from('movies').select('id').limit(1);
    if (error) {
      return {
        success: false,
        message: `Xatolik yuz berdi: ${error.message}. Iltimos, SQL jadvalini yaratganingizga ishonch hosil qiling.`,
      };
    }
    return {
      success: true,
      message: 'Supabase PostgreSQL ma\'lumotlar bazasiga muvaffaqiyatli ulandi!',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Ulanishda xatolik: ${errorMsg}`,
    };
  }
}

