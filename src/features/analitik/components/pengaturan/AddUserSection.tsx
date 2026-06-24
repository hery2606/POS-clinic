'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, UserPlus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { settingService } from '@/features/analitik/services/setting.service';
import type { CreateUserRequest } from '@/features/analitik/types/setting.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ValidationError {
  field: string;
  message: string;
}

export const AddUserSection = () => {
  const { user } = useAuth();

  // Membatasi akses: Hanya SUPER_ADMIN yang bisa melihat dan menambah user
  if (user?.role?.toUpperCase() !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5 border-4 border-red-100">
          <Shield className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-2xl font-black text-[#13222D] mb-3">Akses Ditolak</h3>
        <p className="text-[#67737C] text-sm max-w-sm leading-relaxed">
          Maaf, fitur manajemen dan penambahan User baru hanya dapat diakses oleh akun dengan level otoritas <span className="font-bold text-[#13222D] bg-slate-100 px-1.5 py-0.5 rounded">SUPER ADMIN</span>.
        </p>
      </div>
    );
  }

  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'SUPER_ADMIN' // Default role
  });

  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Akses penuh ke semua fitur dan pengaturan.' },
    { value: 'KASIR', label: 'Kasir', description: 'Akses ke modul kasir dan transaksi POS harian.' },
  ];

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccessMessage(null);
  };

  const validateForm = (): ValidationError[] => {
    const newErrors: ValidationError[] = [];
    
    if (!formData.name.trim()) newErrors.push({ field: 'name', message: 'Nama lengkap wajib diisi' });
    if (!formData.email.trim()) newErrors.push({ field: 'email', message: 'Email wajib diisi' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.push({ field: 'email', message: 'Format email tidak valid' });
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password minimal 6 karakter' });
    }
    
    if (!formData.role) newErrors.push({ field: 'role', message: 'Role wajib dipilih' });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccessMessage(null);

    try {
      const response = await settingService.createUser(formData);
      setSuccessMessage(response.message || 'User berhasil dibuat!');
      setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Gagal menambahkan user baru.';
      setErrors([{ field: 'submit', message: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#1B9C90]" />
          <h2 className="text-xl font-black text-[#13222D]">Tambah User Baru</h2>
        </div>
        <p className="text-sm text-[#67737C] sm:ml-7 ml-0">
          Tambahkan akun staf baru (Admin/Kasir) ke dalam sistem dan atur hak akses mereka.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-slate-50/50 border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-2 focus:ring-[#1B9C90]/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-2">
              Alamat Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="admin@klinik.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-slate-50/50 border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-2 focus:ring-[#1B9C90]/20"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-2">
              Password Sementara <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pr-10 bg-slate-50/50 border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-2 focus:ring-[#1B9C90]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-[#67737C] mt-1.5">Minimal 6 karakter. User disarankan mengubah password setelah login.</p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-3">
              Hak Akses (Role) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <button
                  type="button"
                  key={role.value}
                  onClick={() => handleInputChange('role', role.value)}
                  className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                    formData.role === role.value 
                      ? 'border-[#1B9C90] bg-[#1B9C90]/5' 
                      : 'border-[#DFE6EB] bg-white hover:border-[#1B9C90]/30 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${formData.role === role.value ? 'text-[#1B9C90]' : 'text-[#13222D]'}`}>
                      {role.label}
                    </span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.role === role.value ? 'border-[#1B9C90]' : 'border-[#DFE6EB]'
                    }`}>
                      {formData.role === role.value && <div className="w-2 h-2 rounded-full bg-[#1B9C90]" />}
                    </div>
                  </div>
                  <span className="text-xs text-[#67737C] leading-relaxed">{role.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="text-xs text-red-700 font-medium">{error.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-900">Berhasil!</p>
              <p className="text-xs text-green-700 mt-1">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DFE6EB]">
          <Button 
            type="submit" 
            disabled={loading || !formData.name || !formData.email || !formData.password || !formData.role}
            className="w-full sm:w-auto bg-[#1B9C90] hover:bg-[#157A6D] text-white font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Menyimpan...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Buat User
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
              setErrors([]);
              setSuccessMessage(null);
            }}
            className="w-full sm:w-auto border-2 border-[#DFE6EB] hover:bg-[#F9FEFC]"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </div>
  );
};
