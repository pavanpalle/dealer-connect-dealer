import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors } from '../theme';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, PRODUCTS } from '../data/mockData';
import AppBar from '../components/AppBar';
import { RootStackParamList } from '../types';

export default function InvoiceViewScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'InvoiceView'>>();
  const { orders } = useOrders();
  const order = orders.find(o => o.id === route.params.orderId);

  if (!order) return null;

  const cgst = Math.round(order.gstAmt / 2);
  const sgst = order.gstAmt - cgst;

  return (
    <View style={styles.container}>
      <AppBar
        title="Tax Invoice"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity style={styles.iconBtn} onPress={() => Alert.alert('Download', 'Invoice PDF downloaded')}>
            <Text style={{ fontSize: 14 }}>{'\u{1F4E5}'}</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scroll}>
        <View style={styles.invHeader}>
          <View style={styles.companyRow}>
            <View style={styles.logoBox}><Text style={styles.logoText}>SSR</Text></View>
            <View>
              <Text style={styles.companyName}>SSR Enterprises</Text>
              <Text style={styles.companySub}>Super Stockist {'\u00b7'} Hyderabad</Text>
            </View>
          </View>
          <View style={styles.invMeta}>
            <View style={styles.invMetaRow}><Text style={styles.invMetaLabel}>Invoice</Text><Text style={styles.invMetaValue}>{order.inv}</Text></View>
            <View style={styles.invMetaRow}><Text style={styles.invMetaLabel}>Date</Text><Text style={styles.invMetaValue}>{order.date} 2026</Text></View>
            <View style={styles.invMetaRow}><Text style={styles.invMetaLabel}>GSTIN</Text><Text style={styles.invMetaValue}>36ABCDE1234F1Z5</Text></View>
          </View>
        </View>

        <View style={styles.billTo}>
          <Text style={styles.billToLabel}>BILL TO</Text>
          <Text style={styles.billToName}>{order.dealer}</Text>
          <Text style={styles.billToSub}>{order.loc} {'\u00b7'} {order.route}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Item</Text>
          <Text style={[styles.th, { flex: 0.5, textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.th, { flex: 0.7, textAlign: 'right' }]}>Rate</Text>
          <Text style={[styles.th, { flex: 0.5, textAlign: 'center' }]}>GST</Text>
          <Text style={[styles.th, { flex: 0.7, textAlign: 'right' }]}>Amount</Text>
        </View>
        {order.items.map((item, i) => {
          const gstAmt = Math.round(item.total * item.gst / 100);
          return (
            <View key={item.id} style={[styles.tableRow, i % 2 === 1 && { backgroundColor: Colors.surface2 }]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.tdName}>{item.name}</Text>
                <Text style={styles.tdSku}>{item.sku}</Text>
              </View>
              <Text style={[styles.td, { flex: 0.5, textAlign: 'center' }]}>{item.qty}</Text>
              <Text style={[styles.td, { flex: 0.7, textAlign: 'right' }]}>{'\u20b9'}{item.price.toFixed(2)}</Text>
              <Text style={[styles.td, { flex: 0.5, textAlign: 'center' }]}>{item.gst}%</Text>
              <Text style={[styles.td, { flex: 0.7, textAlign: 'right', fontWeight: '700' }]}>{formatCurrency(item.total + gstAmt)}</Text>
            </View>
          );
        })}

        <View style={styles.taxSummary}>
          <View style={styles.taxRow}><Text style={styles.taxLabel}>Subtotal</Text><Text style={styles.taxValue}>{formatCurrency(order.sub)}</Text></View>
          <View style={styles.taxRow}><Text style={styles.taxLabel}>CGST</Text><Text style={styles.taxValue}>{formatCurrency(cgst)}</Text></View>
          <View style={styles.taxRow}><Text style={styles.taxLabel}>SGST</Text><Text style={styles.taxValue}>{formatCurrency(sgst)}</Text></View>
          <View style={styles.grandRow}><Text style={styles.grandLabel}>Grand Total</Text><Text style={styles.grandValue}>{formatCurrency(order.grand)}</Text></View>
        </View>

        <View style={styles.footer}>
          <View style={[styles.paidBadge, { backgroundColor: order.paid ? Colors.greenLight : Colors.amberLight }]}>
            <Text style={[styles.paidText, { color: order.paid ? Colors.green : Colors.amber }]}>
              {order.paid ? 'PAID' : 'UNPAID'} {order.paid && order.pay ? `\u00b7 ${order.pay}` : ''}
            </Text>
          </View>
          <View style={styles.bankSection}>
            <Text style={styles.bankTitle}>Bank Details</Text>
            <Text style={styles.bankText}>SSR Enterprises{'\n'}HDFC Bank, Ameerpet Branch{'\n'}A/C: 50200042587412{'\n'}IFSC: HDFC0001234</Text>
          </View>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  iconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  invHeader: { backgroundColor: '#1E293B', padding: 16 },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  logoBox: { width: 36, height: 36, borderRadius: 9, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  companyName: { fontSize: 16, fontWeight: '800', color: '#fff' },
  companySub: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  invMeta: { gap: 4 },
  invMetaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  invMetaLabel: { fontSize: 11, color: '#94A3B8' },
  invMetaValue: { fontSize: 11, color: '#fff', fontWeight: '700' },
  billTo: { padding: 14, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  billToLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, marginBottom: 4 },
  billToName: { fontSize: 14, fontWeight: '800' },
  billToSub: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.surface2, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  th: { fontSize: 9, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  tdName: { fontSize: 11, fontWeight: '600' },
  tdSku: { fontSize: 9, color: Colors.ink4 },
  td: { fontSize: 11, fontWeight: '500' },
  taxSummary: { padding: 14, backgroundColor: Colors.surface },
  taxRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  taxLabel: { fontSize: 11, color: Colors.ink3 },
  taxValue: { fontSize: 11, fontWeight: '600' },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginTop: 6, borderTopWidth: 1.5, borderTopColor: Colors.border },
  grandLabel: { fontSize: 14, fontWeight: '800' },
  grandValue: { fontSize: 16, fontWeight: '800', color: Colors.blue },
  footer: { padding: 14, gap: 12 },
  paidBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  paidText: { fontSize: 12, fontWeight: '800' },
  bankSection: { backgroundColor: Colors.surface, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.border },
  bankTitle: { fontSize: 11, fontWeight: '700', color: Colors.ink3, marginBottom: 6 },
  bankText: { fontSize: 11, color: Colors.ink2, lineHeight: 18 },
});
