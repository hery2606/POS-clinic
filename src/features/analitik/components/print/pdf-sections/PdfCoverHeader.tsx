import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { KLINIK_INFO } from '../pdfConfig';

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  metaPrintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 9,
    color: '#64748B', // Warna abu-abu halus persis print bawaan browser
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1B9C90',
    paddingBottom: 16,
    marginBottom: 24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#B0B0B0', // Abu-abu muda seperti di gambar
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  clinicAddress: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: 'medium',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  badge: {
    color: '#1B9C90',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  printedDate: {
    fontSize: 9,
    color: '#475569',
    marginTop: 6,
    fontWeight: 'normal',
  },
});

interface PdfCoverHeaderProps {
  tanggalCetak: string;
}

export const PdfCoverHeader = ({ tanggalCetak }: PdfCoverHeaderProps) => {
  const now = new Date();
  const datePart = `${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'AM' : 'PM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const printTime = `${datePart}, ${hours}:${minutes} ${ampm}`;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.metaPrintHeader}>
        <Text style={styles.metaText}>{printTime}</Text>
        <Text style={styles.metaText}>klinik-payment</Text>
      </View>
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
    </View>
  );
};
