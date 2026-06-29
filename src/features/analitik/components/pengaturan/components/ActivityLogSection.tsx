'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Download, Clock, User, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { settingService } from '@/features/analitik/services/setting.service';

const getStyle = (action: string) => {
  const a = (action || '').toUpperCase();
  const base = "text-[11px] px-2.5 py-1 rounded-md font-bold tracking-wide border shadow-sm uppercase";
  if (a.includes('LOGIN') || a.includes('LOGOUT')) return `${base} bg-blue-50/80 text-blue-700 border-blue-200`;
  if (a.includes('EXPORT') || a.includes('DOWNLOAD')) return `${base} bg-indigo-50/80 text-indigo-700 border-indigo-200`;
  if (a.includes('WA_REMINDER') || a.includes('WHATSAPP')) return `${base} bg-emerald-50/80 text-emerald-700 border-emerald-200`;
  if (a.includes('CREATE') || a.includes('TAMBAH')) return `${base} bg-green-50/80 text-green-700 border-green-200`;
  if (a.includes('UPDATE') || a.includes('EDIT')) return `${base} bg-amber-50/80 text-amber-700 border-amber-200`;
  if (a.includes('DELETE') || a.includes('VOID') || a.includes('HAPUS')) return `${base} bg-rose-50/80 text-rose-700 border-rose-200`;
  return `${base} bg-slate-50 text-slate-700 border-slate-200`;
};

const mapLog = (item: any, i: number) => {
  const mod = (item.module || '').toLowerCase();
  const act = (item.action || '').toLowerCase();
  
  let type = 'system';
  if ((mod === 'auth' && item.status?.toLowerCase() === 'failed') || act.includes('password') || act.includes('security') || (item.detail || '').includes('[SECURITY ALERT]')) type = 'security';
  else if (mod === 'login' || mod === 'auth') type = act.includes('logout') ? 'logout' : 'login';
  else if (act.includes('edit') || act.includes('update')) type = 'edit';
  else if (act.includes('hapus') || act.includes('delete')) type = 'delete';

  return {
    id: item.id || String(i), timestamp: item.created_at, user: item.admin_name, action: item.action, type,
    desc: item.detail || `${item.admin_name} melakukan ${item.action}`, ip: item.ip_address || '-',
    status: item.status?.toLowerCase() === 'success' ? 'success' : 'failed', module: item.module || '-',
    target: `${item.target_name || '-'} (${item.target_id || '-'})`, err: item.error_message, ua: item.user_agent || '-'
  };
};

