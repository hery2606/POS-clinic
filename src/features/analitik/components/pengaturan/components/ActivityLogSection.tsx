'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Download, Clock, User, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { settingService } from '@/features/analitik/services/setting.service';
import { type ActivityLogItem } from '@/features/analitik/types/setting.types';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: 'login' | 'logout' | 'edit' | 'delete' | 'security' | 'system';
  description: string;
  ipAddress: string;
  status: 'success' | 'failed';
  module: string;
  targetName: string;
  targetId: string;
  errorMessage: string | null;
  userAgent: string;
}

const getActivityIcon = (type: ActivityLog['type']) => {
  switch (type) {
    case 'login': return <User className="w-4 h-4" />;
    case 'logout': return <User className="w-4 h-4" />;
    case 'security': return <Shield className="w-4 h-4" />;
    case 'system': return <Database className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const getActivityColor = (type: ActivityLog['type']) => {
  switch (type) {
    case 'login': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'logout': return 'bg-gray-50 text-gray-600 border-gray-200';
    case 'security': return 'bg-red-50 text-red-600 border-red-200';
    case 'system': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'edit': return 'bg-green-50 text-green-600 border-green-200';
    case 'delete': return 'bg-orange-50 text-orange-600 border-orange-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const getActionBadgeStyle = (action: string) => {
  const baseStyle = "text-[11px] px-2.5 py-1 rounded-md font-bold tracking-wide border shadow-sm uppercase";
  const actionUpper = (action || '').toUpperCase();

  if (actionUpper.includes('LOGIN') || actionUpper.includes('LOGOUT')) {
    return `${baseStyle} bg-blue-50/80 text-blue-700 border-blue-200`;
  }
  if (actionUpper.includes('EXPORT') || actionUpper.includes('DOWNLOAD')) {
    return `${baseStyle} bg-indigo-50/80 text-indigo-700 border-indigo-200`;
  }
  if (actionUpper.includes('WA_REMINDER') || actionUpper.includes('WHATSAPP')) {
    return `${baseStyle} bg-emerald-50/80 text-emerald-700 border-emerald-200`;
  }
  if (actionUpper.includes('CREATE') || actionUpper.includes('TAMBAH')) {
    return `${baseStyle} bg-green-50/80 text-green-700 border-green-200`;
  }
  if (actionUpper.includes('UPDATE') || actionUpper.includes('EDIT') || actionUpper.includes('CHANGE')) {
    return `${baseStyle} bg-amber-50/80 text-amber-700 border-amber-200`;
  }
  if (actionUpper.includes('DELETE') || actionUpper.includes('VOID') || actionUpper.includes('HAPUS')) {
    return `${baseStyle} bg-rose-50/80 text-rose-700 border-rose-200`;
  }
  
  // Default style
  return `${baseStyle} bg-slate-50 text-slate-700 border-slate-200`;
};

const mapApiLogToInternal = (item: ActivityLogItem, index: number): ActivityLog => {
  const modulLower = (item.module || '').toLowerCase();
  const aksiLower = (item.action || '').toLowerCase();
  
  let type: ActivityLog['type'] = 'system';

  // Cek security TERLEBIH DAHULU sebelum login/logout
  // AUTH + FAILED = ancaman keamanan
  const isAuthFailed = (modulLower === 'auth') && item.status?.toLowerCase() === 'failed';
  const isSecurityKeyword = aksiLower.includes('password') || aksiLower.includes('keamanan') || aksiLower.includes('security');
  // Fallback: cek detail atau nama admin mengandung penanda security
  const isSecurityAlert = (item.detail || '').includes('[SECURITY ALERT]') || item.admin_name === 'ATTACKER';
  
  if (isAuthFailed || isSecurityKeyword || isSecurityAlert) {
    type = 'security';
  } else if (modulLower === 'login' || modulLower === 'auth') {
    if (aksiLower.includes('logout')) {
      type = 'logout';
    } else {
      type = 'login';
    }
  } else if (aksiLower.includes('edit') || aksiLower.includes('ubah') || aksiLower.includes('update')) {
    type = 'edit';
  } else if (aksiLower.includes('hapus') || aksiLower.includes('delete') || aksiLower.includes('remove')) {
    type = 'delete';
  }
  
  return {
    id: item.id || index.toString(),
    timestamp: item.created_at,
    user: item.admin_name,
    action: item.action,
    type,
    description: item.detail || `${item.admin_name} melakukan ${item.action} pada modul ${item.module}`,
    ipAddress: item.ip_address || '-',
    status: item.status?.toLowerCase() === 'success' ? 'success' : 'failed',
    module: item.module || '-',
    targetName: item.target_name || '-',
    targetId: item.target_id || '-',
    errorMessage: item.error_message || null,
    userAgent: item.user_agent || '-'
  };
};

export const ActivityLogSection = () => {
  const [filterType, setFilterType] = useState<ActivityLog['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: apiData, isLoading, isError, refetch } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => settingService.getActivityLogs(),
    refetchInterval: 5000,
    staleTime: 5000,
  });

  const activities = apiData?.status === 'success' && apiData.data?.data 
    ? apiData.data.data.map(mapApiLogToInternal) 
    : [];

  const filteredActivities = activities.filter(a => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.user.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.ipAddress.includes(q) ||
        a.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const csv = [
      ['Waktu', 'User', 'Aksi', 'Deskripsi', 'IP Address', 'Status'],
      ...filteredActivities.map(a => [
        a.timestamp,
        a.user,
        a.action,
        a.description,
        a.ipAddress,
        a.status
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#13222D] mb-2">Activity Log</h2>
        <p className="text-sm text-[#67737C]">Pantau semua aktivitas admin di sistem</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <Skeleton className="h-4 w-24 mb-2 rounded-md" />
              <Skeleton className="h-8 w-12 rounded-md" />
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="text-xs text-blue-600 font-medium mb-1">Total Aktivitas</div>
              <div className="text-2xl font-bold text-blue-900">{activities.length}</div>
            </Card>
            <Card className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="text-xs text-green-600 font-medium mb-1">Berhasil</div>
              <div className="text-2xl font-bold text-green-900">{activities.filter(a => a.status === 'success').length}</div>
            </Card>
            <Card className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="text-xs text-red-600 font-medium mb-1">Gagal</div>
              <div className="text-2xl font-bold text-red-900">{activities.filter(a => a.status === 'failed').length}</div>
            </Card>
            <Card className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <div className="text-xs text-purple-600 font-medium mb-1">Keamanan</div>
              <div className="text-2xl font-bold text-purple-900">{activities.filter(a => a.type === 'security').length}</div>
            </Card>
          </>
        )}
      </div>

      {/* Filters & Search */}
      <div className="space-y-4 bg-white border border-[#DFE6EB] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-[#67737C]" />
          <span className="text-sm font-medium text-[#13222D]">Filter & Cari</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#13222D] mb-2">Cari Aktivitas</label>
            <input
              type="text"
              placeholder="Nama user, IP, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6EB] rounded-lg focus:outline-none focus:border-[#1B9C90] focus:ring-1 focus:ring-[#1B9C90]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#13222D] mb-2">Tipe Aktivitas</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6EB] rounded-lg focus:outline-none focus:border-[#1B9C90] focus:ring-1 focus:ring-[#1B9C90]/30"
            >
              <option value="all">Semua Tipe</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="edit">Edit Data</option>
              <option value="delete">Hapus Data</option>
              <option value="security">Keamanan</option>
              <option value="system">Sistem</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#13222D] mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6EB] rounded-lg focus:outline-none focus:border-[#1B9C90] focus:ring-1 focus:ring-[#1B9C90]/30"
            >
              <option value="all">Semua Status</option>
              <option value="success">Berhasil</option>
              <option value="failed">Gagal</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            onClick={() => {
              setFilterType('all');
              setFilterStatus('all');
              setSearchQuery('');
            }}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            Reset Filter
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-[#13222D]">
          {isLoading ? (
            <Skeleton className="h-4 w-36 rounded-md" />
          ) : (
            `${filteredActivities.length} aktivitas ditemukan`
          )}
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="text-center py-8 text-[#67737C]">
              <p className="text-sm text-red-500 font-semibold mb-2">Gagal memuat log aktivitas.</p>
              <Button onClick={() => refetch()} size="sm" variant="outline" className="mx-auto cursor-pointer">Coba Lagi</Button>
            </div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                  activity.status === 'success'
                    ? 'bg-white border-[#DFE6EB]'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg flex-shrink-0 border ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={getActionBadgeStyle(activity.action)}>
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          activity.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {activity.status === 'success' ? 'Berhasil' : 'Gagal'}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                          Modul: {activity.module}
                        </span>
                      </div>
                      <p className="text-xs text-[#67737C] mb-2">{activity.description}</p>
                      
                      <div className="flex flex-col gap-1 mb-3">
                        <span className="text-xs text-slate-500">Target: {activity.targetName} ({activity.targetId})</span>
                        {activity.errorMessage && (
                          <span className="text-xs text-red-600 bg-red-50 p-1.5 rounded font-mono break-all border border-red-100">
                            Error: {activity.errorMessage}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap border-t border-slate-100 pt-2">
                        <span>👤 {activity.user}</span>
                        <span>•</span>
                        <span>🕐 {new Date(activity.timestamp).toLocaleString('id-ID')}</span>
                        <span>•</span>
                        <span>🌐 {activity.ipAddress}</span>
                        <span>•</span>
                        <span className="max-w-[200px] truncate" title={activity.userAgent}>💻 {activity.userAgent}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#67737C]">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ada aktivitas yang sesuai dengan filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
