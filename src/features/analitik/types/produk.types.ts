export interface ProdukTerlarisData {
  nama_obat: string;
  jumlah_terjual: number;
  pendapatan_produk: number;
}

export interface LayananTerlarisData {
  nama_layanan: string;
  jumlah_transaksi: number;
  pendapatan_layanan: number;
}

export interface ProductAnalyticsResponse {
  status: string;
  data: {
    produk_terlaris_top_10: ProdukTerlarisData[];
    pemeriksaan_layanan_terlaris: LayananTerlarisData[];
  };
}
