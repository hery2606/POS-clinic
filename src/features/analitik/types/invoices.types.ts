export interface DaftarTransaksiBelumLunas {
  no_invoice: string;
  pasien: string;
  total_tagihan: number;
  hari_belum_lunas: number;
  status_reminder: string;
}

export interface PendingInvoicesResponse {
  status: string;
  data: {
    nilai_total_piutang: number;
    daftar_transaksi_belum_lunas: DaftarTransaksiBelumLunas[];
  };
}
