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
    <div className="min-h-screen bg-[#F9FEFC] flex items-center justify-center p-6 font-sans">
      {/* MAIN CARD CONTAINER */}
      <div className="w-full max-w-5xl bg-white rounded-[20px] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-10 min-h-[600px] border border-[#DFE6EB]">
        
        {/* LEFT SIDE - BRANDING (4 COLUMNS) */}
        <div className="lg:col-span-4 bg-[#25323C] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#25323C] rounded-full flex items-center justify-center">
                  <span className="text-[#25323C] font-bold text-lg">+</span>
                </div>
              </div>
              <span className="font-bold text-white text-xl tracking-tight">KLINIK PAYMENT</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-bold text-white mb-8 border border-white/30 uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" />
              SISTEM TERINTEGRASI
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold text-white mb-6 leading-[1.2]">
              Kelola Klinik & <br /> Apotek Lebih <br /> Cerdas.
            </h1>

            {/* Subtext */}
            <p className="text-white/90 text-sm font-medium leading-relaxed max-w-[280px]">
              Sistem Point of Sale modern untuk mempercepat pelayanan medis dan sinkronisasi inventori secara real-time.
            </p>
          </div>

          {/* Info Box Footer */}
          <div className="relative z-10 bg-black/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
            <div className="flex gap-3 items-start">
              <div className="p-1 bg-white/20 rounded-lg">
                <Info className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] text-white/90 leading-snug">
                Gunakan kredensial yang diberikan oleh administrator untuk masuk ke dalam sistem.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM (6 COLUMNS) */}
        <div className="lg:col-span-6 p-10 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="mb-10 text-left">
              <h2 className="text-4xl font-black text-[#13222D] mb-4">Selamat Datang</h2>
              <p className="text-[#67737C] font-medium text-sm leading-relaxed">
                Silakan masukkan detail akun Anda untuk mengakses sistem Banani.
              </p>
            </div>

            {/* Error Message */}
            {(error || validationError) && (
              <div className="mb-6 p-4 bg-[#E62C2C]/10 border border-[#E62C2C]/20 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-[#E62C2C] rounded-full animate-pulse" />
                <p className="text-xs text-[#E62C2C] font-bold">{error || validationError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#13222D] uppercase tracking-wider ml-1">
                  Email atau Username
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="admin@klinikbanani.com"
                    value={credentials.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-12 h-14 bg-[#EFF4F8]/50 border-[#DFE6EB] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#1B9C90]/20 focus:border-[#1B9C90] transition-all placeholder:text-[#67737C]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#13222D] uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-12 pr-12 h-14 bg-[#EFF4F8]/50 border-[#DFE6EB] rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#1B9C90]/20 focus:border-[#1B9C90] transition-all placeholder:text-[#67737C]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#13222D] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={credentials.remember}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#DFE6EB] rounded-md peer-checked:bg-[#1B9C90] peer-checked:border-[#1B9C90] transition-all" />
                    <CheckCircle2 className="absolute w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform left-[3px]" />
                  </div>
                  <span className="text-xs font-bold text-[#67737C] group-hover:text-[#13222D] transition-colors">Ingat Saya</span>
                </label>
                <a href="#" className="text-xs font-bold text-[#1B9C90] hover:underline underline-offset-4">
                  Lupa Password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#1B9C90] hover:opacity-90 text-white font-bold rounded-2xl text-base shadow-lg shadow-[#1B9C90]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
                {!isLoading && <span className="text-xl">→</span>}
              </Button>
            </form>

            {/* Footer Support */}
            <div className="mt-12 text-center">
              <p className="text-xs font-bold text-[#67737C]">
                Mengalami kendala? <span className="text-[#13222D] ml-1 cursor-pointer hover:underline">Hubungi Dukungan IT</span>
              </p>
            </div>
            
            {/* Demo Button Container */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <button onClick={() => handleDemoCredentialClick('admin@klinik.com', 'admin123')} className="text-[10px] px-2 py-1 bg-[#EFF4F8] text-[#67737C] rounded hover:bg-[#DFF6F2] hover:text-[#00736A] transition-colors font-bold uppercase tracking-tighter border border-[#DFE6EB]">Login Admin</button>
               <button onClick={() => handleDemoCredentialClick('kasir@klinik.com', 'kasir123')} className="text-[10px] px-2 py-1 bg-[#EFF4F8] text-[#67737C] rounded hover:bg-[#DFF6F2] hover:text-[#00736A] transition-colors font-bold uppercase tracking-tighter border border-[#DFE6EB]">Login Kasir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};