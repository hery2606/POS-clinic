'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, Zap } from 'lucide-react';
import { logActivity } from '@/features/analitik/utils/activityLogger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export const ChangePasswordSection = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const getErrors = (pwd: string) => [
    pwd.length < 8 && 'Minimal 8 karakter',
    !/[A-Z]/.test(pwd) && 'Minimal 1 huruf besar (A-Z)',
    !/[0-9]/.test(pwd) && 'Minimal 1 angka (0-9)',
    !/[!@#$%^&*]/.test(pwd) && 'Minimal 1 karakter spesial (!@#$%^&*)'
  ].filter(Boolean) as string[];

  const valErrs = form.newPassword ? getErrors(form.newPassword) : [];
  const strength = form.newPassword ? (4 - valErrs.length) * 25 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = [];
    if (!form.currentPassword) errs.push('Password saat ini harus diisi');
    if (!form.newPassword) errs.push('Password baru harus diisi');
    if (form.newPassword !== form.confirmPassword) errs.push('Password tidak cocok');
    errs.push(...valErrs);

    if (errs.length) return setErrors(errs);
    setErrors([]); setStatus('loading');
    
    try {
      await new Promise(r => setTimeout(r, 1000));
      setStatus('success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setStatus('idle'), 3000);
      logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', detail: 'Berhasil mengubah password', target_name: 'Account' });
    } catch (e) {
      setErrors(['Gagal mengubah password']);
      logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', status: 'FAILED', error_message: 'Gagal mengubah password', detail: 'Gagal mengubah password', target_name: 'Account' });
      setStatus('idle');
    }
  };

  const inputs = [
    { id: 'currentPassword', label: 'Password Saat Ini', color: 'blue' },
    { id: 'newPassword', label: 'Password Baru', color: 'emerald' },
    { id: 'confirmPassword', label: 'Konfirmasi Password', color: 'violet' }
  ] as const;

  return (
    <div className="space-y-8">
      <div className="space-y-2"><div className="flex items-center gap-2"><Lock className="w-5 h-5 text-[#1B9C90]" /><h2 className="text-xl font-black text-[#13222D]">Ubah Password</h2></div><p className="text-sm text-[#67737C] sm:ml-7">Perbarui password akun admin Anda untuk menjaga keamanan tertinggi</p></div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {inputs.map(({ id, label, color }) => (
            <div key={id}>
              <label className="block text-sm font-bold text-[#13222D] mb-3">{label}<span className="text-red-500 ml-1">*</span></label>
              <div className="relative group">
                <Input type={showPwd[id] ? 'text' : 'password'} placeholder="••••••••" value={form[id]} onChange={e => { setForm(p => ({ ...p, [id]: e.target.value })); setStatus('idle'); }} className={`pr-10 bg-gradient-to-r from-${color}-50/50 to-transparent border border-[#DFE6EB] focus:border-[#1B9C90]`} />
                <button type="button" onClick={() => setShowPwd(p => ({ ...p, [id]: !p[id] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90]">{showPwd[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
          ))}
        </div>

        {form.newPassword && (
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-600" /><span className="text-xs font-bold text-blue-900">Kekuatan Password</span></div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${!valErrs.length ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{!valErrs.length ? 'Kuat' : 'Lemah'}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden"><div className={`h-full transition-all duration-300 rounded-full ${strength >= 75 ? 'bg-green-500' : strength >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${strength}%` }} /></div>
              </div>
              <div className="space-y-2">
                {[
                  { text: 'Minimal 8 karakter', check: form.newPassword.length >= 8 },
                  { text: 'Minimal 1 huruf besar (A-Z)', check: /[A-Z]/.test(form.newPassword) },
                  { text: 'Minimal 1 angka (0-9)', check: /[0-9]/.test(form.newPassword) },
                  { text: 'Minimal 1 karakter spesial (!@#$%^&*)', check: /[!@#$%^&*]/.test(form.newPassword) }
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${r.check ? 'bg-green-500 border-green-500' : 'border-blue-300 bg-transparent'}`}>{r.check && <CheckCircle className="w-3 h-3 text-white" />}</div>
                    <span className={`text-xs font-medium transition-colors ${r.check ? 'text-green-700' : 'text-blue-700'}`}>{r.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {errors.length > 0 && <div className="space-y-2">{errors.map((err, i) => <div key={i} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3"><AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /><span className="text-xs text-red-700 font-medium">{err}</span></div>)}</div>}
        {status === 'success' && <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /><div><p className="text-sm font-bold text-green-900">Password berhasil diperbarui!</p><p className="text-xs text-green-700 mt-1">Gunakan password ini untuk login berikutnya.</p></div></div>}

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#DFE6EB]">
          <Button type="submit" disabled={status === 'loading' || !form.currentPassword || !form.newPassword || !form.confirmPassword} className="w-full sm:w-auto bg-gradient-to-r from-[#1B9C90] to-[#157A6D] text-white font-bold disabled:opacity-50">
            {status === 'loading' ? <><div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Memproses...</> : <><Lock className="w-4 h-4 mr-2" />Perbarui Password</>}
          </Button>
          <Button type="button" variant="outline" onClick={() => { setForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setErrors([]); }} className="w-full sm:w-auto border-2">Batal</Button>
        </div>
      </form>

      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start gap-3"><AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-1" /><div><p className="text-xs font-bold text-amber-900 mb-2">💡 Tips Keamanan</p><ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside"><li>Gunakan kombinasi karakter yang kompleks</li><li>Jangan bagikan password Anda</li><li>Ubah berkala (minimal 3 bulan sekali)</li></ul></div></div>
        </CardContent>
      </Card>
    </div>
  );
};
