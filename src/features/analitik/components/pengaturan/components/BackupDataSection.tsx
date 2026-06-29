'use client';

import { useState, useEffect } from 'react';
import { Download, RotateCw, Trash2, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { logActivity } from '@/features/analitik/utils/activityLogger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type BackupItem = { id: string; name: string; size: string; date: string; status: 'success' | 'failed'; type: 'full' | 'incremental' };

const INITIAL_BACKUPS: BackupItem[] = [
  { id: '1', name: 'Backup_2026_06_08_Full', size: '245.5 MB', date: '08 Juni 2026 - 14:30', status: 'success', type: 'full' },
  { id: '2', name: 'Backup_2026_06_07_Incremental', size: '45.2 MB', date: '07 Juni 2026 - 15:45', status: 'success', type: 'incremental' },
  { id: '3', name: 'Backup_2026_06_06_Full', size: '230.8 MB', date: '06 Juni 2026 - 14:15', status: 'success', type: 'full' },
  { id: '4', name: 'Backup_2026_06_05_Incremental', size: '38.5 MB', date: '05 Juni 2026 - 16:00', status: 'failed', type: 'incremental' }
];

export const BackupDataSection = () => {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => setBackups(INITIAL_BACKUPS), []);

  const handleCreate = () => {
    setIsBackingUp(true); setProgress(0);
    const int = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(int); setIsBackingUp(false);
          const nb: BackupItem = { id: Date.now().toString(), name: `Backup_${Date.now()}_Full`, size: '248.3 MB', date: new Date().toLocaleString('id-ID'), status: 'success', type: 'full' };
          setBackups(prev => [nb, ...prev]);
          logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', detail: `Backup penuh: ${nb.name}`, target_name: 'Backup' });
          return 100;
        }
        return p + Math.random() * 30;
      });
    }, 300);
  };

  const handleDownload = (b: BackupItem) => {
    const a = document.createElement('a'); a.href = 'data:,'; a.download = `${b.name}.zip`; a.click();
    logActivity({ action: 'EXPORT_PDF', module: 'SETTINGS', detail: `Unduh backup: ${b.name}`, target_name: 'Backup' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus backup ini?')) {
      const b = backups.find(x => x.id === id);
      setBackups(p => p.filter(x => x.id !== id));
      if (b) logActivity({ action: 'CHANGE_SETTINGS', module: 'SETTINGS', detail: `Hapus backup: ${b.name}`, target_name: 'Backup' });
    }
  };

  const stats = [
    { title: 'Total Backup', val: backups.length, icon: FileText, color: 'blue', desc: 'File backup tersimpan' },
    { title: 'Backup Sukses', val: backups.filter(b => b.status === 'success').length, icon: CheckCircle, color: 'green', desc: 'Siap recovery' },
    { title: 'Backup Gagal', val: backups.filter(b => b.status === 'failed').length, icon: AlertCircle, color: 'red', desc: 'Perlu perhatian' }
  ];

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-semibold text-[#13222D] mb-2">Backup Data</h2><p className="text-sm text-[#67737C]">Kelola backup data sistem untuk keamanan dan recovery</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className={`bg-gradient-to-br from-${s.color}-50 to-${s.color}-100/50 border-${s.color}-200 p-4 rounded-lg`}>
              <div className="flex items-start justify-between mb-3"><h3 className={`text-sm font-medium text-${s.color}-900`}>{s.title}</h3><Icon className={`w-4 h-4 text-${s.color}-600`} /></div>
              <div className={`text-2xl font-bold text-${s.color}-900`}>{s.val}</div>
              <p className={`text-xs text-${s.color}-700 mt-2`}>{s.desc}</p>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
        <div><h3 className="font-medium text-blue-900 mb-1">Buat Backup Baru</h3><p className="text-xs text-blue-700">Buat backup penuh dari semua data sistem</p></div>
        {isBackingUp && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs"><span className="text-blue-900">Progress: {Math.round(progress)}%</span></div>
            <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden"><div className="bg-blue-600 h-full transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
        <Button onClick={handleCreate} disabled={isBackingUp} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <RotateCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />{isBackingUp ? 'Membuat...' : 'Buat Backup Sekarang'}
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-[#13222D] text-sm">Riwayat Backup</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {backups.map(b => (
            <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#DFE6EB] rounded-lg hover:border-[#1B9C90]/30 transition-all gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                <div className={`p-2 rounded-lg shrink-0 ${b.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}><FileText className={`w-4 h-4 ${b.status === 'success' ? 'text-green-600' : 'text-red-600'}`} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
                    <p className="font-semibold text-sm text-[#13222D] truncate">{b.name}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${b.type === 'full' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{b.type}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${b.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#67737C]"><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date}</div><span className="hidden sm:inline">•</span><span>{b.size}</span></div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0">
                <Button onClick={() => handleDownload(b)} disabled={b.status !== 'success'} variant="ghost" size="sm" className="text-[#1B9C90] hover:text-[#157A6D] hover:bg-[#F4FBF9]"><Download className="w-4 h-4" /></Button>
                <Button onClick={() => handleDelete(b.id)} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-700 space-y-1"><p className="font-semibold">Tips Keamanan Backup:</p><ul className="list-disc list-inside ml-1"><li>Buat minimal seminggu sekali</li><li>Simpan di lokasi terpisah</li><li>Verifikasi secara rutin</li></ul></div>
      </div>
    </div>
  );
};