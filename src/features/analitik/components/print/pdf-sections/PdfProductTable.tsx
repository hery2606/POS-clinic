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
    backgroundColor: '#334155',
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
  badgeProduk: {
    fontSize: 7,
    color: '#8E59FF',
    backgroundColor: '#F0EBFF',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    width: 60,
  },
  badgeLayanan: {
    fontSize: 7,
    color: '#1B9C90',
    backgroundColor: '#DFF6F2',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    width: 60,
  },
  tableCellHighlight: {
    fontSize: 8,
    color: '#0F172A',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  colRank: { flex: 0.8, textAlign: 'center' },
  colItem: { flex: 4 },
  colCategory: { flex: 2, alignItems: 'center' },
  colCount: { flex: 2, textAlign: 'right' },
  colValue: { flex: 2, textAlign: 'right' },
});

interface PdfProductTableProps {
  topProducts: Array<{
    item: string;
    count: number;
    value: number;
    type: "produk" | "layanan";
  }>;
}

export const PdfProductTable = ({ topProducts }: PdfProductTableProps) => {
  return (
    <View style={styles.container} wrap={false}>
      <Text style={styles.sectionTitle}>II. Produk & Layanan Terlaris (Bulan Ini)</Text>
      
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colRank]}>Rank</Text>
          <Text style={[styles.tableHeaderCell, styles.colItem]}>Nama Item</Text>
          <Text style={[styles.tableHeaderCell, styles.colCategory, { textAlign: 'center' }]}>Kategori</Text>
          <Text style={[styles.tableHeaderCell, styles.colCount]}>Total Penjualan</Text>
          <Text style={[styles.tableHeaderCell, styles.colValue]}>Rasio Kontribusi</Text>
        </View>

        {/* Data Rows */}
        {topProducts.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={{ fontSize: 8, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center', flex: 1, paddingVertical: 10 }}>
              Tidak ada data produk/layanan terlaris.
            </Text>
          </View>
        ) : (
          topProducts.map((row, idx) => {
            const isEven = idx % 2 === 1;
            const rowBg = isEven ? { backgroundColor: '#F8FAFC' } : { backgroundColor: '#FFFFFF' };
            const isProduk = row.type === 'produk';
            
            return (
              <View key={idx} style={[styles.tableRow, rowBg]}>
                <Text style={[styles.tableCell, styles.colRank]}>#{idx + 1}</Text>
                <Text style={[styles.tableCell, styles.colItem]}>{row.item}</Text>
                <View style={[styles.colCategory, { justifyContent: 'center' }]}>
                  <Text style={isProduk ? styles.badgeProduk : styles.badgeLayanan}>
                    {isProduk ? 'Produk' : 'Layanan'}
                  </Text>
                </View>
                <Text style={[styles.tableCell, styles.colCount]}>
                  {row.count.toLocaleString('id-ID')} {isProduk ? 'Unit' : 'Tx'}
                </Text>
                <Text style={[styles.tableCellHighlight, styles.colValue]}>{row.value}%</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};
