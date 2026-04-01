import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../data/mockData';
import AppBar from '../components/AppBar';
import StatGrid from '../components/StatGrid';
import Card from '../components/Card';

const TRANSACTIONS = [
  { id: 'TXN-001', desc: 'Payment - Order #ORD-4821', date: '28 Mar', amount: 4634, type: 'credit', status: 'paid' },
  { id: 'TXN-002', desc: 'Invoice - Order #ORD-4820', date: '29 Mar', amount: 1666, type: 'debit', status: 'due' },
  { id: 'TXN-003', desc: 'Payment - Order #ORD-4819', date: '27 Mar', amount: 2996, type: 'credit', status: 'paid' },
  { id: 'TXN-004', desc: 'Credit Note - Return', date: '25 Mar', amount: 450, type: 'credit', status: 'paid' },
  { id: 'TXN-005', desc: 'Invoice - Order #ORD-4815', date: '20 Mar', amount: 3200, type: 'debit', status: 'paid' },
];

export default function PaymentsScreen() {
  const navigation = useNavigation();
  const { dealer } = useAuth();

  if (!dealer) return null;

  const available = dealer.credit - dealer.outstanding;
  const totalPaid = 82400;

  return (
    <View style={styles.container}>
      <AppBar title="Payments & Ledger" subtitle="Credit & transaction history" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          <StatGrid items={[
            { label: 'Credit Limit', value: formatCurrency(dealer.credit), color: Colors.blue },
            { label: 'Available', value: formatCurrency(available), color: Colors.green },
            { label: 'Total Paid', value: formatCurrency(totalPaid), color: Colors.green },
            { label: 'Outstanding', value: dealer.outstanding > 0 ? formatCurrency(dealer.outstanding) : '\u20b90', color: dealer.outstanding > 0 ? Colors.red : Colors.green },
          ]} />
        </View>

        {dealer.outstanding > 0 && (
          <View style={styles.section}>
            <View style={styles.alertBanner}>
              <View style={styles.alertIcon}>
                <Text style={{ fontSize: 14 }}>{'\u26A0\uFE0F'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Outstanding: {formatCurrency(dealer.outstanding)}</Text>
                <Text style={styles.alertSub}>Please clear dues to maintain credit</Text>
              </View>
              <TouchableOpacity style={styles.alertBtn} onPress={() => Alert.alert('Payment', 'Redirecting to payment...')}>
                <Text style={styles.alertBtnText}>Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STATEMENT</Text>
          <Card>
            {TRANSACTIONS.map((txn, i) => (
              <View key={txn.id} style={[styles.txnRow, i < TRANSACTIONS.length - 1 && styles.txnBorder]}>
                <View style={[styles.txnIcon, { backgroundColor: txn.type === 'credit' ? Colors.greenLight : Colors.amberLight }]}>
                  <Text style={{ fontSize: 14 }}>
                    {txn.type === 'credit' ? '\u2193' : '\u2191'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txnDesc}>{txn.desc}</Text>
                  <Text style={styles.txnDate}>{txn.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? Colors.green : Colors.ink }]}>
                    {txn.type === 'credit' ? '+' : ''}{formatCurrency(txn.amount)}
                  </Text>
                  <View style={[styles.statusPill, { backgroundColor: txn.status === 'paid' ? Colors.greenLight : Colors.amberLight }]}>
                    <Text style={[styles.statusText, { color: txn.status === 'paid' ? Colors.green : Colors.amber }]}>
                      {txn.status === 'paid' ? 'Paid' : 'Due'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  section: { padding: 13, paddingHorizontal: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, marginBottom: 8 },
  alertBanner: { backgroundColor: Colors.redLight, borderWidth: 1, borderColor: '#F5A6A0', borderRadius: 11, padding: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  alertIcon: { width: 30, height: 30, backgroundColor: Colors.red, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  alertTitle: { fontSize: 12, fontWeight: '800', color: Colors.red },
  alertSub: { fontSize: 10, color: Colors.red, marginTop: 1 },
  alertBtn: { backgroundColor: Colors.red, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  alertBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  txnRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 14, gap: 10 },
  txnBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txnIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  txnDesc: { fontSize: 12, fontWeight: '600' },
  txnDate: { fontSize: 10, color: Colors.ink3, marginTop: 2 },
  txnAmount: { fontSize: 14, fontWeight: '800' },
  statusPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20, marginTop: 3 },
  statusText: { fontSize: 9, fontWeight: '700' },
});
