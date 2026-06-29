import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { settingService } from '@/features/analitik/services/setting.service';
import { logActivity } from '@/features/analitik/utils/activityLogger';

type AddUserModalProps = { isOpen: boolean; onClose: () => void; onUserAdded: (u: any) => void; existingUsersCount: number };

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded, existingUsersCount }) => {
  const [form, setForm] = useState({ name: '', emailPrefix: '', password: '', confirmPassword: '', role: 'KASIR' as 'SUPER_ADMIN' | 'KASIR' });
  const [showPwd, setShowPwd] = useState({ p: false, c: false });
  const [errs, setErrs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); setErrs([]); };

  const validate = () => {
    const e = [];
    if (!form.name.trim()) e.push('Nama wajib diisi');
    if (!form.emailPrefix.trim()) e.push('Username wajib diisi');
    else if (/[^a-zA-Z0-9._-]/.test(form.emailPrefix)) e.push('Username hanya boleh huruf, angka, titik, _, dan -');
    if (form.password.length < 6) e.push('Password minimal 6 karakter');
    if (form.password !== form.confirmPassword) e.push('Konfirmasi tidak cocok');
    return e;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const vErrs = validate();
    if (vErrs.length) return setErrs(vErrs);

    setStatus('saving'); setErrs([]); setMsg('');
    const email = `${form.emailPrefix.trim().toLowerCase()}@klinik.com`;

    try {
      const res = await settingService.createUser({ name: form.name, email, password: form.password, role: form.role });
      logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', detail: `Tambah user: ${form.name} (${email}) sbg ${form.role}`, target_name: 'User', target_id: res.user?.id });
      
      onUserAdded({ id: res.user?.id || `USR-${String(existingUsersCount + 1).padStart(3, '0')}`, name: res.user?.name || form.name, email: res.user?.email || email, role: res.user?.role || form.role, status: 'AKTIF', createdAt: new Date().toISOString().split('T')[0] });
      setMsg(res.message || 'User berhasil ditambahkan!'); setStatus('success');
      setForm({ name: '', emailPrefix: '', password: '', confirmPassword: '', role: 'KASIR' });
      setTimeout(() => { onClose(); setStatus('idle'); setMsg(''); }, 1500);
    } catch (err: any) {
      const m = err.response?.data?.message || err.message || 'Gagal menambahkan user.';
      setErrs([m]); setStatus('idle');
      logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', status: 'FAILED', detail: `Gagal tambah user: ${form.name}`, error_message: m, target_name: 'User' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#13222D]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[#DFE6EB] p-6 max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#DFE6EB] mb-6">
          <div className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-[#1B9C90]" /><h3 className="font-bold text-sm text-[#13222D]">Tambah Pengguna Baru</h3></div>
          <button onClick={onClose} className="p-1.5 text-[#67737C] hover:text-[#13222D] hover:bg-slate-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#13222D] mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
            <div className="relative"><User className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" /><Input type="text" placeholder="Masukkan nama lengkap" value={form.name} onChange={e => handleChange('name', e.target.value)} className="pl-9 h-10 bg-slate-50/50 border-[#DFE6EB] focus:border-[#1B9C90] rounded-xl text-xs font-semibold" /></div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#13222D] mb-1.5">Username Email <span className="text-red-500">*</span></label>
            <div className="relative flex items-center bg-slate-50/50 border border-[#DFE6EB] focus-within:border-[#1B9C90] rounded-xl overflow-hidden">
              <Mail className="w-4 h-4 text-[#67737C] ml-3 shrink-0" />
              <Input type="text" placeholder="contoh: budi" value={form.emailPrefix} onChange={e => handleChange('emailPrefix', e.target.value.trim().toLowerCase())} className="pl-2 border-0 bg-transparent focus-visible:ring-0 h-10 text-xs font-semibold flex-1 shadow-none" />
              <span className="bg-slate-100 border-l border-[#DFE6EB] px-3 h-10 flex items-center text-xs font-bold text-[#67737C] select-none shrink-0">@klinik.com</span>
            </div>
            <p className="text-[10px] text-[#67737C] mt-1">Hanya masukkan nama depan email.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#13222D] mb-1.5">Password Sementara <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input type={showPwd.p ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => handleChange('password', e.target.value)} className="pl-9 pr-10 h-10 bg-slate-50/50 border-[#DFE6EB] focus:border-[#1B9C90] rounded-xl text-xs font-semibold" />
                <button type="button" onClick={() => setShowPwd(p => ({ ...p, p: !p.p }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90]">{showPwd.p ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#13222D] mb-1.5">Konfirmasi Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" />
                <Input type={showPwd.c ? 'text' : 'password'} placeholder="••••••••" value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} className="pl-9 pr-10 h-10 bg-slate-50/50 border-[#DFE6EB] focus:border-[#1B9C90] rounded-xl text-xs font-semibold" />
                <button type="button" onClick={() => setShowPwd(p => ({ ...p, c: !p.c }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#67737C] hover:text-[#1B9C90]">{showPwd.c ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#13222D] mb-2">Pilih Hak Akses <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: 'SUPER_ADMIN', l: 'Super Admin', d: 'Akses penuh ke semua konfigurasi' }, { v: 'KASIR', l: 'Kasir / POS', d: 'Mencatat transaksi kasir' }].map(r => (
                <button type="button" key={r.v} onClick={() => handleChange('role', r.v)} className={`flex flex-col text-left p-3 rounded-xl border transition-all ${form.role === r.v ? 'border-[#1B9C90] bg-[#1B9C90]/5' : 'border-[#DFE6EB] hover:bg-slate-50'}`}>
                  <span className={`text-[11px] font-bold ${form.role === r.v ? 'text-[#1B9C90]' : 'text-[#13222D]'}`}>{r.l}</span><span className="text-[9px] text-[#67737C] mt-0.5 leading-tight">{r.d}</span>
                </button>
              ))}
            </div>
          </div>

          {errs.length > 0 && <div className="space-y-1 pt-2">{errs.map((e, i) => <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-start gap-2"><AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" /><span className="text-[10px] text-red-700 font-semibold">{e}</span></div>)}</div>}
          {status === 'success' && <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2 pt-2"><CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" /><span className="text-[10px] text-green-700 font-semibold">{msg}</span></div>}

          <div className="flex gap-2 pt-4 border-t border-[#DFE6EB] mt-6">
            <Button type="submit" disabled={status === 'saving' || !form.name || !form.emailPrefix || !form.password || !form.confirmPassword} className="flex-1 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-10 text-xs rounded-xl">
              {status === 'saving' ? 'Menyimpan...' : 'Simpan User'}
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 border-2 border-[#DFE6EB] h-10 text-xs rounded-xl hover:bg-slate-50">Batal</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
