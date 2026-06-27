import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  chartSection: {
    marginBottom: 15,
  },
  chartWrapper: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfChartWrapper: {
    width: '49%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  chartTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartImageArea: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
  },
  chartImageBar: {
    width: '100%',
    height: 170,
    objectFit: 'contain',
  },
});

interface PdfChartSectionProps {
  chartAreaBase64?: string;
  chartBarMixedBase64?: string; // Ini menyimpan screenshot Metode Pembayaran
  chartBarStackedBase64?: string; // Ini menyimpan screenshot Distribusi Layanan Medis
}

export const PdfChartSection = ({
  chartAreaBase64,
  chartBarMixedBase64,
  chartBarStackedBase64,
}: PdfChartSectionProps) => {
  return (
    <View style={styles.chartSection}>
      {chartAreaBase64 ? (
        <View style={styles.chartWrapper} wrap={false}>
          <Text style={styles.chartTitle}>Tren Kunjungan & Pendapatan Harian</Text>
          <Image src={chartAreaBase64} style={styles.chartImageArea} />
        </View>
      ) : null}

      <View style={styles.chartRow}>
        {chartBarStackedBase64 ? (
          <View style={styles.halfChartWrapper} wrap={false}>
            <Text style={styles.chartTitle}>Distribusi Layanan Medis</Text>
            <Image src={chartBarStackedBase64} style={styles.chartImageBar} />
          </View>
        ) : null}

        {chartBarMixedBase64 ? (
          <View style={styles.halfChartWrapper} wrap={false}>
            <Text style={styles.chartTitle}>Metode Pembayaran</Text>
            <Image src={chartBarMixedBase64} style={styles.chartImageBar} />
          </View>
        ) : null}
      </View>
    </View>
  );
};
