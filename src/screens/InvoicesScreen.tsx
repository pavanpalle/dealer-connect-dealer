import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatCurrency } from '../data/mockData';
import Card from '../components/Card';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function InvoicesScreen() {
  const { dealer } = useAuth();
  const { orders } = useOrders();
  const navigation = useNavigation<Nav>();

  if (!dealer) return null;
  const myOrders = orders.filter(o => o.did === dealer.id && o.inv);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <Text style={styles.subtitle}>{myOrders.length} invoices</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {myOrders.map(order => (
          <TouchableOpacity key={order.id} activeOpacity={0.7} onPress={() => navigation.navigate('InvoiceView', { orderId: order.id })}>
            <Card style={styles.invCard}>
              <View style={styles.invRow}>
                <View style={styles.invIcon}>
                  <Text style={{ fontSize: 18 }}>{'\u{1F4C4}'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invNumber}>{order.inv}</Text>
                  <Text style={styles.invMeta}>#{order.id} {'\u00b7'} {order.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.invAmount}>{formatCurrency(order.grand)}</Text>
                  <View style={[styles.paidPill, { backgroundColor: order.paid ? Colors.greenLight : Colors.amberLight }]}>
                    <Text style={[styles.paidText, { color: order.paid ? Colors.green : Colors.amber }]}>
                      {order.paid ? 'Paid' : 'Unpaid'}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        {myOrders.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 32 }}>{'\u{1F4C4}'}</Text>
            <Text style={styles.emptyText}>No invoices yet</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 11, color: Colors.ink3, marginTop: 2, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 10 },
  invCard: { padding: 14 },
  invRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  invIcon: { width: 40, height: 40, borderRadius: 11, backgroundColor: Colors.purpleLight, alignItems: 'center', justifyContent: 'center' },
  invNumber: { fontSize: 13, fontWeight: '800', color: Colors.blue },
  invMeta: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  invAmount: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  paidPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  paidText: { fontSize: 10, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, fontWeight: '700', marginTop: 12 },
});
