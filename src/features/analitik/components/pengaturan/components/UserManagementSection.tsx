'use client';

import { useState } from 'react';
import { Search, Plus, Trash2, Shield, UserPlus, Power, ChevronDown, AlertCircle } from 'lucide-react';
import { logActivity } from '@/features/analitik/utils/activityLogger';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AddUserModal } from './modals/AddUserModal';
import { DeleteUserModal } from './modals/DeleteUserModal';

type UserItem = { id: string; name: string; email: string; role: string; status: string; createdAt: string };

const INITIAL_USERS: UserItem[] = [
  { id: 'USR-001', name: 'Hery POS', email: 'hery@klinik.com', role: 'SUPER_ADMIN', status: 'AKTIF', createdAt: '2026-06-25' },
  { id: 'USR-002', name: 'Siti Rahma', email: 'siti@klinik.com', role: 'KASIR', status: 'AKTIF', createdAt: '2026-06-26' },
  { id: 'USR-003', name: 'Dr. Budi Utomo', email: 'budi.utomo@klinik.com', role: 'SUPER_ADMIN', status: 'AKTIF', createdAt: '2026-06-27' },
  { id: 'USR-004', name: 'Andi Wijaya', email: 'andi@klinik.com', role: 'KASIR', status: 'NONAKTIF', createdAt: '2026-06-27' },
];

export const UserManagementSection = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (currentUser?.role?.toUpperCase() !== 'SUPER_ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5 border-4 border-red-100"><Shield className="w-10 h-10 text-red-500" /></div>
        <h3 className="text-2xl font-black text-[#13222D] mb-3">Akses Ditolak</h3>
        <p className="text-[#67737C] text-sm max-w-sm">Maaf, fitur manajemen ini khusus <span className="font-bold text-[#13222D] bg-slate-100 px-1.5 py-0.5 rounded">SUPER ADMIN</span>.</p>
      </div>
    );
  }

  const filtered = users.filter(u => 
    (role === 'ALL' || u.role === role) && (status === 'ALL' || u.status === status) &&
    (!search || [u.name, u.email, u.id].some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  const toggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const s = user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
    setUsers(p => p.map(u => u.id === id ? { ...u, status: s } : u));
    logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', detail: `Ubah status ${user.name} ke ${s}`, target_name: 'User' });
  };

  const deleteUser = () => {
    const user = users.find(u => u.id === deleteId);
    if (user) {
      setUsers(p => p.filter(u => u.id !== deleteId));
      logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', detail: `Hapus pengguna ${user.name}`, target_name: 'User' });
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1"><div className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-[#1B9C90]" /><h2 className="text-xl font-bold text-[#13222D]">Manajemen Pengguna</h2></div><p className="text-sm text-[#67737C]">Kelola data staf klinik, ubah status keaktifan, atau tambahkan akun baru.</p></div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl h-10 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold flex gap-2"><Plus className="w-4 h-4" />Tambah Pengguna</Button>
      </div>

      <div className="bg-slate-50/50 p-4 rounded-2xl border border-[#DFE6EB] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative"><Search className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-xl h-10 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-[#1B9C90]"/></div>
        <div className="md:col-span-3 relative"><select value={role} onChange={e => setRole(e.target.value)} className="w-full appearance-none border rounded-xl h-10 px-4 pr-8 text-xs font-semibold focus:outline-none focus:border-[#1B9C90]"><option value="ALL">Semua Hak Akses</option><option value="SUPER_ADMIN">Super Admin</option><option value="KASIR">Kasir / POS</option></select><ChevronDown className="w-4 h-4 text-[#67737C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
        <div className="md:col-span-3 relative"><select value={status} onChange={e => setStatus(e.target.value)} className="w-full appearance-none border rounded-xl h-10 px-4 pr-8 text-xs font-semibold focus:outline-none focus:border-[#1B9C90]"><option value="ALL">Semua Status</option><option value="AKTIF">Status Aktif</option><option value="NONAKTIF">Status Nonaktif</option></select><ChevronDown className="w-4 h-4 text-[#67737C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" /></div>
      </div>

      <div className="border border-[#DFE6EB] rounded-2xl overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-slate-50/50 border-b border-[#DFE6EB] *:p-4 *:text-xs *:font-bold *:text-[#67737C] *:uppercase"><th>ID</th><th>Pengguna</th><th>Hak Akses</th><th>Tgl Dibuat</th><th>Status</th><th className="text-right">Aksi</th></tr></thead>
          <tbody className="divide-y divide-[#DFE6EB]">
            {filtered.length ? filtered.map(u => (
              <tr key={u.id} className="hover:bg-[#F9FEFC]/50">
                <td className="p-4 text-xs font-bold text-[#67737C]">{u.id}</td>
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#DFE6EB] text-[#67737C] flex justify-center items-center font-bold text-xs">{u.name[0]}</div><div><p className="text-xs font-bold text-[#13222D]">{u.name}</p><p className="text-[10px] text-[#67737C]">{u.email}</p></div></div></td>
                <td className="p-4">{u.role === 'SUPER_ADMIN' ? <span className="px-2.5 py-1 text-[10px] font-extrabold bg-blue-50 text-blue-600 rounded-full border border-blue-200">Super Admin</span> : <span className="px-2.5 py-1 text-[10px] font-extrabold bg-teal-50 text-teal-600 rounded-full border border-teal-200">Kasir</span>}</td>
                <td className="p-4 text-xs font-semibold text-[#67737C]">{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="p-4"><button onClick={() => toggleStatus(u.id)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${u.status === 'AKTIF' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}><Power className="w-3 h-3" />{u.status}</button></td>
                <td className="p-4 text-right"><button onClick={() => setDeleteId(u.id)} className="p-1.5 text-[#67737C] hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            )) : <tr><td colSpan={6} className="text-center py-12 text-sm text-[#67737C]">Tidak ditemukan pengguna.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0"><AlertCircle className="w-4 h-4" /></div>
          <div><h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider mb-2">Panduan Keamanan</h3><ul className="text-[11px] text-[#67737C] font-medium space-y-1 list-disc list-inside"><li>Batasi SUPER_ADMIN hanya untuk pemilik.</li><li>Nonaktifkan akun staf yang berhenti (jangan dihapus) demi integritas data.</li></ul></div>
        </div>
      </div>

      <AddUserModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onUserAdded={u => setUsers([u, ...users])} existingUsersCount={users.length} />
      <DeleteUserModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteUser} userName={users.find(u => u.id === deleteId)?.name || ''} />
    </div>
  );
};

