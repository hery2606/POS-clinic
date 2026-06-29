'use client';

import { useState, useEffect } from 'react';
import { LogOut, Shield, Smartphone, Monitor, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { settingService } from '@/features/analitik/services/setting.service';

const mapSession = (item: any, isCurrent: boolean) => {
  const ua = (item.browser_os || '').toLowerCase();
  return {
    id: isCurrent ? 'current' : item.id_sesi,
    device: ua.includes('iphone') || ua.includes('android') || ua.includes('mobile') ? 'Mobile Device' : ua.includes('mac') ? 'Mac' : 'PC',
    browser: ua.includes('chrome') ? 'Chrome' : ua.includes('safari') ? 'Safari' : ua.includes('firefox') ? 'Firefox' : 'Web Browser',
    ipAddress: item.ip_address, location: 'Unknown',
    lastActive: isCurrent ? 'Baru saja' : item.login_terakhir,
    loginTime: isCurrent ? 'Sedang Aktif' : item.login_terakhir,
    status: isCurrent || item.status?.toLowerCase() === 'aktif' ? 'active' : 'inactive',
    isCurrent
  };
};

export const SessionManagementSection = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchSessions = async () => {
    try {
      setIsLoading(true); setIsError(false);
      const res = await settingService.getSessions();
      if (res.status === 'success' && res.data) {
        setSessions([
          ...(res.data.sesi_saat_ini ? [mapSession(res.data.sesi_saat_ini, true)] : []),
          ...(res.data.sesi_aktif_lainnya || []).map((s: any) => mapSession(s, false))
        ]);
      }
    } catch { setIsError(true); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleLogout = async (id: string) => {
    if (id === 'current' || !confirm('Yakin hentikan sesi ini?')) return;
    try {
      await settingService.revokeSession(id);
      setSessions(p => p.filter(s => s.id !== id));
    } catch { alert("Gagal menghentikan sesi."); }
  };

  const handleLogoutOther = async () => {
    if (!confirm('Logout semua sesi lain?')) return;
    try {
      await Promise.all(sessions.filter(s => !s.isCurrent).map(s => settingService.revokeSession(s.id)));
      setSessions(p => p.filter(s => s.isCurrent));
    } catch { alert("Gagal logout beberapa sesi."); fetchSessions(); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#13222D] mb-2">Session Management</h2>
        <p className="text-sm text-[#67737C]">Kelola sesi login Anda di berbagai perangkat</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />) : (
          <>
            <Card className="bg-blue-50 border-blue-200 p-4"><div className="flex justify-between mb-3"><h3 className="text-sm font-medium text-blue-900">Total Sesi</h3><Shield className="w-4 h-4 text-blue-600"/></div><div className="text-2xl font-bold text-blue-900">{sessions.length}</div></Card>
            <Card className="bg-green-50 border-green-200 p-4"><div className="flex justify-between mb-3"><h3 className="text-sm font-medium text-green-900">Sesi Aktif</h3><CheckCircle className="w-4 h-4 text-green-600"/></div><div className="text-2xl font-bold text-green-900">{sessions.filter(s => s.status === 'active').length}</div></Card>
            <Card className="bg-orange-50 border-orange-200 p-4"><div className="flex justify-between mb-3"><h3 className="text-sm font-medium text-orange-900">Tidak Aktif</h3><AlertCircle className="w-4 h-4 text-orange-600"/></div><div className="text-2xl font-bold text-orange-900">{sessions.filter(s => s.status === 'inactive').length}</div></Card>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[#13222D] text-sm">Perangkat & Sesi</h3>
          {!isLoading && sessions.length > 1 && (
            <Button onClick={handleLogoutOther} variant="outline" size="sm" className="text-orange-600 hover:bg-orange-50"><LogOut className="w-3 h-3 mr-1" />Logout Sesi Lain</Button>
          )}
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {isLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />) : isError ? (
            <div className="text-center py-8"><Button onClick={fetchSessions} variant="outline">Coba Lagi</Button></div>
          ) : sessions.length ? sessions.map((s) => (
            <div key={s.id} className={`p-4 border rounded-lg flex items-start gap-3 ${s.isCurrent ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
              <div className={`p-2 rounded-lg ${s.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {s.device === 'Mobile Device' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{s.device}</h4>
                  {s.isCurrent && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Sesi Ini</span>}
                </div>
                <p className="text-xs text-[#67737C] mb-2">Browser: <span className="font-medium">{s.browser}</span></p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mt-2">
                  <div><span className="text-slate-500">IP</span><p className="font-mono font-semibold">{s.ipAddress}</p></div>
                  <div><span className="text-slate-500">Login</span><p className="font-semibold">{s.loginTime}</p></div>
                  <div><span className="text-slate-500">Aktivitas</span><p className="font-semibold">{s.lastActive}</p></div>
                </div>
              </div>
              {!s.isCurrent && <Button onClick={() => handleLogout(s.id)} variant="ghost" size="sm" className="text-red-600"><LogOut className="w-4 h-4" /></Button>}
            </div>
          )) : <div className="text-center py-8 text-slate-500"><Clock className="w-8 h-8 mx-auto opacity-50 mb-2"/>Tidak ada sesi</div>}
        </div>
      </div>
    </div>
  );
};