export const ActivityLogSection = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const { data: apiData, isLoading, isError, refetch } = useQuery({
    queryKey: ['activityLogs'], queryFn: () => settingService.getActivityLogs(), refetchInterval: 5000, staleTime: 5000,
  });

  const logs = (apiData as any)?.status === 'success' ? ((apiData as any).data?.data || []).map(mapLog) : [];
  const filtered = logs.filter(a => 
    (filterType === 'all' || a.type === filterType) && 
    (filterStatus === 'all' || a.status === filterStatus) &&
    (!search || [a.user, a.desc, a.action, a.ip, a.module].some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  const handleExport = () => {
    const csv = [['Waktu', 'User', 'Aksi', 'Deskripsi', 'IP Address', 'Status'], ...filtered.map(a => [a.timestamp, a.user, a.action, a.desc, a.ip, a.status])]
      .map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `activity_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const icons: any = { login: <User className="w-4 h-4" />, logout: <User className="w-4 h-4" />, security: <Shield className="w-4 h-4" />, system: <Database className="w-4 h-4" />, default: <Clock className="w-4 h-4" /> };
  const colors: any = { login: 'bg-blue-50 text-blue-600 border-blue-200', logout: 'bg-gray-50 text-gray-600 border-gray-200', security: 'bg-red-50 text-red-600 border-red-200', system: 'bg-purple-50 text-purple-600 border-purple-200', edit: 'bg-green-50 text-green-600 border-green-200', delete: 'bg-orange-50 text-orange-600 border-orange-200', default: 'bg-gray-50 text-gray-600 border-gray-200' };

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-semibold text-[#13222D] mb-2">Activity Log</h2><p className="text-sm text-[#67737C]">Pantau semua aktivitas admin di sistem</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <Card key={i} className="p-4 rounded-lg bg-slate-50"><Skeleton className="h-4 w-24 mb-2"/><Skeleton className="h-8 w-12"/></Card>) : (
          <>
            <Card className="bg-blue-50 border-blue-200 p-4"><div className="text-xs text-blue-600 font-medium mb-1">Total Aktivitas</div><div className="text-2xl font-bold text-blue-900">{logs.length}</div></Card>
            <Card className="bg-green-50 border-green-200 p-4"><div className="text-xs text-green-600 font-medium mb-1">Berhasil</div><div className="text-2xl font-bold text-green-900">{logs.filter(a => a.status === 'success').length}</div></Card>
            <Card className="bg-red-50 border-red-200 p-4"><div className="text-xs text-red-600 font-medium mb-1">Gagal</div><div className="text-2xl font-bold text-red-900">{logs.filter(a => a.status === 'failed').length}</div></Card>
            <Card className="bg-purple-50 border-purple-200 p-4"><div className="text-xs text-purple-600 font-medium mb-1">Keamanan</div><div className="text-2xl font-bold text-purple-900">{logs.filter(a => a.type === 'security').length}</div></Card>
          </>
        )}
      </div>

      <div className="space-y-4 bg-white border border-[#DFE6EB] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3"><Filter className="w-4 h-4 text-[#67737C]" /><span className="text-sm font-medium text-[#13222D]">Filter & Cari</span></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-xs font-medium mb-2">Cari</label><input type="text" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-[#1B9C90]" /></div>
          <div>
            <label className="block text-xs font-medium mb-2">Tipe</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-[#1B9C90]">
              <option value="all">Semua Tipe</option><option value="login">Login</option><option value="logout">Logout</option><option value="edit">Edit</option><option value="delete">Hapus</option><option value="security">Keamanan</option><option value="system">Sistem</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-[#1B9C90]">
              <option value="all">Semua</option><option value="success">Berhasil</option><option value="failed">Gagal</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2"><Button onClick={() => { setFilterType('all'); setFilterStatus('all'); setSearch(''); }} variant="outline" size="sm">Reset Filter</Button><Button onClick={handleExport} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button></div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">{isLoading ? <Skeleton className="h-4 w-36" /> : `${filtered.length} aktivitas`}</div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {isLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-4 border rounded-lg flex gap-3"><Skeleton className="h-9 w-9" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-3 w-3/4" /></div></div>)
          : isError ? <div className="text-center py-8"><p className="text-red-500 text-sm mb-2">Gagal memuat log.</p><Button onClick={() => refetch()} size="sm" variant="outline">Coba Lagi</Button></div>
          : filtered.length ? filtered.map(a => (
            <div key={a.id} className={`p-4 border rounded-lg flex items-start gap-3 ${a.status === 'success' ? 'bg-white' : 'bg-red-50 border-red-200'}`}>
              <div className={`p-2 rounded-lg border ${colors[a.type] || colors.default}`}>{icons[a.type] || icons.default}</div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className={getStyle(a.action)}>{a.action.replace(/_/g, ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${a.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">Modul: {a.module}</span>
                </div>
                <p className="text-xs text-[#67737C] mb-2">{a.desc}</p>
                <div className="flex flex-col gap-1 mb-2 text-xs">
                  <span className="text-slate-500">Target: {a.target}</span>
                  {a.err && <span className="text-red-600 bg-red-50 p-1.5 rounded font-mono break-all border border-red-100">Error: {a.err}</span>}
                </div>
                <div className="flex gap-3 text-[10px] text-slate-400 flex-wrap border-t border-slate-100 pt-2">
                  <span>👤 {a.user}</span><span>•</span><span>🕐 {new Date(a.timestamp).toLocaleString('id-ID')}</span><span>•</span><span>🌐 {a.ip}</span><span>•</span><span className="max-w-[200px] truncate" title={a.ua}>💻 {a.ua}</span>
                </div>
              </div>
            </div>
          )) : <div className="text-center py-8 text-slate-500"><Clock className="w-8 h-8 mx-auto opacity-50 mb-2"/><p className="text-sm">Tidak ada aktivitas</p></div>}
        </div>
      </div>
    </div>
  );
};