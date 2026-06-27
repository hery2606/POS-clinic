import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    borderLeftWidth: 3,
    borderLeftColor: '#1B9C90',
    paddingLeft: 6,
    marginBottom: 12,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '55%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  rightColumn: {
    width: '40%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  chartLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#334155',
  },
  chartValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 7,
    color: '#64748B',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 9,
    color: '#0F172A',
    fontWeight: 'bold',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 7.5,
    color: '#64748B',
    lineHeight: 1.3,
    marginTop: 4,
  },
});

interface PdfOperationalAnalysisProps {
  transaksi: Array<{
    tanggal: string;
    totalTransaksi: number;
    pendapatanLayanan: string;
    pendapatanObat: string;
    totalPendapatan: string;
  }>;
}

const formatToRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export const PdfOperationalAnalysis = ({ transaksi }: PdfOperationalAnalysisProps) => {
  // Hitung total kontribusi pendapatan dari Layanan vs Obat secara dinamis
  let totalLayanan = 0;
  let totalObat = 0;
  let maxTxCount = 0;
  let peakDate = '-';
  let totalTx = 0;

  transaksi.forEach(t => {
    const lay = parseInt(t.pendapatanLayanan.replace(/[^0-9]/g, ''), 10) || 0;
    const obt = parseInt(t.pendapatanObat.replace(/[^0-9]/g, ''), 10) || 0;
    totalLayanan += lay;
    totalObat += obt;
    totalTx += t.totalTransaksi;

    if (t.totalTransaksi > maxTxCount) {
      maxTxCount = t.totalTransaksi;
      peakDate = t.tanggal;
    }
  });

  const grandTotal = totalLayanan + totalObat;
  const pctLayanan = grandTotal > 0 ? Math.round((totalLayanan / grandTotal) * 100) : 55;
  const pctObat = grandTotal > 0 ? 100 - pctLayanan : 45;

  const averageRevenue = transaksi.length > 0 ? Math.round(grandTotal / transaksi.length) : 0;

  return (
    <View style={styles.container} wrap={false}>
      <Text style={styles.sectionTitle}>I. Analisis Proporsi & Kinerja Operasional</Text>
      
      <View style={styles.flexRow}>
        {/* Kolom Kiri: Visualisasi Progress Bar Rasio Kontribusi */}
        <View style={styles.leftColumn}>
          <Text style={[styles.chartLabel, { marginBottom: 6, fontSize: 8.5 }]}>Rasio Kontribusi Sektor Pendapatan</Text>
          
          {/* Layanan Medis */}
          <View style={styles.chartLabelRow}>
            <Text style={styles.chartLabel}>Layanan Medis (Tindakan & Konsultasi)</Text>
            <Text style={styles.chartValue}>{pctLayanan}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${pctLayanan}%`, backgroundColor: '#1B9C90' }]} />
          </View>

          {/* Farmasi & Obat */}
          <View style={styles.chartLabelRow}>
            <Text style={styles.chartLabel}>Farmasi & Penjualan Obat</Text>
            <Text style={styles.chartValue}>{pctObat}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${pctObat}%`, backgroundColor: '#4F46E5' }]} />
          </View>

          <Text style={styles.descriptionText}>
            * Analisis di atas menggambarkan perbandingan volume nominal keuangan antara pelayanan medis langsung dan peredaran obat-obatan. Rasio kontribusi ideal membantu klinik menjaga keseimbangan arus kas pelayanan.
          </Text>
        </View>

        {/* Kolom Kanan: KPI Ringkasan Operasional */}
        <View style={styles.rightColumn}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Pendapatan Layanan</Text>
            <Text style={[styles.metricValue, { color: '#1B9C90' }]}>{formatToRupiah(totalLayanan)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Pendapatan Farmasi</Text>
            <Text style={[styles.metricValue, { color: '#4F46E5' }]}>{formatToRupiah(totalObat)}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Puncak Volume Kunjungan</Text>
            <Text style={styles.metricValue}>
              {peakDate !== '-' ? `${peakDate} (${maxTxCount} Nota)` : 'Tidak ada data'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
