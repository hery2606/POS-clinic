import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { KLINIK_INFO } from '../pdfConfig';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1B9C90',
    paddingBottom: 15,
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1B9C90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  clinicAddress: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 3,
    fontWeight: 'medium',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#E8F7F5',
    color: '#1B9C90',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  printedDate: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: 'semibold',
  },
});

interface PdfCoverHeaderProps {
  tanggalCetak: string;
}

export const PdfCoverHeader = ({ tanggalCetak }: PdfCoverHeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.clinicName}>{KLINIK_INFO.nama}</Text>
          <Text style={styles.clinicAddress}>{KLINIK_INFO.alamat}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.badge}>{KLINIK_INFO.labelDokumen}</Text>
        <Text style={styles.printedDate}>Dicetak: {tanggalCetak}</Text>
      </View>
    </View>
  );
};
