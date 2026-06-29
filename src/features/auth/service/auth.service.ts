import type { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import { secureStorage, useAuthStore } from '../store/authStore';

// Demo users untuk development
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@klinik.com': {
    password: 'password123',
    user: {
      id: '194dbfd8-6229-4633-9a8e-aad2e49c6675',
      email: 'admin@klinik.com',
      name: 'Admin Banani',
      role: 'SUPER_ADMIN',
    },
  },
  'kasir@klinik.com': {
    password: 'password123',
    user: {
      id: '294dbfd8-6229-4633-9a8e-aad2e49c6676',
      email: 'kasir@klinik.com',
      name: 'Kasir Satu',
      role: 'KASIR',
    },
  },
};

class AuthService {
  private static readonly API_INTERNAL_URL = import.meta.env.VITE_API_INTERNAL_URL || 'http://localhost:3000';
  private static readonly USE_DEMO = false;

  // ── SECURITY THREAT DETECTION ──────────────────────────────────────
  // Deteksi percobaan injeksi / serangan sebelum request ke API
  private static detectSecurityThreat(input: string): { detected: boolean; type: string; detail: string } {
    const checks = [
      {
        type: 'SQL Injection',
        // Pola umum SQL injection
        pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR|AND|EXEC|EXECUTE|CAST|CONVERT|DECLARE|WHERE|FROM|TABLE|DATABASE|SCHEMA)\b.*['"\-;])|('\s*(OR|AND)\s*'?\d)|(-{2,})|(\/\*[\s\S]*?\*\/)|(%27|%22|%2D%2D)/i,
        detail: 'Terdeteksi pola SQL Injection pada input login'
      },
      {
        type: 'XSS',
        // Pola Cross-Site Scripting
        pattern: /(<script[\s\S]*?>|<\/script>|javascript\s*:|on\w+\s*=|<iframe|<img[^>]+src\s*=\s*["']?javascript:|alert\s*\(|document\.cookie|eval\s*\(|expression\s*\()/i,
        detail: 'Terdeteksi pola XSS pada input login'
      },
      {
        type: 'Command Injection',
        // Pola command injection dan path traversal
        pattern: /([|&;`$]|\$\(|\|\||&&|\.\.\/|\.\.\\|%2e%2e|\x00|\\x00)/i,
        detail: 'Terdeteksi pola Command Injection atau Path Traversal pada input login'
      },
      {
        type: 'File Injection',
        // Pola sisipan file atau ekstensi berbahaya
        pattern: /(\.php|\.asp|\.aspx|\.jsp|\.exe|\.sh|\.bat|\.cmd|\.ps1|<\?php|%3C%3Fphp)/i,
        detail: 'Terdeteksi penyisipan file berbahaya pada input login'
      },
      {
        type: 'LDAP Injection',
        pattern: /([*)(|\\]|\(\||&\(|\)\()/,
        detail: 'Terdeteksi pola LDAP Injection pada input login'
      }
    ];

    for (const check of checks) {
      if (check.pattern.test(input)) {
        return { detected: true, type: check.type, detail: check.detail };
      }
    }
    return { detected: false, type: '', detail: '' };
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // ── CEK ANCAMAN KEAMANAN TERLEBIH DAHULU ──
    const emailThreat = this.detectSecurityThreat(credentials.email);
    const passwordThreat = this.detectSecurityThreat(credentials.password);
    const threat = emailThreat.detected ? emailThreat : passwordThreat;

    if (threat.detected) {
      // Log ancaman dan TOLAK request — jangan kirim ke API
      import('@/features/analitik/utils/activityLogger').then(m => {
        m.logActivity({
          action: 'LOGIN',
          module: 'AUTH',
          status: 'FAILED',
          detail: `[SECURITY ALERT] ${threat.type}: ${threat.detail}. Input email: ${credentials.email.slice(0, 50)}`,
          error_message: `Percobaan ${threat.type} terdeteksi dan diblokir`,
          target_name: 'Sistem Klinik',
          userOverride: {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'ATTACKER',
            email: credentials.email.slice(0, 100),
            role: 'UNKNOWN'
          }
        });
      });
      throw new Error('Email atau password yang Anda masukkan salah.');
    }

    try {
      let response: AuthResponse;

      if (this.USE_DEMO) {
        // Use demo authentication
        response = await this.demoLogin(credentials);
      } else {
        // Use real API
        response = await this.apiLogin(credentials);
      }

      // Store token - gunakan access_token dari API response
      const token = response.access_token;
      if (credentials.remember) {
        secureStorage.setItem('authToken', token, false);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        secureStorage.setItem('authToken', token, true);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }

      // Sync to Zustand store
      useAuthStore.getState().setAuthToken(token);

      if (response.user.role === 'SUPER_ADMIN') {
        import('@/features/analitik/utils/activityLogger').then(m => {
          m.logActivity({
            action: 'LOGIN',
            module: 'AUTH',
            target_name: 'Sistem Klinik',
            target_id: 'SYS-001',
            detail: 'Super Admin berhasil login ke sistem',
            userOverride: response.user
          });
        });
      }

      return response;
    } catch (error: any) {
      // Log login GAGAL — gunakan email dari input sebagai identifier
      import('@/features/analitik/utils/activityLogger').then(m => {
        m.logActivity({
          action: 'LOGIN',
          module: 'AUTH',
          status: 'FAILED',
          detail: `Percobaan login gagal untuk email: ${credentials.email}`,
          error_message: error?.message || 'Login gagal',
          target_name: 'Sistem Klinik',
          userOverride: {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'Unknown',
            email: credentials.email,
            role: 'UNKNOWN'
          }
        });
      });
      throw error;
    }
  }

  private static async demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const email = credentials.email.toLowerCase().trim();
    const demoUser = DEMO_USERS[email];

    if (!demoUser) {
      throw new Error('Email atau Username tidak terdaftar');
    }

    if (demoUser.password !== credentials.password) {
      throw new Error('Password salah');
    }

    // Generate demo token
    const access_token = `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      message: 'Login berhasil',
      access_token,
      user: demoUser.user,
    };
  }

  private static async apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.API_INTERNAL_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login gagal');
    }

    const data = await response.json();
    return data;
  }

  static logout(): void {
    const user = this.getUser();
    if (user && user.role === 'SUPER_ADMIN') {
      import('@/features/analitik/utils/activityLogger').then(m => {
        m.logActivity({
          action: 'LOGOUT',
          module: 'AUTH',
          target_name: 'Sistem Klinik',
          target_id: 'SYS-001',
          detail: 'Super Admin berhasil logout dari sistem',
          userOverride: user
        });
      });
    }

    secureStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    useAuthStore.getState().clearTokens();
  }

  static getToken(): string | null {
    return useAuthStore.getState().authToken || secureStorage.getItem('authToken');
  }

  static getUser() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default AuthService;
