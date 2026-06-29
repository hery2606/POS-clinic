import { settingService } from '@/features/analitik/services/setting.service';
import AuthService from '@/features/auth/service/auth.service';

export interface LogParams {
  action: string;
  module: string;
  detail: string;
  target_name?: string;
  target_id?: string;
  status?: 'SUCCESS' | 'FAILED';
  error_message?: string;
  userOverride?: any;
}

let cachedIp = '';
const getIpAddress = async () => {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    cachedIp = data.ip;
    return cachedIp;
  } catch {
    return '127.0.0.1';
  }
};

export const logActivity = async (params: LogParams) => {
  try {
    const user = params.userOverride || AuthService.getUser();
    if (!user) return;

    const ip = await getIpAddress();

    await settingService.createActivityLog({
      admin_id: user.id,
      admin_name: user.name,
      admin_email: user.email,
      action: params.action,
      module: params.module,
      detail: params.detail,
      target_name: params.target_name || 'Sistem Klinik',
      target_id: params.target_id,
      status: params.status || 'SUCCESS',
      error_message: params.error_message || null,
      ip_address: ip,
      user_agent: navigator.userAgent,
      metadata: { device_time: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Gagal catat log:', error);
  }
};
