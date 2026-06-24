import type { LoginCredentials } from '../types/auth.types';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, Info, User, CheckCircle2 } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error = null 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    remember: false,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setValidationError(null);
  };

  const handleDemoCredentialClick = (email: string, password: string) => {
    setCredentials(prev => ({
      ...prev,
      email,
      password,
    }));
    setValidationError(null);
  };

  const validateForm = (): boolean => {
    if (!credentials.email.trim()) {
      setValidationError('Email atau Username wajib diisi');
      return false;
    }
    if (!credentials.password) {
      setValidationError('Password wajib diisi');
      return false;
    }
    if (credentials.password.length < 6) {
      setValidationError('Password minimal 6 karakter');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(credentials);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      {/* MAIN CARD CONTAINER */}
      <div className="w-full max-w-3xl bg-white rounded-[24px] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-10 min-h-[500px] border border-[#DFE6EB]">
        
        {/* LEFT SIDE - BRANDING (4 COLUMNS) */}
        <div className="md:col-span-4 bg-[#25323C] p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1.5">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231B9C90' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' /%3E%3Cpath d='M12 8v8M8 12h8' /%3E%3C/svg%3E"
                  alt="Medical Logo" 
                  className="w-full h-full "
                />
              </div>
              <span className="font-black text-white text-base tracking-tight">KLINIK POS</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-[9px] font-black text-white mb-6 border border-white/20 uppercase tracking-widest">
              <CheckCircle2 className="w-2.5 h-2.5" />
              SISTEM INTEGRASI
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-black text-white mb-4 leading-snug">
              Kelola Klinik & Apotek Lebih Cerdas.
            </h1>

            {/* Subtext */}
            <p className="text-white/80 text-[11px] font-semibold leading-relaxed max-w-[200px]">
              Sistem Point of Sale modern untuk mempercepat pelayanan medis dan real-time inventory.
            </p>
          </div>

          {/* Info Box Footer */}
          <div className="relative z-10 bg-black/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-6">
            <div className="flex gap-2 items-start">
              <div className="p-1 bg-white/15 rounded-lg shrink-0">
                <Info className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[10px] text-white/90 leading-normal">
                Gunakan kredensial terdaftar untuk masuk ke dashboard kasir atau admin.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM (6 COLUMNS) */}
        <div className="md:col-span-6 p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="mb-6 text-left">
              <h2 className="text-2xl font-black text-[#13222D] mb-1.5">Selamat Datang</h2>
              <p className="text-[#67737C] font-semibold text-xs leading-normal">
                Masukkan detail akun untuk mengakses dashboard POS.
              </p>
            </div>

            {/* Error Message */}
            {(error || validationError) && (
              <div className="mb-4 p-3 bg-[#E62C2C]/5 border border-[#E62C2C]/10 rounded-xl flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 bg-[#E62C2C] rounded-full animate-pulse shrink-0" />
                <p className="text-[11px] text-[#E62C2C] font-black">{error || validationError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#13222D] uppercase tracking-wider ml-1">
                  Email 
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="admin@klinik.com"
                    value={credentials.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 h-11 bg-[#EFF4F8]/40 border-[#DFE6EB] rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1B9C90]/15 focus:border-[#1B9C90] transition-all placeholder:text-[#67737C]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#13222D] uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 bg-[#EFF4F8]/40 border-[#DFE6EB] rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1B9C90]/15 focus:border-[#1B9C90] transition-all placeholder:text-[#67737C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#13222D] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-1 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={credentials.remember}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border-2 border-[#DFE6EB] rounded peer-checked:bg-[#1B9C90] peer-checked:border-[#1B9C90] transition-all" />
                    <CheckCircle2 className="absolute w-2.5 h-2.5 text-white scale-0 peer-checked:scale-100 transition-transform left-[2px] top-[2px]" />
                  </div>
                  <span className="text-[11px] font-black text-[#67737C] group-hover:text-[#13222D] transition-colors">Ingat Saya</span>
                </label>
                <a href="#" className="text-[11px] font-black text-[#1B9C90] hover:underline underline-offset-4">
                  Lupa Password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold rounded-xl text-xs shadow-md shadow-[#1B9C90]/15 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
                {!isLoading && <span className="text-sm">→</span>}
              </Button>
            </form>

            {/* Footer Support */}
            <div className="mt-6 text-center">
              <p className="text-[10px] font-black text-[#67737C]">
                Mengalami kendala? <span className="text-[#13222D] ml-0.5 cursor-pointer hover:underline">Hubungi IT Support</span>
              </p>
            </div>
            
            {/* Demo Button Container */}
            <div className="mt-5 flex flex-wrap justify-center gap-1.5">
               <button onClick={() => handleDemoCredentialClick('admin@klinik.com', 'password123')} className="text-[9px] px-2 py-1 bg-[#EFF4F8] text-[#67737C] rounded hover:bg-[#DFF6F2] hover:text-[#00736A] transition-colors font-bold uppercase tracking-tight border border-[#DFE6EB] cursor-pointer">Admin / Super Admin</button>
               <button onClick={() => handleDemoCredentialClick('kasir@klinik.com', 'password123')} className="text-[9px] px-2 py-1 bg-[#EFF4F8] text-[#67737C] rounded hover:bg-[#DFF6F2] hover:text-[#00736A] transition-colors font-bold uppercase tracking-tight border border-[#DFE6EB] cursor-pointer">Kasir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};