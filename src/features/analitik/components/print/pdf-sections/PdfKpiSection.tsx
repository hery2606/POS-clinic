import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 4,
    fontWeight: 'bold',
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 25,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  kpiTitle: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  kpiValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 6,
  },
  kpiTrendBadgePositive: {
    marginTop: 6,
    fontSize: 8,
    color: '#15803D',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  kpiTrendBadgeNegative: {
    marginTop: 6,
    fontSize: 8,
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  kpiTrendBadgeNeutral: {
    marginTop: 6,
    fontSize: 8,
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
});

interface PdfKpiSectionProps {
  pendapatanHariIni: string;
  pendapatanMingguIni: string;
  totalPendapatanBulanan: string;
  trendHarian: string;
  trendMingguan: string;
  statusBulanan: string;
  periodLabel: string;
}

export const PdfKpiSection = ({
  pendapatanHariIni,
  pendapatanMingguIni,
  totalPendapatanBulanan,
  trendHarian,
  trendMingguan,
  statusBulanan,
  periodLabel,
}: PdfKpiSectionProps) => {
  const getTrendStyle = (trendText: string) => {
    if (trendText.includes('-')) {
      return styles.kpiTrendBadgeNegative;
    }
    if (trendText.includes('+')) {
      return styles.kpiTrendBadgePositive;
    }
    return styles.kpiTrendBadgeNeutral;
  };

  return (
    <View>
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Laporan Eksekutif Analitik & Pendapatan</Text>
        <Text style={styles.subtitle}>Periode Frekuensi Analisis: {periodLabel}</Text>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiTitle}>Pendapatan Hari Ini</Text>
          <Text style={styles.kpiValue}>{pendapatanHariIni}</Text>
          <Text style={getTrendStyle(trendHarian)}>{trendHarian}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiTitle}>Pendapatan Minggu Ini</Text>
          <Text style={styles.kpiValue}>{pendapatanMingguIni}</Text>
          <Text style={getTrendStyle(trendMingguan)}>{trendMingguan}</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiTitle}>Total Pendapatan Bulanan</Text>
          <Text style={styles.kpiValue}>{totalPendapatanBulanan}</Text>
          <Text style={styles.kpiTrendBadgeNeutral}>{statusBulanan}</Text>
        </View>
      </View>
    </View>
  );
};
