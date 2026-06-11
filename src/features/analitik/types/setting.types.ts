export interface ActivityLogItem {
  waktu: string;
  user: string;
  modul: string;
  aksi: string;
  status: string;
}

export interface ActivityLogMetrics {
  total_aktivitas: number;
  aktivitas_berhasil: number;
  aktivitas_gagal: number;
}

export interface ActivityLogData {
  metrik_aktivitas: ActivityLogMetrics;
  riwayat_aktivitas: ActivityLogItem[];
}

export interface ActivityLogResponse {
  status: string;
  data: ActivityLogData;
}

export interface SessionItem {
  id_sesi: string;
  ip_address: string;
  browser_os: string;
  login_terakhir: string;
  status: string;
}

export interface CurrentSession {
  ip_address: string;
  browser_os: string;
  status: string;
}

export interface SessionData {
  sesi_saat_ini: CurrentSession;
  sesi_aktif_lainnya: SessionItem[];
}

export interface SessionResponse {
  status: string;
  data: SessionData;
}

export interface RevokeSessionResponse {
  status: string;
  message: string;
}
