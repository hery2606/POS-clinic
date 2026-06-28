import type { AuthContextType, LoginCredentials, User } from '../types/auth.types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../service/auth.service';
import { initializeRmeAuth, initializeWarehouseAuth } from '@/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => AuthService.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const role = user.role?.toUpperCase();
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        initializeRmeAuth().catch(console.error);
      }
      if (role === 'KASIR') {
        initializeWarehouseAuth().catch(console.error);
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      
      const role = response.user.role?.toUpperCase();
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        initializeRmeAuth().catch(console.error);
      }
      if (role === 'KASIR') {
        initializeWarehouseAuth().catch(console.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login gagal';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
