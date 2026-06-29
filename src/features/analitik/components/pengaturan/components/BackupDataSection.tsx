'use client';

import { useState, useEffect } from 'react';
import { Download, RotateCw, Trash2, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { logActivity } from '@/features/analitik/utils/activityLogger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BackupItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: 'success' | 'failed';
  type: 'full' | 'incremental';
}

export const BackupDataSection = () => {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  useEffect(() => {
    // Simulasi data backup
    setBackups([
      {
        id: '1',
        name: 'Backup_2026_06_08_Full',
        size: '245.5 MB',
        date: '08 Juni 2026 - 14:30',
        status: 'success',
        type: 'full'
      },
      {
        id: '2',
        name: 'Backup_2026_06_07_Incremental',
        size: '45.2 MB',
        date: '07 Juni 2026 - 15:45',
        status: 'success',
        type: 'incremental'
      },
      {
        id: '3',
        name: 'Backup_2026_06_06_Full',
        size: '230.8 MB',
        date: '06 Juni 2026 - 14:15',
        status: 'success',
        type: 'full'
      },
      {
        id: '4',
        name: 'Backup_2026_06_05_Incremental',
        size: '38.5 MB',
        date: '05 Juni 2026 - 16:00',
        status: 'failed',
        type: 'incremental'
      }
    ]);
  }, []);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulasi progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          // Add new backup to list
            const newBackup: BackupItem = {
              id: Date.now().toString(),
              name: `Backup_2026_06_08_Full_${Date.now()}`,
              size: '248.3 MB',
              date: new Date().toLocaleString('id-ID'),
              status: 'success',
              type: 'full'
            };
            setBackups(prev => [newBackup, ...prev]);
            logActivity({
              action: 'CHANGE_SETTINGS',
              module: 'SETTINGS',
              detail: `Membuat backup penuh data sistem: ${newBackup.name}`,
              target_name: 'Backup',
            });
            return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 300);
  };

  const handleDownload = (backup: BackupItem) => {
    // Simulasi download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(''));
    element.setAttribute('download', `${backup.name}.zip`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    logActivity({
      action: 'EXPORT_PDF',
      module: 'SETTINGS',
      detail: `Mengunduh backup: ${backup.name}`,
      target_name: 'Backup',
    });
  };

  const handleDeleteBackup = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus backup ini?')) {
      const backup = backups.find(b => b.id === id);
      setBackups(prev => prev.filter(b => b.id !== id));
      if (backup) {
        logActivity({
          action: 'CHANGE_SETTINGS',
          module: 'SETTINGS',
          detail: `Menghapus backup: ${backup.name}`,
          target_name: 'Backup',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#13222D] mb-2">Backup Data</h2>
        <p className="text-sm text-[#67737C]">Kelola backup data sistem untuk keamanan dan recovery</p>
      </div>

      {/* Backup Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-900">Total Backup</h3>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-900">{backups.length}</div>
          <p className="text-xs text-blue-700 mt-2">File backup tersimpan</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-green-900">Backup Sukses</h3>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-900">{backups.filter(b => b.status === 'success').length}</div>
          <p className="text-xs text-green-700 mt-2">Siap untuk recovery</p>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-medium text-red-900">Backup Gagal</h3>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-900">{backups.filter(b => b.status === 'failed').length}</div>
          <p className="text-xs text-red-700 mt-2">Perlu perhatian</p>
        </Card>
      </div>

      {/* Create Backup Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Buat Backup Baru</h3>
            <p className="text-xs text-blue-700">Buat backup penuh dari semua data sistem</p>
          </div>
        </div>

        {isBackingUp && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-900">Progress: {Math.round(backupProgress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.round(backupProgress)}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleCreateBackup}
          disabled={isBackingUp}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <RotateCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
          {isBackingUp ? 'Membuat Backup...' : 'Buat Backup Sekarang'}
        </Button>
      </div>

      {/* Backup List */}
      <div className="space-y-3">
        <h3 className="font-medium text-[#13222D] text-sm">Riwayat Backup</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {backups.map((backup) => (
            <div
              key={backup.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#DFE6EB] rounded-lg hover:border-[#1B9C90]/30 transition-all gap-3"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                <div className={`p-2 rounded-lg flex-shrink-0 ${backup.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <FileText className={`w-4 h-4 ${backup.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
                    <p className="font-semibold text-sm text-[#13222D] truncate max-w-[200px] sm:max-w-none">{backup.name}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        backup.type === 'full'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {backup.type === 'full' ? 'Full' : 'Incremental'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        backup.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {backup.status === 'success' ? 'Sukses' : 'Gagal'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#67737C]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {backup.date}
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>{backup.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 flex-shrink-0 w-full sm:w-auto border-t border-slate-100 sm:border-t-0 pt-2.5 sm:pt-0">
                <Button
                  onClick={() => handleDownload(backup)}
                  disabled={backup.status !== 'success'}
                  variant="ghost"
                  size="sm"
                  className="text-[#1B9C90] hover:text-[#157A6D] hover:bg-[#F4FBF9]"
                  title="Download backup"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteBackup(backup.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Hapus backup"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-700 space-y-1">
          <p className="font-semibold">Tips Keamanan Backup:</p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>Buat backup secara berkala (minimal seminggu sekali)</li>
            <li>Simpan backup di lokasi terpisah untuk keamanan maksimal</li>
            <li>Verifikasi backup secara rutin untuk memastikan integritas data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
