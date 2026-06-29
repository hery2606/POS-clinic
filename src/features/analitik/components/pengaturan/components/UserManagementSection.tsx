'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Shield, 
  UserPlus, 
  Power,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { logActivity } from '@/features/analitik/utils/activityLogger';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AddUserModal } from './modals/AddUserModal';
import { DeleteUserModal } from './modals/DeleteUserModal';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'KASIR';
  status: 'AKTIF' | 'NONAKTIF';
  createdAt: string;
}

// Data awal pengguna (mock data untuk demonstrasi)
const INITIAL_USERS: UserItem[] = [
  {
    id: 'USR-001',
    name: 'Hery POS',
    email: 'hery@klinik.com',
    role: 'SUPER_ADMIN',
    status: 'AKTIF',
    createdAt: '2026-06-25'
  },
  {
    id: 'USR-002',
    name: 'Siti Rahma',
    email: 'siti@klinik.com',
    role: 'KASIR',
    status: 'AKTIF',
    createdAt: '2026-06-26'
  },
  {
    id: 'USR-003',
    name: 'Dr. Budi Utomo',
    email: 'budi.utomo@klinik.com',
    role: 'SUPER_ADMIN',
    status: 'AKTIF',
    createdAt: '2026-06-27'
  },
  {
    id: 'USR-004',
    name: 'Andi Wijaya',
    email: 'andi@klinik.com',
    role: 'KASIR',
    status: 'NONAKTIF',
    createdAt: '2026-06-27'
  },
  {
    id: 'USR-005',
    name: 'Ratih Purwasih',
    email: 'ratih@klinik.com',
    role: 'KASIR',
    status: 'AKTIF',
    createdAt: '2026-06-28'
  }
];

