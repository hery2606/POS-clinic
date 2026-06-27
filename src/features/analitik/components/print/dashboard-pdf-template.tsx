import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { PdfCoverHeader } from './pdf-sections/PdfCoverHeader';
import { PdfKpiSection } from './pdf-sections/PdfKpiSection';
import { PdfChartSection } from './pdf-sections/PdfChartSection';
import { PdfOperationalAnalysis } from './pdf-sections/PdfOperationalAnalysis';
import { PdfProductTable } from './pdf-sections/PdfProductTable';
import { PdfRevenueTable } from './pdf-sections/PdfRevenueTable';
import { PdfSignatureFooter } from './pdf-sections/PdfSignatureFooter';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    flexDirection: 'column',
  },
});

interface DashboardPdfTemplateProps {
  data: {
    pendapatanHariIni: string;
    pendapatanMingguIni: string;
    totalPendapatanBulanan: string;
    trendHarian: string;
    trendMingguan: string;
    statusBulanan: string;
    periodLabel: string;
    tanggalCetak: string;
    transaksi: Array<{
      tanggal: string;
      totalTransaksi: number;
      pendapatanLayanan: string;
      pendapatanObat: string;
      totalPendapatan: string;
    }>;
    topProducts: Array<{
      item: string;
      count: number;
      value: number;
      type: "produk" | "layanan";
    }>;
  };
  charts?: {
    chartBarMixed?: string;
    chartBarStacked?: string;
  };
}

export const DashboardPdfTemplate = ({ data, charts }: DashboardPdfTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfCoverHeader tanggalCetak={data.tanggalCetak} />
        
        <PdfKpiSection
          pendapatanHariIni={data.pendapatanHariIni}
          pendapatanMingguIni={data.pendapatanMingguIni}
          totalPendapatanBulanan={data.totalPendapatanBulanan}
          trendHarian={data.trendHarian}
          trendMingguan={data.trendMingguan}
          statusBulanan={data.statusBulanan}
          periodLabel={data.periodLabel}
        />

        <PdfOperationalAnalysis transaksi={data.transaksi} />

        <PdfChartSection
          chartBarMixedBase64={charts?.chartBarMixed}
          chartBarStackedBase64={charts?.chartBarStacked}
        />

        <PdfProductTable topProducts={data.topProducts} />

        <PdfRevenueTable transaksi={data.transaksi} />

        <PdfSignatureFooter />
      </Page>
    </Document>
  );
};
