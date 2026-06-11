export interface AiInsight {
  tipe: 'info' | 'opportunity' | 'warning' | string;
  judul: string;
  pesan_tindakan: string;
}

export interface AiInsightsResponse {
  status: string;
  data: AiInsight[];
}
