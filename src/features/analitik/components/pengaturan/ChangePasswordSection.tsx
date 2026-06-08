'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export const ChangePasswordSection = () => {
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) errors.push('Minimal 8 karakter');
    if (!/[A-Z]/.test(password)) errors.push('Minimal 1 huruf besar');
    if (!/[0-9]/.test(password)) errors.push('Minimal 1 angka');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Minimal 1 karakter spesial (!@#$%^&*)');
    
    return errors;
  };

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: ValidationError[] = [];

    // Validasi
    if (!formData.currentPassword) {
      newErrors.push({ field: 'currentPassword', message: 'Password saat ini harus diisi' });
    }
    if (!formData.newPassword) {
      newErrors.push({ field: 'newPassword', message: 'Password baru harus diisi' });
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.push({ field: 'confirmPassword', message: 'Password tidak cocok' });
    }

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      newErrors.push({ field: 'newPassword', message: passwordErrors.join(', ') });
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulasi API call
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors([{ field: 'submit', message: 'Gagal mengubah password' }]);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.newPassword 
    ? validatePassword(formData.newPassword).length === 0 
      ? 'Kuat'
      : 'Lemah'
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#13222D] mb-2">Ubah Password</h2>
        <p className="text-sm text-[#67737C]">Perbarui password akun admin Anda untuk menjaga keamanan</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-[#13222D] mb-2">
            Password Saat Ini
          </label>
          <div className="relative">
            <Input
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Masukkan password saat ini"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C]"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-[#13222D] mb-2">
            Password Baru
          </label>
          <div className="relative">
            <Input
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="Masukkan password baru"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C]"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#13222D] mb-2">
            Konfirmasi Password
          </label>
          <div className="relative">
            <Input
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Ulangi password baru"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C]"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        {formData.newPassword && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">Persyaratan Password:</span>
            </div>
            <div className="text-xs space-y-1 ml-6">
              {[
                { text: 'Minimal 8 karakter', check: formData.newPassword.length >= 8 },
                { text: 'Minimal 1 huruf besar', check: /[A-Z]/.test(formData.newPassword) },
                { text: 'Minimal 1 angka', check: /[0-9]/.test(formData.newPassword) },
                { text: 'Minimal 1 karakter spesial', check: /[!@#$%^&*]/.test(formData.newPassword) }
              ].map((req, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${req.check ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${req.check ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                    {req.check && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  {req.text}
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs font-medium">
              <span className={`px-2 py-1 rounded ${passwordStrength === 'Kuat' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                Kekuatan: {passwordStrength}
              </span>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
            {errors.map((error, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-red-700">{error.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-green-700">Password berhasil diubah</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            className="bg-[#1B9C90] hover:bg-[#157A6D] text-white"
          >
            {loading ? 'Memproses...' : 'Ubah Password'}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setErrors([]);
            }}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
};
