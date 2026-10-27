import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 1,
    category: 'Tomosha',
    question: 'Saytdagi barcha kinolarni tomosha qilish bepulmi?',
    answer: 'Ha, KINOMAN UZ portalidagi barcha filmlar, treylerlar va premyeralar foydalanuvchilar uchun mutlaqo bepul taqdim etiladi. Hech qanday majburiy obuna yoki to\'lov talab qilinmaydi.',
  },
  {
    id: 2,
    category: 'Sifat',
    question: 'Kino sifati qanday va 4K format mavjudmi?',
    answer: 'Ha, filmlarimiz 4K Ultra HD, Full HD (1080p) va HD formatlarda namoyish etiladi. Har bir film kartochkasi va tafsilotlarida uning sifati (masalan, 4K HDR) ko\'rsatilgan.',
  },
  {
    id: 3,
    category: 'Buyurtma',
    question: 'O\'zim xohlagan yangi kinoni qanday buyurtma qilsam bo\'ladi?',
    answer: 'Buning uchun saytning yuqori qismidagi "Biz bilan bog\'lanish" tugmasini bosing va "Kino buyurtmasi" mavzusini tanlang. Siz so\'ragan film admin Telegram botiga darhol yetib boradi va tez fursatda saytga joylanadi.',
  },
  {
    id: 4,
    category: 'Qulaylik',
    question: 'Sevimlilar (Watchlist) ro\'yxati qanday ishlaydi?',
    answer: 'Istalgan film kartochkasidagi xatcho\'p (bookmark) belgisini bossangiz, film sizning "Sevimlilar" ro\'yxatingizga tushadi. Uni yuqori menyudagi "Sevimlilar" bo\'limidan istalgan payt ko\'rishingiz mumkin.',
  },
  {
    id: 5,
    category: 'Fikrlar',
    question: 'Saytda sharh qoldirish uchun ro\'yxatdan o\'tish shartmi?',
    answer: 'Yo\'q, shart emas! Film sahifasiga kirib, ismingiz va 1 dan 10 gacha bahoyingizni belgilab sharh qoldirishingiz mumkin. Fikringiz darhol admin nazoratiga ham yetkaziladi.',
  },
  {
    id: 6,
    category: 'Admin',
    question: 'Admin panelga kimlar kira oladi?',
    answer: 'Admin panel faqat tizim ma\'muri uchun mo\'ljallangan bo\'lib, maxfiy shifrlangan login va parol bilan himoyalangan. Begona foydalanuvchilar kira olmaydi.',
  },
];

interface FaqSectionProps {
  onOpenContact: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenContact }) => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
          <HelpCircle className="w-4 h-4" />
          Yordam Markazi
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Ko'p So'raladigan Savollar (FAQ)
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          KINOMAN UZ portali, kinolar sifati, buyurtma qilish va sayt imkoniyatlari bo'yicha eng muhim savollarga javoblar.
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen 
                  ? 'bg-white/[0.04] border-rose-500/30 shadow-lg shadow-rose-600/5' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>{item.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-rose-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed pl-10 border-t border-white/5 pt-3 animate-fade-in">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-red-950/20 to-black border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white">Savolingizga javob topmadingizmi?</h4>
          <p className="text-xs text-slate-400">Bizga to'g'ridan-to'g'ri xabar yuboring, tezda javob beramiz.</p>
        </div>

        <button
          onClick={onOpenContact}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          Biz bilan bog'lanish
        </button>
      </div>
    </div>
  );
};
