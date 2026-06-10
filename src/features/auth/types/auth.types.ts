export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'KASIR' | 'SUPER_ADMIN' | 'admin' | 'kasir' | 'dokter';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}
