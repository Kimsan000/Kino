import React, { useState } from 'react';
import { Mail, Phone, Send, X, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { telegramService } from '../services/telegramService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('Taklif va Fikrlar');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    setLoading(true);
    const fullMessage = `[Mavzu: ${subject}]\n${message.trim()}`;
    await telegramService.notifyContactMessage(name.trim(), contact.trim(), fullMessage);
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      setName('');
      setContact('');
      setMessage('');
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0e0f14] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/25">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Biz Bilan Bog'lanish</h3>
            <p className="text-xs text-slate-400">Xabaringiz to'g'ridan-to'g'ri admin Telegramiga yuboriladi</p>
          </div>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Xabaringiz Qabul Qilindi!</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Murojaatingiz uchun rahmat. Tez orada admin siz bilan bog'lanadi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ismingiz *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telegram yoki Telefon *
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="@username yoki +998..."
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Murojaat Mavzusi
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Taklif va Fikrlar" className="bg-[#0e0f14]">Taklif va Fikrlar</option>
                <option value="Kino Buyurtmasi" className="bg-[#0e0f14]">Kino qo'shishni so'rash (Buyurtma)</option>
                <option value="Saytda Xatolik" className="bg-[#0e0f14]">Saytda xatolik topdim</option>
                <option value="Hamkorlik va Reklama" className="bg-[#0e0f14]">Hamkorlik va Reklama</option>
                <option value="Boshqa" className="bg-[#0e0f14]">Boshqa masala</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Xabar Matni *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Fikringiz, savolingiz yoki xabaringizni batafsil yozing..."
                className="w-full px-3.5 py-2.5 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Xabarni Yuborish
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
