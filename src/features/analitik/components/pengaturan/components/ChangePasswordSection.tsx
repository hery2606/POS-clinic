'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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

  const strengthPercentage = formData.newPassword 
    ? ((4 - validatePassword(formData.newPassword).length) / 4) * 100 
    : 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#1B9C90]" />
          <h2 className="text-xl font-black text-[#13222D]">Ubah Password</h2>
        </div>
        <p className="text-sm text-[#67737C] sm:ml-7 ml-0">
          Perbarui password akun admin Anda untuk menjaga keamanan tertinggi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-3">
              Password Saat Ini
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="pr-10 bg-gradient-to-r from-blue-50/50 to-transparent border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-2 focus:ring-[#1B9C90]/20"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90] transition-colors"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-3">
              Password Baru
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="pr-10 bg-gradient-to-r from-emerald-50/50 to-transparent border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-2 focus:ring-[#1B9C90]/20"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90] transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-[#13222D] mb-3">
              Konfirmasi Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative group">
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pr-10 bg-gradient-to-r from-violet-50/50 to-transparent border border-[#DFE6EB] focus:border-[#1B9C90] focus:ring-2 focus:ring-[#1B9C90]/20"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90] transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Password Requirements Card */}
        {formData.newPassword && (
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-4">
              {/* Strength Indicator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">Kekuatan Password</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    passwordStrength === 'Kuat' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {passwordStrength}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      strengthPercentage >= 75 
                        ? 'bg-green-500' 
                        : strengthPercentage >= 50 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-2">
                {[
                  { text: 'Minimal 8 karakter', check: formData.newPassword.length >= 8 },
                  { text: 'Minimal 1 huruf besar (A-Z)', check: /[A-Z]/.test(formData.newPassword) },
                  { text: 'Minimal 1 angka (0-9)', check: /[0-9]/.test(formData.newPassword) },
                  { text: 'Minimal 1 karakter spesial (!@#$%^&*)', check: /[!@#$%^&*]/.test(formData.newPassword) }
                ].map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      req.check 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-blue-300 bg-transparent'
                    }`}>
                      {req.check && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-xs font-medium transition-colors ${
                      req.check ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-red-700 font-medium">{error.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-900">Password berhasil diperbarui!</p>
              <p className="text-xs text-green-700 mt-1">Password Anda akan digunakan untuk login berikutnya</p>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DFE6EB]">
          <Button 
            type="submit" 
            disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            className="w-full sm:w-auto bg-gradient-to-r from-[#1B9C90] to-[#157A6D] hover:from-[#157A6D] hover:to-[#0D5C54] text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Memproses...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Perbarui Password
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => {
              setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setErrors([]);
            }}
            className="w-full sm:w-auto border-2 border-[#DFE6EB] hover:bg-[#F9FEFC]"
          >
            Batal
          </Button>
        </div>
      </form>

      {/* Security Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs font-bold text-amber-900 mb-2">💡 Tips Keamanan</p>
              <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
                <li>Gunakan kombinasi karakter yang kompleks untuk keamanan maksimal</li>
                <li>Jangan bagikan password Anda kepada siapa pun</li>
                <li>Ubah password secara berkala (minimal 3 bulan sekali)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
