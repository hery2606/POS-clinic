export interface VisumReport {
  report_id: string;
  generated_at: string;
  narasi_laporan: string;
  pdf_download_url: string;
}

export interface VisumGenerateResponse {
  status: string;
  data: VisumReport;
}

// src/features/analitik/types/visum.types.ts

export interface VisumReportData {
  raw_markdown: string;
}

export interface VisumReport {
  status: string;
  data: VisumReportData;
}