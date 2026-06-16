import { create } from 'zustand';

// Simple XOR + Base64 Obfuscation helper to secure tokens in storage
const STORAGE_KEY_SALT = "klinik-pos-qris-secure-salt-2026";

export const secureStorage = {
  setItem: (key: string, value: string, useSession = false) => {
    try {
      let obfuscated = "";
      for (let i = 0; i < value.length; i++) {
        const charCode = value.charCodeAt(i) ^ STORAGE_KEY_SALT.charCodeAt(i % STORAGE_KEY_SALT.length);
        obfuscated += String.fromCharCode(charCode);
      }
      const encoded = btoa(obfuscated);
      const storage = useSession ? sessionStorage : localStorage;
      storage.setItem(key, encoded);
    } catch (e) {
      console.error("Error setting secure item:", e);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const encoded = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!encoded) return null;
      const decoded = atob(encoded);
      let result = "";
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ STORAGE_KEY_SALT.charCodeAt(i % STORAGE_KEY_SALT.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (e) {
      return null;
    }
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
};

interface AuthState {
  rmeToken: string | null;
  authToken: string | null;
  setRmeToken: (token: string | null) => void;
  setAuthToken: (token: string | null) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  rmeToken: null,
  authToken: secureStorage.getItem('authToken'), // Auto-load authToken on startup
  setRmeToken: (token) => set({ rmeToken: token }),
  setAuthToken: (token) => set({ authToken: token }),
  clearTokens: () => set({ rmeToken: null, authToken: null }),
}));
