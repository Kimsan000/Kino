import React, { useState, useEffect } from 'react';
import { 
  Database, Check, Copy, RefreshCw, UploadCloud, 
  ExternalLink, ShieldCheck, AlertCircle, Sparkles, Terminal,
  Send, Bell
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  checkSupabaseConnection 
} from '../supabase/client';
import { movieService } from '../services/movieService';
import { telegramService } from '../services/telegramService';

interface AdminSupabaseConfigProps {
  onRefreshMovies: () => void;
}

export const AdminSupabaseConfig: React.FC<AdminSupabaseConfigProps> = ({
  onRefreshMovies,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Telegram Bot State
  const [tgBotToken, setTgBotToken] = useState('');
  const [tgChatId, setTgChatId] = useState('');
  const [tgEnabled, setTgEnabled] = useState(true);
  const [testingTg, setTestingTg] = useState(false);
  const [tgResult, setTgResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setUrl(creds.url);
    setAnonKey(creds.anonKey);

    const tg = telegramService.getConfig();
    setTgBotToken(tg.botToken);
    setTgChatId(tg.chatId);
    setTgEnabled(tg.enabled);

    // Initial check
    if (creds.url && creds.anonKey) {
      checkSupabaseConnection().then(setTestResult);
    }
  }, []);

  const handleSaveTg = (e: React.FormEvent) => {
    e.preventDefault();
    telegramService.saveConfig(tgBotToken, tgChatId, tgEnabled);
    setTgResult({ success: true, message: 'Telegram bot sozlamalari muvaffaqiyatli saqlandi!' });
    setTimeout(() => setTgResult(null), 3500);
  };

  const handleSendTgTest = async () => {
    setTestingTg(true);
    setTgResult(null);
    telegramService.saveConfig(tgBotToken, tgChatId, tgEnabled);
    const res = await telegramService.sendTestNotification();
    setTgResult(res);
    setTestingTg(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(url, anonKey);
    setTesting(true);
    setTestResult(null);

    const res = await checkSupabaseConnection();
    setTestResult(res);
    setTesting(false);
    onRefreshMovies();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    saveSupabaseCredentials(url, anonKey);
    const res = await checkSupabaseConnection();
    setTestResult(res);
    setTesting(false);
  };

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await movieService.syncToSupabase();
    setSyncResult(res);
    setSyncing(false);
    if (res.success) {
      onRefreshMovies();
    }
  };

  const sqlSchemaScript = `-- ====================================================================
-- KINOMAN - POSTGRESQL / SUPABASE MA'LUMOTLAR BAZASI DDL
-- ====================================================================
-- Ushbu SQL kodini Supabase boshqaruv panelidagi "SQL Editor" bo'limida ishga tushiring:

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

CREATE TABLE IF NOT EXISTS public.genres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Film',
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id TEXT REFERENCES public.movies(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Xavfsizlik qoidalari
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kinolarni ommaviy ko'rish" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Janrlarni ommaviy ko'rish" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Sharhlarni ommaviy ko'rish" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Kinolarni boshqarish" ON public.movies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Janrlarni boshqarish" ON public.genres FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Sharhlarni qo'shish" ON public.reviews FOR INSERT WITH CHECK (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            SQL & Supabase Integratsiyasi
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mt-1">Supabase Baza Sozlamalari</h2>
        <p className="text-xs text-slate-400">
          Supabase PostgreSQL ma'lumotlar bazasini to'g'ridan-to'g'ri ulang va barcha kinolarni bulutda saqlang.
        </p>
      </div>

      {/* Connection Form Card */}
      <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Supabase Ulanish Kalitlari</h3>
              <p className="text-xs text-slate-400">Ushbu kalitlar brauzeringizda xavfsiz saqlanadi</p>
            </div>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Supabase Dashboard <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-ref.supabase.co"
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Supabase Anon / Public Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Test connection result banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Sync result banner */}
          {syncResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
                syncResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{syncResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Kalitlarni Saqlash
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !url || !anonKey}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish'}
            </button>

            <button
              type="button"
              onClick={handleSyncToSupabase}
              disabled={syncing || !testResult?.success}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <UploadCloud className={`w-4 h-4 ${syncing ? 'animate-bounce' : ''}`} />
              {syncing ? 'Yuklanmoqda...' : 'Kinolarni Supabase-ga sinxronlash'}
            </button>
          </div>
        </form>
      </div>

      {/* Telegram Bot Notification Card */}
      <div className="p-6 rounded-2xl bg-[#0f1117] border border-blue-500/20 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Telegram Bot Bildirishnomalari</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ulangan (@movie6776bot)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Saytdagi yangi sharhlar, kino qo'shish va admin kirishlari to'g'ridan-to'g'ri Telegramingizga yuboriladi.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveTg} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telegram Bot Token (BotFather)
              </label>
              <input
                type="password"
                value={tgBotToken}
                onChange={(e) => setTgBotToken(e.target.value)}
                placeholder="8928954244:AAGwjR..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Chat ID (Sizning Telegram ID)
              </label>
              <input
                type="text"
                value={tgChatId}
                onChange={(e) => setTgChatId(e.target.value)}
                placeholder="7266374035"
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors max-w-xs">
            <input
              type="checkbox"
              checked={tgEnabled}
              onChange={(e) => setTgEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-bold text-white">Telegram bildirishnomalarini yoqish</span>
          </label>

          {tgResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
                tgResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {tgResult.success ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{tgResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Sozlamalarni Saqlash
            </button>

            <button
              type="button"
              onClick={handleSendTgTest}
              disabled={testingTg}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 disabled:opacity-40 transition-colors flex items-center gap-2"
            >
              <Bell className={`w-3.5 h-3.5 text-amber-400 ${testingTg ? 'animate-bounce' : ''}`} />
              {testingTg ? 'Yuborilmoqda...' : 'Telegramga Test Xabar Yuborish'}
            </button>
          </div>
        </form>
      </div>

      {/* SQL DDL Schema Script Box */}
      <div className="p-6 rounded-2xl bg-[#0f1117] border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/5 text-slate-300">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Supabase PostgreSQL SQL Sxemasi</h3>
              <p className="text-[11px] text-slate-400">
                Ushbu kodni nusxalang va Supabase boshqaruvidagi SQL Editor-da "Run" qiling.
              </p>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              copiedSql
                ? 'bg-emerald-600 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedSql ? 'Nusxalandi!' : 'SQL Kodni Nusxalash'}
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-black/70 border border-white/5 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-64 leading-relaxed">
            {sqlSchemaScript}
          </pre>
        </div>
      </div>
    </div>
  );
};