export const UserManagementSection = () => {
  const { user: currentUser } = useAuth();

  // Membatasi akses: Hanya SUPER_ADMIN yang bisa mengelola user
  if (currentUser?.role?.toUpperCase() !== 'SUPER_ADMIN') {
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

  // States
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Action Handlers
  const handleToggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newStatus = user.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
    
    setUsers(prev => 
      prev.map(u => u.id === id ? { ...u, status: newStatus } : u)
    );
    
    logActivity({
      action: 'CHANGE_SETTINGS',
      module: 'SETTINGS',
      detail: `Mengubah status pengguna ${user.name} menjadi ${newStatus}`,
      target_name: 'User',
    });
  };

  const handleDeleteUser = () => {
    if (deleteTargetId) {
      const user = users.find(u => u.id === deleteTargetId);
      setUsers(prev => prev.filter(u => u.id !== deleteTargetId));
      setDeleteTargetId(null);
      
      if (user) {
        logActivity({
          action: 'CHANGE_SETTINGS',
          module: 'SETTINGS',
          detail: `Menghapus pengguna ${user.name}`,
          target_name: 'User',
        });
      }
    }
  };

  const handleUserAdded = (newUser: UserItem) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-2.5 py-1 text-[10px] font-extrabold bg-blue-50 text-blue-600 rounded-full border border-blue-200">Super Admin</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-extrabold bg-teal-50 text-teal-600 rounded-full border border-teal-200">Kasir</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#1B9C90]" />
            <h2 className="text-xl font-bold text-[#13222D]">Manajemen Pengguna</h2>
          </div>
          <p className="text-sm text-[#67737C]">
            Kelola data staf klinik, ubah status keaktifan, atau tambahkan akun pengguna baru.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl h-10 px-4 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold flex items-center gap-2 text-xs shadow-none border-none transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Toolbar Filter */}
      <div className="bg-slate-50/50 p-4 rounded-2xl border border-[#DFE6EB] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#67737C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#DFE6EB] rounded-xl h-10 pl-9 pr-4 text-xs font-semibold text-[#13222D] placeholder-[#67737C] focus:outline-none focus:ring-1 focus:ring-[#1B9C90] focus:border-[#1B9C90]"
          />
        </div>

        {/* Filter Role */}
        <div className="md:col-span-3 relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-[#DFE6EB] rounded-xl h-10 px-4 pr-8 text-xs font-semibold text-[#13222D] focus:outline-none focus:ring-1 focus:ring-[#1B9C90] focus:border-[#1B9C90]"
          >
            <option value="ALL">Semua Hak Akses</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="KASIR">Kasir / POS</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#67737C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Status */}
        <div className="md:col-span-3 relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-white border border-[#DFE6EB] rounded-xl h-10 px-4 pr-8 text-xs font-semibold text-[#13222D] focus:outline-none focus:ring-1 focus:ring-[#1B9C90] focus:border-[#1B9C90]"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Status Aktif</option>
            <option value="NONAKTIF">Status Nonaktif</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#67737C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-[#DFE6EB] rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#DFE6EB]">
                <th className="p-4 text-xs font-bold text-[#67737C] uppercase tracking-wider">ID</th>
                <th className="p-4 text-xs font-bold text-[#67737C] uppercase tracking-wider">Pengguna</th>
                <th className="p-4 text-xs font-bold text-[#67737C] uppercase tracking-wider">Hak Akses</th>
                <th className="p-4 text-xs font-bold text-[#67737C] uppercase tracking-wider">Tanggal Dibuat</th>
                <th className="p-4 text-xs font-bold text-[#67737C] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#67737C] uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE6EB]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9FEFC]/50 transition-colors">
                    <td className="p-4 text-xs font-bold text-[#67737C]">{u.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#DFE6EB] text-[#67737C] flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#13222D]">{u.name}</p>
                          <p className="text-[10px] text-[#67737C]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getRoleBadge(u.role)}</td>
                    <td className="p-4 text-xs font-semibold text-[#67737C]">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors border ${
                          u.status === 'AKTIF'
                            ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{u.status === 'AKTIF' ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDeleteTargetId(u.id)}
                        className="p-1.5 text-[#67737C] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-[#67737C]">
                    Tidak ditemukan pengguna yang sesuai dengan pencarian atau filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PANDUAN KEAMANAN & OPERASIONAL ADMIN */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] p-5 space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider mb-2">Panduan Keamanan & Manajemen Akun</h3>
            <ul className="text-[11px] text-[#67737C] font-medium space-y-2 list-disc list-inside">
              <li>
                <span className="text-[#13222D] font-bold">Delegasi Hak Akses:</span> Batasi pemberian hak akses <span className="text-blue-600 font-bold">SUPER_ADMIN</span> hanya untuk pemilik klinik atau staf manajemen tingkat atas karena level ini memiliki otoritas penuh ke konfigurasi sistem.
              </li>
              <li>
                <span className="text-[#13222D] font-bold">Status Keaktifan:</span> Disarankan untuk menonaktifkan akun staf yang berhenti bekerja dengan mengubah status menjadi <span className="text-red-500 font-bold">Nonaktif</span> daripada menghapusnya langsung, guna menjaga integritas riwayat transaksi pada laporan kasir.
              </li>
              <li>
                <span className="text-[#13222D] font-bold">Kebijakan Email:</span> Gunakan email operasional klinik resmi untuk masing-masing staf kasir. Hindari penggunaan email pribadi demi keamanan data dan audit aktivitas log.
              </li>
              <li>
                <span className="text-[#13222D] font-bold">Keamanan Password:</span> Beritahukan password sementara kepada kasir secara aman, dan ingatkan mereka untuk segera memperbaruinya melalui tab <span className="text-[#1B9C90] font-bold">Ubah Password</span> setelah login pertama kali.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL: TAMBAH USER */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
        existingUsersCount={users.length}
      />

      {/* CONFIRMATION: DELETE USER */}
      <DeleteUserModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteUser}
        userName={users.find(u => u.id === deleteTargetId)?.name || ''}
      />
    </div>
  );
};

