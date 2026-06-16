export interface LocalDaftarTransaksiBelumLunas {
  no_invoice: string;
  pasien: string;
  total_tagihan: number;
  hari_belum_lunas: number;
  status_reminder: string;
  wa_number: string;
  insurance_type?: string;
}
