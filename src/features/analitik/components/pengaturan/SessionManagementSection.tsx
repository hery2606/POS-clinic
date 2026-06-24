'use client';

import { useState, useEffect } from 'react';
import { LogOut, MoreVertical, Shield, Smartphone, Monitor, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { settingService } from '@/features/analitik/services/setting.service';
import { type CurrentSession, type SessionItem } from '@/features/analitik/types/setting.types';

interface Session {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  loginTime: string;
  status: 'active' | 'inactive';
  isCurrent: boolean;
}

const getDeviceIcon = (device: string) => {
  if (device.toLowerCase().includes('mobile') || device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
    return <Smartphone className="w-4 h-4" />;
  }
  return <Monitor className="w-4 h-4" />;
};

const mapCurrentSessionToInternal = (curr: CurrentSession): Session => {
  const ua = curr.browser_os || '';
  let device = 'Windows PC';
  if (ua.toLowerCase().includes('iphone')) device = 'iPhone';
  else if (ua.toLowerCase().includes('android')) device = 'Android Phone';
  else if (ua.toLowerCase().includes('macintosh')) device = 'MacBook / Mac';
  else if (ua.toLowerCase().includes('linux')) device = 'Linux PC';
  
  let browser = 'Web Browser';
  if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edge/')) browser = 'Edge';

  return {
    id: 'current',
    device,
    browser,
    ipAddress: curr.ip_address,
    location: 'Unknown',
    lastActive: 'Baru saja',
    loginTime: 'Sedang Aktif',
    status: 'active',
    isCurrent: true
  };
};

const mapOtherSessionToInternal = (item: SessionItem): Session => {
  const ua = item.browser_os || '';
  let device = 'Windows PC';
  if (ua.toLowerCase().includes('iphone')) device = 'iPhone';
  else if (ua.toLowerCase().includes('android')) device = 'Android Phone';
  else if (ua.toLowerCase().includes('macintosh')) device = 'MacBook / Mac';
  else if (ua.toLowerCase().includes('linux')) device = 'Linux PC';
  
  let browser = 'Web Browser';
  if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Edge/')) browser = 'Edge';

  return {
    id: item.id_sesi,
    device,
    browser,
    ipAddress: item.ip_address,
    location: 'Unknown',
    lastActive: item.login_terakhir,
    loginTime: item.login_terakhir,
    status: item.status.toLowerCase() === 'aktif' ? 'active' : 'inactive',
    isCurrent: false
  };
};

export const SessionManagementSection = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showMore, setShowMore] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await settingService.getSessions();
      if (res.status === 'success' && res.data) {
        const list: Session[] = [];
        if (res.data.sesi_saat_ini) {
          list.push(mapCurrentSessionToInternal(res.data.sesi_saat_ini));
        }
        if (res.data.sesi_aktif_lainnya) {
          const others = res.data.sesi_aktif_lainnya.map(mapOtherSessionToInternal);
          list.push(...others);
        }
        setSessions(list);
      }
    } catch (err) {
      console.error("Gagal memuat sesi:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleLogoutSession = async (id: string) => {
    if (id === 'current') return;
    try {
      await settingService.revokeSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      setShowMore(null);
    } catch (err) {
      console.error("Gagal logout sesi:", err);
      alert("Gagal menghentikan sesi. Silakan coba kembali.");
    }
  };

  const handleLogoutOtherSessions = async () => {
    if (confirm('Apakah Anda yakin ingin logout semua sesi lain? Anda hanya akan tetap login di perangkat ini.')) {
      try {
        const otherSessions = sessions.filter(s => !s.isCurrent);
        await Promise.all(otherSessions.map(s => settingService.revokeSession(s.id)));
        setSessions(prev => prev.filter(s => s.isCurrent));
        setShowMore(null);
      } catch (err) {
        console.error("Gagal logout semua sesi lain:", err);
        alert("Gagal menghentikan beberapa sesi. Melakukan refresh...");
        fetchSessions();
      }
    }
  };

  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const inactiveSessions = sessions.filter(s => s.status === 'inactive').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#13222D] mb-2">Session Management</h2>
        <p className="text-sm text-[#67737C]">Kelola sesi login Anda di berbagai perangkat</p>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-12 rounded-md mb-2" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </Card>
          ))
        ) : (
          <>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-blue-900">Total Sesi</h3>
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900">{sessions.length}</div>
              <p className="text-xs text-blue-700 mt-2">Sesi aktif di berbagai perangkat</p>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-green-900">Sesi Aktif</h3>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900">{activeSessions}</div>
              <p className="text-xs text-green-700 mt-2">Perangkat sedang aktif</p>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-medium text-orange-900">Sesi Tidak Aktif</h3>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-900">{inactiveSessions}</div>
              <p className="text-xs text-orange-700 mt-2">Perangkat sudah tidak aktif</p>
            </Card>
          </>
        )}
      </div>

      {/* Current Session Alert */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Sesi Aktif</h3>
            <p className="text-sm text-green-800">Anda sedang login di sesi ini. Logout akan membuat Anda keluar dari akun admin.</p>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-4">
          <h3 className="font-medium text-[#13222D] text-sm">Perangkat & Sesi</h3>
          {!isLoading && sessions.length > 1 && (
            <Button
              onClick={handleLogoutOtherSessions}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-orange-600 border-orange-200 hover:bg-orange-50 cursor-pointer justify-center"
            >
              <LogOut className="w-3 h-3 mr-1" />
              Logout Sesi Lain
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-1/3 rounded-md" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="space-y-1">
                        <Skeleton className="h-2.5 w-12 rounded-md" />
                        <Skeleton className="h-3.5 w-20 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="text-center py-8 text-[#67737C]">
              <p className="text-sm text-red-500 font-semibold mb-2">Gagal memuat sesi aktif.</p>
              <Button onClick={fetchSessions} size="sm" variant="outline" className="mx-auto cursor-pointer">Coba Lagi</Button>
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 border rounded-lg transition-all ${
                  session.isCurrent
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-[#DFE6EB] hover:border-[#1B9C90]/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      session.status === 'active'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}>
                      {getDeviceIcon(session.device)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-[#13222D] text-sm">
                          {session.device}
                        </h4>
                        {session.isCurrent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            <CheckCircle className="w-3 h-3" />
                            Sesi Ini
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {session.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </div>

                      <p className="text-xs text-[#67737C] mb-2">
                        Browser: <span className="font-medium">{session.browser}</span>
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-3">
                        <div>
                          <span className="text-[#67737C]">IP Address</span>
                          <p className="font-mono text-[#13222D] font-semibold">{session.ipAddress}</p>
                        </div>
                        <div>
                          <span className="text-[#67737C]">Lokasi</span>
                          <p className="text-[#13222D] font-semibold">{session.location}</p>
                        </div>
                        <div>
                          <span className="text-[#67737C]">Login</span>
                          <p className="text-[#13222D] font-semibold">{session.loginTime}</p>
                        </div>
                        <div>
                          <span className="text-[#67737C]">Aktivitas Terakhir</span>
                          <p className="text-[#13222D] font-semibold">{session.lastActive}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!session.isCurrent && (
                    <div className="flex-shrink-0 w-full sm:w-auto border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0 flex justify-end">
                      <Button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghentikan sesi ini?')) {
                            handleLogoutSession(session.id);
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold gap-1.5 flex items-center justify-center"
                        title="Logout Sesi"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="sm:hidden lg:inline text-xs">Logout Sesi</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#67737C]">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ada sesi aktif ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Tips Keamanan Sesi</h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>Logout dari perangkat yang tidak digunakan secara teratur</li>
              <li>Periksa lokasi IP yang tidak dikenal dan segera logout jika mencurigakan</li>
              <li>Gunakan password yang kuat untuk mencegah akses tidak sah</li>
              <li>Aktifkan verifikasi dua faktor untuk keamanan tambahan</li>
              <li>Logout semua sesi jika Anda mencurigai akun Anda telah dikompromikan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
