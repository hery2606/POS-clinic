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
  paymentsContainer: {
    flexDirection: 'column',
    marginTop: 5,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodColorIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  paymentMethodName: {
    fontSize: 8,
    color: '#334155',
    fontWeight: 'bold',
  },
  paymentMethodMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentPercentage: {
    fontSize: 8,
    color: '#0F172A',
    fontWeight: 'bold',
    marginRight: 10,
  },
  paymentAmount: {
    fontSize: 8,
    color: '#475569',
    width: 80,
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 8,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});

const getMethodColor = (method: string): string => {
  const norm = method.trim().toUpperCase();
  if (norm === 'QRIS') return '#1B9C90';
  if (norm === 'DEBIT') return '#F2A618';
  if (norm === 'TUNAI' || norm === 'CASH') return '#2297eb';
  if (norm === 'TRANSFER') return '#8E59FF';
  return '#64748B';
};

interface PdfChartSectionProps {
  chartAreaBase64?: string;
  chartBarStackedBase64?: string; // Ini menyimpan screenshot Distribusi Layanan Medis
  payments?: Array<{
    method: string;
    percentage: number;
    amount: string;
  }>;
}

export const PdfChartSection = ({
  chartAreaBase64,
  chartBarStackedBase64,
  payments,
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

        <View style={styles.halfChartWrapper} wrap={false}>
          <Text style={styles.chartTitle}>Metode Pembayaran</Text>
          <View style={styles.paymentsContainer}>
            {payments && payments.length > 0 ? (
              payments.map((p, idx) => (
                <View key={idx} style={styles.paymentRow}>
                  <View style={styles.paymentMethodInfo}>
                    <View style={[styles.methodColorIndicator, { backgroundColor: getMethodColor(p.method) }]} />
                    <Text style={styles.paymentMethodName}>{p.method}</Text>
                  </View>
                  <View style={styles.paymentMethodMetrics}>
                    <Text style={styles.paymentPercentage}>{p.percentage}%</Text>
                    <Text style={styles.paymentAmount}>{p.amount}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Tidak ada data pembayaran.</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
