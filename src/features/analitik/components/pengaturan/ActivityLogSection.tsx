'use client';

import { useState, useEffect } from 'react';
import { Filter, Download, Clock, User, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: 'login' | 'logout' | 'edit' | 'delete' | 'security' | 'system';
  description: string;
  ipAddress: string;
  status: 'success' | 'failed';
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

export const ActivityLogSection = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [filterType, setFilterType] = useState<ActivityLog['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulasi data activity log
    const mockActivities: ActivityLog[] = [
      {
        id: '1',
        timestamp: '08 Juni 2026 - 16:45:23',
        user: 'Admin Utama',
        action: 'Login',
        type: 'login',
        description: 'Login ke sistem admin dashboard',
        ipAddress: '192.168.1.105',
        status: 'success'
      },
      {
        id: '2',
        timestamp: '08 Juni 2026 - 16:30:12',
        user: 'Admin Utama',
        action: 'Ubah Password',
        type: 'security',
        description: 'Mengubah password akun admin',
        ipAddress: '192.168.1.105',
        status: 'success'
      },
      {
        id: '3',
        timestamp: '08 Juni 2026 - 15:45:00',
        user: 'Admin Utama',
        action: 'Buat Backup',
        type: 'system',
        description: 'Membuat backup penuh data sistem',
        ipAddress: '192.168.1.105',
        status: 'success'
      },
      {
        id: '4',
        timestamp: '08 Juni 2026 - 14:20:45',
        user: 'Admin Utama',
        action: 'Edit Data',
        type: 'edit',
        description: 'Mengedit data transaksi #TRX-001',
        ipAddress: '192.168.1.105',
        status: 'success'
      },
      {
        id: '5',
        timestamp: '07 Juni 2026 - 18:30:22',
        user: 'Admin Utama',
        action: 'Login Gagal',
        type: 'login',
        description: 'Percobaan login dengan password salah',
        ipAddress: '192.168.1.110',
        status: 'failed'
      },
      {
        id: '6',
        timestamp: '07 Juni 2026 - 17:15:10',
        user: 'Admin Utama',
        action: 'Logout',
        type: 'logout',
        description: 'Logout dari sistem',
        ipAddress: '192.168.1.105',
        status: 'success'
      },
      {
        id: '7',
        timestamp: '07 Juni 2026 - 10:45:30',
        user: 'Admin Utama',
        action: 'Hapus Data',
        type: 'delete',
        description: 'Menghapus data laporan lama',
        ipAddress: '192.168.1.105',
        status: 'success'
      },
      {
        id: '8',
        timestamp: '06 Juni 2026 - 14:00:00',
        user: 'Admin Utama',
        action: 'Buat Backup',
        type: 'system',
        description: 'Membuat backup incremental data sistem',
        ipAddress: '192.168.1.105',
        status: 'success'
      }
    ];

    setActivities(mockActivities);
    setFilteredActivities(mockActivities);
  }, []);

  // Filter activities
  useEffect(() => {
    let result = activities;

    if (filterType !== 'all') {
      result = result.filter(a => a.type === filterType);
    }

    if (filterStatus !== 'all') {
      result = result.filter(a => a.status === filterStatus);
    }

    if (searchQuery) {
      result = result.filter(a =>
        a.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.ipAddress.includes(searchQuery)
      );
    }

    setFilteredActivities(result);
  }, [activities, filterType, filterStatus, searchQuery]);

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

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              setFilterType('all');
              setFilterStatus('all');
              setSearchQuery('');
            }}
            variant="outline"
            size="sm"
          >
            Reset Filter
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-[#13222D]">
          {filteredActivities.length} aktivitas ditemukan
        </div>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredActivities.length > 0 ? (
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
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-[#13222D]">
                          {activity.action}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          activity.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {activity.status === 'success' ? 'Berhasil' : 'Gagal'}
                        </span>
                      </div>
                      <p className="text-xs text-[#67737C] mb-2">{activity.description}</p>
                      <div className="flex items-center gap-3 text-xs text-[#67737C] flex-wrap">
                        <span>👤 {activity.user}</span>
                        <span>•</span>
                        <span>🕐 {activity.timestamp}</span>
                        <span>•</span>
                        <span>🌐 {activity.ipAddress}</span>
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
