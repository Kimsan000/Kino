const STORAGE_KEY_BOT_TOKEN = 'kinoman_tg_bot_token';
const STORAGE_KEY_CHAT_ID = 'kinoman_tg_chat_id';
const STORAGE_KEY_TG_ENABLED = 'kinoman_tg_enabled';

// Standart (ulangan) Telegram Bot va Chat ID
const DEFAULT_BOT_TOKEN = '8928954244:AAGwjRUhf_bsrY7XTvK80CDJdcGJP351mkw';
const DEFAULT_CHAT_ID = '7266374035';

export const telegramService = {
  getConfig(): { botToken: string; chatId: string; enabled: boolean } {
    if (typeof window === 'undefined') {
      return { botToken: DEFAULT_BOT_TOKEN, chatId: DEFAULT_CHAT_ID, enabled: true };
    }
    const botToken = localStorage.getItem(STORAGE_KEY_BOT_TOKEN) || DEFAULT_BOT_TOKEN;
    const chatId = localStorage.getItem(STORAGE_KEY_CHAT_ID) || DEFAULT_CHAT_ID;
    const enabled = localStorage.getItem(STORAGE_KEY_TG_ENABLED) !== 'false';
    return { botToken, chatId, enabled };
  },

  saveConfig(botToken: string, chatId: string, enabled: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_BOT_TOKEN, botToken.trim() || DEFAULT_BOT_TOKEN);
      localStorage.setItem(STORAGE_KEY_CHAT_ID, chatId.trim() || DEFAULT_CHAT_ID);
      localStorage.setItem(STORAGE_KEY_TG_ENABLED, enabled ? 'true' : 'false');
    }
  },

  async sendMessage(text: string): Promise<boolean> {
    const { botToken, chatId, enabled } = this.getConfig();
    if (!enabled || !botToken || !chatId) return false;

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      return Boolean(data.ok);
    } catch (err) {
      console.warn('Telegram bildirishnoma yuborishda xatolik:', err);
      return false;
    }
  },

  // 1. Yangi sharh qoldirilganda
  async notifyNewReview(movieTitle: string, author: string, rating: number, comment: string): Promise<void> {
    const text = `💬 <b>KINOMAN: Yangi Sharh Qoldirildi!</b>\n\n` +
      `🎬 <b>Film:</b> ${movieTitle}\n` +
      `👤 <b>Foydalanuvchi:</b> ${author}\n` +
      `⭐ <b>Baho:</b> ${rating} / 10\n` +
      `📝 <b>Fikr:</b> <i>"${comment}"</i>\n\n` +
      `⏰ <i>${new Date().toLocaleString('uz-UZ')}</i>`;

    await this.sendMessage(text);
  },

  // 2. Admin tizimga kirganda
  async notifyAdminLogin(username: string): Promise<void> {
    const text = `🔐 <b>KINOMAN: Admin Tizimga Kirdi!</b>\n\n` +
      `👤 <b>Admin Login:</b> <code>${username}</code>\n` +
      `⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}\n` +
      `🌐 <b>Status:</b> Muvaffaqiyatli avtorizatsiya`;

    await this.sendMessage(text);
  },

  // 3. Yangi kino qo'shilganda
  async notifyNewMovie(title: string, year: number, rating: number, genres: string[]): Promise<void> {
    const text = `🎬 <b>KINOMAN: Yangi Kino Qo'shildi!</b>\n\n` +
      `📌 <b>Nomi:</b> ${title}\n` +
      `📅 <b>Yili:</b> ${year} | ⭐ <b>IMDb:</b> ${rating}\n` +
      `📂 <b>Janrlar:</b> ${genres.join(', ')}\n\n` +
      `⏰ <i>${new Date().toLocaleString('uz-UZ')}</i>`;

    await this.sendMessage(text);
  },

  // 4. Kino o'chirilganda
  async notifyMovieDeleted(title: string): Promise<void> {
    const text = `🗑️ <b>KINOMAN: Film O'chirildi!</b>\n\n` +
      `⚠️ <b>Film nomi:</b> <s>${title}</s>\n` +
      `⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;

    await this.sendMessage(text);
  },

  // 5. Biz bilan bog'lanish (Murojaat xabari)
  async notifyContactMessage(name: string, contact: string, message: string): Promise<boolean> {
    const text = `📬 <b>KINOMAN: Yangi Murojaat!</b>\n\n` +
      `👤 <b>Ism:</b> ${name}\n` +
      `📞 <b>Aloqa / Telegram:</b> ${contact}\n` +
      `📝 <b>Xabar:</b> <i>"${message}"</i>\n\n` +
      `⏰ <i>${new Date().toLocaleString('uz-UZ')}</i>`;

    return await this.sendMessage(text);
  },

  // 6. Test xabar yuborish
  async sendTestNotification(): Promise<{ success: boolean; message: string }> {
    const success = await this.sendMessage(
      `🔔 <b>KINOMAN UZ: Test Xabarnomasi</b>\n\n` +
      `Telegram bot sayt bilan 100% muvaffaqiyatli bog'langan! Barcha xabarnomalar faol ishlamoqda.`
    );

    if (success) {
      return { success: true, message: 'Telegramga test xabar muvaffaqiyatli bordi!' };
    }
    return { success: false, message: 'Xabar yuborishda xatolik yuz berdi. Bot Token yoki Chat ID ni tekshiring.' };
  }
};

