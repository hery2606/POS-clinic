import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { settingService } from '@/features/analitik/services/setting.service';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'KASIR';
  status: 'AKTIF' | 'NONAKTIF';
  createdAt: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: UserItem) => void;
  existingUsersCount: number;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onUserAdded,
  existingUsersCount
}) => {
  const [formData, setFormData] = useState({
    name: '',
    emailPrefix: '',
    password: '',
    confirmPassword: '',
    role: 'KASIR' as 'SUPER_ADMIN' | 'KASIR'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ field: string; message: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors([]);
  };

  const validateForm = () => {
    const errors: { field: string; message: string }[] = [];
    if (!formData.name.trim()) errors.push({ field: 'name', message: 'Nama lengkap wajib diisi' });
    
    if (!formData.emailPrefix.trim()) {
      errors.push({ field: 'emailPrefix', message: 'Username email wajib diisi' });
    } else if (/[^a-zA-Z0-9._-]/.test(formData.emailPrefix)) {
      errors.push({ field: 'emailPrefix', message: 'Username email hanya boleh berisi huruf, angka, titik (.), underscore (_), dan minus (-)' });
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.push({ field: 'password', message: 'Password minimal 6 karakter' });
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Konfirmasi password tidak cocok' });
    }
    return errors;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSaving(true);
    setFormErrors([]);
    setSuccessMsg(null);

    const fullEmail = `${formData.emailPrefix.trim().toLowerCase()}@klinik.com`;

    try {
      const response = await settingService.createUser({
        name: formData.name,
        email: fullEmail,
        password: formData.password,
        role: formData.role
      });

      const newUser: UserItem = {
        id: response.user?.id || `USR-${String(existingUsersCount + 1).padStart(3, '0')}`,
        name: response.user?.name || formData.name,
        email: response.user?.email || fullEmail,
        role: (response.user?.role as 'SUPER_ADMIN' | 'KASIR') || formData.role,
        status: 'AKTIF',
        createdAt: new Date().toISOString().split('T')[0]
      };

      onUserAdded(newUser);
      setSuccessMsg(response.message || 'User baru berhasil ditambahkan!');

      // Reset Form
      setFormData({
        name: '',
        emailPrefix: '',
        password: '',
        confirmPassword: '',
        role: 'KASIR'
      });

      // Close modal after delay
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Gagal menambahkan user baru.';
      setFormErrors([{ field: 'submit', message: errorMsg }]);
    } finally {
      setIsSaving(false);
    }
  };

  const roleOptions = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Akses penuh ke semua konfigurasi sistem' },
    { value: 'KASIR', label: 'Kasir / POS', desc: 'Mencatat transaksi dan pembayaran kasir' }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#13222D]/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#DFE6EB] p-6 max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DFE6EB] mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#1B9C90]" />
            <h3 className="font-bold text-sm text-[#13222D]">Tambah Pengguna Baru</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-[#67737C] hover:text-[#13222D] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleCreateUser} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-[#13222D] mb-1.5">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="pl-9 h-10 bg-slate-50/50 border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-1 focus:ring-[#1B9C90] rounded-xl text-xs font-semibold text-[#13222D]"
              />
            </div>
          </div>

          {/* EmailPrefix / Username */}
          <div>
            <label className="block text-xs font-bold text-[#13222D] mb-1.5">
              Username Email <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center bg-slate-50/50 border border-[#DFE6EB] focus-within:border-[#1B9C90] focus-within:ring-1 focus-within:ring-[#1B9C90] rounded-xl overflow-hidden">
              <Mail className="w-4 h-4 text-[#67737C] ml-3 shrink-0" />
              <Input
                type="text"
                placeholder="contoh: budi"
                value={formData.emailPrefix}
                onChange={(e) => handleInputChange('emailPrefix', e.target.value.trim().toLowerCase())}
                className="pl-2 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none h-10 text-xs font-semibold text-[#13222D] flex-1 shadow-none"
              />
              <span className="bg-slate-100 border-l border-[#DFE6EB] px-3 h-10 flex items-center text-xs font-bold text-[#67737C] select-none shrink-0">
                @klinik.com
              </span>
            </div>
            <p className="text-[10px] text-[#67737C] mt-1">Hanya masukkan nama depan email (akhiran otomatis @klinik.com).</p>
          </div>

          {/* Grid Layout for Passwords to keep the modal compact but wide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#13222D] mb-1.5">
                Password Sementara <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-9 pr-10 h-10 bg-slate-50/50 border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-1 focus:ring-[#1B9C90] rounded-xl text-xs font-semibold text-[#13222D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#67737C] mt-1">Minimal 6 karakter.</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#13222D] mb-1.5">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-9 pr-10 h-10 bg-slate-50/50 border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-1 focus:ring-[#1B9C90] rounded-xl text-xs font-semibold text-[#13222D]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#67737C] mt-1">Ulangi password di sebelah kiri.</p>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-[#13222D] mb-2">
              Pilih Hak Akses (Role) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((role) => (
                <button
                  type="button"
                  key={role.value}
                  onClick={() => handleInputChange('role', role.value)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                    formData.role === role.value 
                      ? 'border-[#1B9C90] bg-[#1B9C90]/5' 
                      : 'border-[#DFE6EB] bg-white hover:border-[#1B9C90]/30 hover:bg-slate-50/50'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${formData.role === role.value ? 'text-[#1B9C90]' : 'text-[#13222D]'}`}>
                    {role.label}
                  </span>
                  <span className="text-[9px] text-[#67737C] mt-0.5 leading-tight">{role.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Messages */}
          {formErrors.length > 0 && (
            <div className="space-y-1 pt-2">
              {formErrors.map((error, idx) => (
                <div key={idx} className="bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-red-700 font-semibold">{error.message}</span>
                </div>
              ))}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2 pt-2">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span className="text-[10px] text-green-700 font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-[#DFE6EB] mt-6">
            <Button
              type="submit"
              disabled={isSaving || !formData.name || !formData.emailPrefix || !formData.password || !formData.confirmPassword}
              className="flex-1 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-10 text-xs rounded-xl"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan User'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-[#DFE6EB] h-10 text-xs rounded-xl hover:bg-slate-50"
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
