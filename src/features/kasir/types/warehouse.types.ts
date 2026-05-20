export interface LokasiGudang {
  id: string;
  kode: string;
  nama: string;
  tipe: string;
  kapasitas: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseMedicine {
  id: string;
  kode: string;
  nama: string;
  kategori: 'obat_bebas' | 'obat_keras' | 'alkes' | string;
  satuan: string;
  hargaBeli: string; // Dikembalikan dalam bentuk string desimal (e.g., "5000.00")
  hargaJual: string; // Dikembalikan dalam bentuk string desimal (e.g., "7500.00")
  stokMinimum: number;
  stokSaatIni: number;
  lokasiGudangId: string | null;
  lokasiGudang: LokasiGudang | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehousePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WarehouseMedicineResponse {
  data: WarehouseMedicine[];
  meta: WarehousePaginationMeta;
}

// Tambahkan di bagian bawah file warehouse.types.ts

export interface WarehouseMedicineStats {
  total: number;
  aman: number;
  menipis: number;
  kritis: number;
}