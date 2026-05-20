export interface PatientData {
  id: string;
  noRm: string;
  nik: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  telepon: string;
  noBpjs: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PatientListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PatientListResponse {
  success: boolean;
  data: {
    data: PatientData[];
    meta: PatientListMeta;
  };
  timestamp: string;
}

export interface PatientListResponse {
  success: boolean;
  data: {
    data: PatientData[]; 
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  timestamp: string;
}