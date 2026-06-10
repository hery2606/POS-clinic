import type { LoginCredentials, AuthResponse, User } from '../types/auth.types';

// Demo users untuk development
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@klinik.com': {
    password: 'password123',
    user: {
      id: '1',
      email: 'admin@klinik.com',
      name: 'Admin Banani',
      role: 'admin',
    },
  },
  'kasir@klinik.com': {
    password: 'password123',
    user: {
      id: '2',
      email: 'kasir@klinik.com',
      name: 'Kasir Satu',
      role: 'KASIR',
    },
  },
};

class AuthService {
  private static readonly API_INTERNAL_URL = import.meta.env.VITE_API_INTERNAL_URL || 'http://localhost:3000';
  private static readonly USE_DEMO = false; // Toggle untuk demo mode (false = gunakan API real)

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
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
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
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
