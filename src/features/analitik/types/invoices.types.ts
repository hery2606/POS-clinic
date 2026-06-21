export interface RingkasanAtas {
  total_nilai_piutang: number;
  total_transaksi_pending: number;
  rata_rata_umur_piutang_hari: number;
}

export interface GrafikUmurPiutang {
  "1_sd_2_hari": number;
  "3_sd_5_hari": number;
  "lebih_dari_7_hari": number;
}

export interface BreakdownPenjamin {
  [key: string]: number;
}

export interface Top3Penunggak {
  nama: string;
  sisa_tagihan: number;
}

export interface DaftarTransaksiBelumLunas {
  no_invoice: string;
  id_asli_transaksi?: string;
  pasien: string;
  sisa_tagihan: number;
  hari_belum_lunas: number;
  status_reminder: string;
  wa_number?: string;
  total_tagihan?: number;
}

export interface PendingInvoicesResponse {
  status: string;
  data: {
    ringkasan_atas: RingkasanAtas;
    grafik_umur_piutang: GrafikUmurPiutang;
    breakdown_penjamin: BreakdownPenjamin;
    top_3_penunggak: Top3Penunggak[];
    daftar_transaksi_belum_lunas: DaftarTransaksiBelumLunas[];
    // Backward compatible fallback
    nilai_total_piutang?: number;
  };
}
