const STORAGE_ADMIN_LOGIN = 'kinoman_admin_username';
const STORAGE_ADMIN_PASS = 'kinoman_admin_password';
const STORAGE_AUTH_SESSION = 'kinoman_admin_session';

// Standart (Boshlang'ich) maxfiy login va parol
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'kino2026admin!';

export const authService = {
  getCredentials(): { username: string } {
    const username = localStorage.getItem(STORAGE_ADMIN_LOGIN) || DEFAULT_USERNAME;
    return { username };
  },

  login(usernameInput: string, passwordInput: string): boolean {
    const savedUsername = localStorage.getItem(STORAGE_ADMIN_LOGIN) || DEFAULT_USERNAME;
    const savedPassword = localStorage.getItem(STORAGE_ADMIN_PASS) || DEFAULT_PASSWORD;

    if (
      usernameInput.trim() === savedUsername &&
      passwordInput.trim() === savedPassword
    ) {
      sessionStorage.setItem(STORAGE_AUTH_SESSION, 'true');
      return true;
    }
    return false;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(STORAGE_AUTH_SESSION) === 'true';
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_AUTH_SESSION);
    }
  },

  changeCredentials(
    currentPassword: string,
    newUsername: string,
    newPassword: string
  ): { success: boolean; message: string } {
    const savedPassword = localStorage.getItem(STORAGE_ADMIN_PASS) || DEFAULT_PASSWORD;

    if (currentPassword !== savedPassword) {
      return { success: false, message: 'Hozirgi parol noto\'g\'ri kiritildi!' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak!' };
    }

    if (newUsername.trim()) {
      localStorage.setItem(STORAGE_ADMIN_LOGIN, newUsername.trim());
    }
    localStorage.setItem(STORAGE_ADMIN_PASS, newPassword.trim());

    return { success: true, message: 'Login va parol muvaffaqiyatli yangilandi!' };
  }
};

