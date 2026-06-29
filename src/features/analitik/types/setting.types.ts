export interface ActivityLogItem {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_email: string;
  action: string;
  module: string;
  target_name: string;
  target_id: string;
  detail: string;
  status: string;
  error_message: string | null;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ActivityLogMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ActivityLogData {
  data: ActivityLogItem[];
  meta: ActivityLogMeta;
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

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserResponse {
  message: string;
  user: UserDetail;
}

export interface CreateActivityLogRequest {
  admin_id: string;
  admin_name: string;
  admin_email: string;
  action: string;
  module: string;
  status: string;
  target_name: string;
  target_id?: string | null;
  detail: string;
  error_message?: string | null;
  ip_address: string;
  user_agent: string;
  metadata?: Record<string, any>;
}

export interface CreateActivityLogResponse {
  status: string;
  message?: string;
  data?: any;
}
