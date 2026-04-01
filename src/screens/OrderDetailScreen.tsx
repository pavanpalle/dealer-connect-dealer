import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, PRODUCTS } from '../data/mockData';
import AppBar from '../components/AppBar';
import Card from '../components/Card';
import StatusPill from '../components/StatusPill';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TIMELINE: Record<string, { dot: string; t: string; s: string }[]> = {};

function getTimeline(order: { status: string; date: string; time: string; vehicle: string }) {
  const base = { dot: Colors.green, t: 'Order Placed', s: `${order.date} \u00b7 ${order.time}` };
  if (order.status === 'delivered') {
    return [
      { dot: Colors.green, t: 'Order Delivered', s: `Signed off \u00b7 ${order.time}` },
      { dot: Colors.green, t: 'Out for Delivery', s: order.vehicle || 'Dispatched' },
      { dot: Colors.green, t: 'Confirmed & Packed', s: 'Warehouse ready' },
      base,
    ];
  }
  if (order.status === 'processing') {
    return [
      { dot: Colors.blue, t: 'Out for Delivery', s: order.vehicle || 'En route' },
      { dot: Colors.green, t: 'Confirmed & Packed', s: 'Warehouse ready' },
      base,
    ];
  }
  if (order.status === 'cancelled') {
    return [{ dot: Colors.red, t: 'Order Cancelled', s: `Cancelled \u00b7 ${order.time}` }];
  }
  return [
    { dot: Colors.amber, t: 'Awaiting Confirmation', s: 'Pending SSR action' },
    base,
  ];
}

export default function OrderDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetail'>>();
  const { orders } = useOrders();
  const order = orders.find(o => o.id === route.params.orderId);

  if (!order) return null;

  const timeline = getTimeline(order);

  return (
    <View style={styles.container}>
      <AppBar
        title={`#${order.id}`}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('InvoiceView', { orderId: order.id })}>
            <Text style={{ fontSize: 14 }}>{'\u{1F4C4}'}</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scroll}>
        <View style={styles.statusRow}>
          <StatusPill status={order.status} />
          <Text style={styles.dateText}>{order.date} {'\u00b7'} {order.time}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ORDER TIMELINE</Text>
          <Card style={{ padding: 14 }}>
            {timeline.map((tl, i) => (
              <View key={i} style={[styles.tlRow, i < timeline.length - 1 && { marginBottom: 14 }]}>
                <View style={styles.tlDotCol}>
                  <View style={[styles.tlDot, { backgroundColor: tl.dot }]} />
                  {i < timeline.length - 1 && <View style={[styles.tlLine, { backgroundColor: tl.dot + '66' }]} />}
                </View>
                <View>
                  <Text style={styles.tlTitle}>{tl.t}</Text>
                  <Text style={styles.tlSub}>{tl.s}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ITEMS ({order.items.length})</Text>
          <Card>
            {order.items.map((item, i) => {
              const product = PRODUCTS.find(p => p.id === item.id);
              const gstAmt = Math.round(item.total * item.gst / 100);
              return (
                <View key={item.id} style={[styles.itemRow, i < order.items.length - 1 && styles.itemBorder]}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemMeta}>{item.sku} {'\u00b7'} HSN {product?.hsn || '0401'} {'\u00b7'} GST {item.gst}%</Text>
                    </View>
                    <Text style={styles.itemTotal}>{formatCurrency(item.total)}</Text>
                  </View>
                  <View style={styles.itemStats}>
                    <View style={styles.itemStat}><Text style={styles.itemStatLabel}>QTY</Text><Text style={styles.itemStatVal}>{item.qty}</Text></View>
                    <View style={styles.itemStat}><Text style={styles.itemStatLabel}>RATE</Text><Text style={styles.itemStatVal}>{'\u20b9'}{item.price.toFixed(2)}</Text></View>
                    <View style={[styles.itemStat, { borderRightWidth: 0 }]}><Text style={styles.itemStatLabel}>GST</Text><Text style={styles.itemStatVal}>{'\u20b9'}{gstAmt}</Text></View>
                  </View>
                </View>
              );
            })}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{formatCurrency(order.sub)}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>GST</Text><Text style={styles.summaryValue}>{formatCurrency(order.gstAmt)}</Text></View>
              <View style={[styles.summaryRow, styles.grandRow]}><Text style={styles.grandLabel}>Grand Total</Text><Text style={styles.grandValue}>{formatCurrency(order.grand)}</Text></View>
            </View>
          </Card>
        </View>

        {!order.paid && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.payBtn} onPress={() => Alert.alert('Payment', 'Redirecting to payment...')}>
              <Text style={styles.payBtnText}>{'\u{1F4B3}'} Pay Now \u2014 {formatCurrency(order.grand)}</Text>
            </TouchableOpacity>
          </View>
        )}
        {order.paid && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.receiptBtn} onPress={() => Alert.alert('Receipt', 'Download started')}>
              <Text style={styles.receiptBtnText}>{'\u{1F4E5}'} Download Receipt</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  iconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  dateText: { fontSize: 11, color: Colors.ink3, fontWeight: '500' },
  section: { paddingHorizontal: 14, marginBottom: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, marginBottom: 8 },
  tlRow: { flexDirection: 'row', gap: 11 },
  tlDotCol: { alignItems: 'center', flexShrink: 0 },
  tlDot: { width: 11, height: 11, borderRadius: 6, marginTop: 3, flexShrink: 0 },
  tlLine: { width: 2, flex: 1, minHeight: 14, marginTop: 3 },
  tlTitle: { fontSize: 13, fontWeight: '700' },
  tlSub: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  itemRow: { padding: 11, paddingHorizontal: 14 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 7 },
  itemName: { fontSize: 13, fontWeight: '700' },
  itemMeta: { fontSize: 10, color: Colors.ink3, marginTop: 1 },
  itemTotal: { fontSize: 14, fontWeight: '800' },
  itemStats: { flexDirection: 'row', backgroundColor: Colors.surface2, borderRadius: 7, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  itemStat: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
  itemStatLabel: { fontSize: 9, color: Colors.ink3, fontWeight: '600' },
  itemStatVal: { fontSize: 12, fontWeight: '800', marginTop: 1 },
  summarySection: { backgroundColor: Colors.surface2, padding: 12, paddingHorizontal: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryLabel: { fontSize: 11, color: Colors.ink3, fontWeight: '600' },
  summaryValue: { fontSize: 12, fontWeight: '700' },
  grandRow: { paddingTop: 10, marginTop: 5, borderTopWidth: 1.5, borderTopColor: Colors.border, marginBottom: 0 },
  grandLabel: { fontSize: 14, fontWeight: '800' },
  grandValue: { fontSize: 18, fontWeight: '800', color: Colors.blue },
  payBtn: { backgroundColor: Colors.blue, borderRadius: 12, padding: 15, alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  receiptBtn: { backgroundColor: Colors.surface, borderRadius: 12, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  receiptBtnText: { color: Colors.blue, fontSize: 14, fontWeight: '700' },
});
