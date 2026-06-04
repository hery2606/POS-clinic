export interface BillingDetailItem {
  id: string;
  billingId: string;
  tarifLayananId: string | null;
  namaLayanan: string;
  harga: string;
  jumlah: number;
  subTotal: string;
  isBpjs: boolean;
  createdAt: string;
}

export interface BillingPasien {
  id: string;
  noRm: string;
  nik: string;
  nikHash: string;
  namaLengkap: string;
  tanggalLahir: string;
  jenisKelamin: 'LAKI_LAKI' | 'PEREMPUAN';
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kabupaten: string | null;
  provinsi: string | null;
  kodePos: string | null;
  telepon: string;
  email: string;
  golonganDarah: string | null;
  alergi: string[];
  noBpjs: string | null;
  jenisPeserta: string | null;
  fktp: string | null;
  ihsNumber: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingJanji {
  id: string;
  pasienId: string;
  jadwalId: string;
  tanggalKunjungan: string;
  noAntrian: string;
  status: 'SELESAI' | 'DALAM_PROSES' | 'DIBATALKAN' | string;
  waktuHadir: string;
  waktuDipanggil: string;
  waktuSelesai: string;
  jenisKunjunganBpjs: string | null;
  noRujukanFktp: string | null;
  tanggalRujukan: string | null;
  poliTujuanBpjs: string | null;
  noSep: string | null;
  catatan: string;
  createdAt: string;
  updatedAt: string;
  pasien: BillingPasien;
}

export interface Billing {
  id: string;
  janjiId: string;
  rekamMedisId: string;
  totalBiaya: string;
  totalBpjs: string;
  totalNonBpjs: string;
  status: 'LUNAS' | 'BELUM_LUNAS' | 'SEBAGIAN' | string;
  metodePembayaran: 'TUNAI' | 'TRANSFER' | 'KARTU_KREDIT' | string;
  noInvoice: string;
  noSep: string | null;
  tanggalBayar: string | null;
  pdfPath: string | null;
  createdAt: string;
  updatedAt: string;
  detail: BillingDetailItem[];
  janji: BillingJanji;
}

export interface BillingResponse {
  success: boolean;
  data: Billing[];
  timestamp: string;
}

export interface BillingPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BillingPaginatedResponse {
  success: boolean;
  data: Billing[];
  meta: BillingPaginationMeta;
  timestamp: string;
}
