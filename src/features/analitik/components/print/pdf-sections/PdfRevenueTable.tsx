import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    borderLeftWidth: 3,
    borderLeftColor: '#1B9C90',
    paddingLeft: 6,
    marginBottom: 10,
  },
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 8,
    color: '#334155',
    fontWeight: 'semibold',
  },
  tableCellHighlight: {
    fontSize: 8,
    color: '#1B9C90',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  colTanggal: { flex: 2 },
  colTransaksi: { flex: 1.5, textAlign: 'center' },
  colLayanan: { flex: 2 },
  colObat: { flex: 2 },
  colTotal: { flex: 2, textAlign: 'right' },
});

interface PdfRevenueTableProps {
  transaksi: Array<{
    tanggal: string;
    totalTransaksi: number;
    pendapatanLayanan: string;
    pendapatanObat: string;
    totalPendapatan: string;
  }>;
}

export const PdfRevenueTable = ({ transaksi }: PdfRevenueTableProps) => {
  return (
    <View style={styles.container} wrap={true}>
      <Text style={styles.sectionTitle}>III. Rincian Laporan Ringkasan</Text>
      
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.tableHeaderCell, styles.colTanggal]}>Tanggal</Text>
          <Text style={[styles.tableHeaderCell, styles.colTransaksi]}>Total Transaksi</Text>
          <Text style={[styles.tableHeaderCell, styles.colLayanan]}>Pendapatan Layanan</Text>
          <Text style={[styles.tableHeaderCell, styles.colObat]}>Pendapatan Obat</Text>
          <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total Pendapatan</Text>
        </View>

        {/* Data Rows */}
        {transaksi.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={{ fontSize: 8, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', flex: 1, paddingVertical: 10 }}>
              Tidak ada data transaksi untuk periode ini.
            </Text>
          </View>
        ) : (
          transaksi.map((row, idx) => {
            const isEven = idx % 2 === 1;
            const rowBg = isEven ? { backgroundColor: '#F8FAFC' } : { backgroundColor: '#FFFFFF' };
            return (
              <View key={idx} style={[styles.tableRow, rowBg]} wrap={false}>
                <Text style={[styles.tableCell, styles.colTanggal]}>{row.tanggal}</Text>
                <Text style={[styles.tableCell, styles.colTransaksi]}>{row.totalTransaksi} Nota</Text>
                <Text style={[styles.tableCell, styles.colLayanan]}>{row.pendapatanLayanan}</Text>
                <Text style={[styles.tableCell, styles.colObat]}>{row.pendapatanObat}</Text>
                <Text style={[styles.tableCellHighlight, styles.colTotal]}>{row.totalPendapatan}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
