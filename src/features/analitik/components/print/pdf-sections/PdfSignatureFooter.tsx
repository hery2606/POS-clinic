import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PENANDATANGAN } from '../pdfConfig';

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'dashed',
    paddingTop: 15,
    marginTop: 20,
  },
  disclaimer: {
    fontSize: 7,
    fontStyle: 'italic',
    color: '#94A3B8',
    flex: 1,
    paddingRight: 20,
    fontWeight: 'semibold',
  },
  signatureBlock: {
    alignItems: 'center',
    width: 160,
  },
  roleText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 35,
  },
  nameText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0F172A',
    textDecoration: 'underline',
  },
  nipText: {
    fontSize: 7,
    color: '#94A3B8',
    fontWeight: 'bold',
    marginTop: 3,
  },
});

export const PdfSignatureFooter = () => {
  return (
    <View style={styles.footerContainer} wrap={false}>
      <Text style={styles.disclaimer}>{PENANDATANGAN.disclaimer}</Text>
      <View style={styles.signatureBlock}>
        <Text style={styles.roleText}>{PENANDATANGAN.jabatan},</Text>
        <Text style={styles.nameText}>{PENANDATANGAN.nama}</Text>
        <Text style={styles.nipText}>NIP. {PENANDATANGAN.nip}</Text>
      </View>
    </View>
  );
};
