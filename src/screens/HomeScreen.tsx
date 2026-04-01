import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatCurrency } from '../data/mockData';
import StatGrid from '../components/StatGrid';
import StatusPill from '../components/StatusPill';
import Card from '../components/Card';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { dealer, logout } = useAuth();
  const { orders } = useOrders();
  const navigation = useNavigation<Nav>();

  if (!dealer) return null;

  const myOrders = orders.filter(o => o.did === dealer.id);
  const recentOrders = myOrders.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.dealerName}>{dealer.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.iconText}>{'\u{1F514}'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={logout}>
              <Text style={styles.iconText}>{'\u{1F6AA}'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.pills}>
          <View style={[styles.infoPill, { backgroundColor: Colors.blueLight }]}>
            <Text style={[styles.infoPillText, { color: Colors.blue }]}>{dealer.lid}</Text>
          </View>
          <View style={[styles.infoPill, { backgroundColor: Colors.greenLight }]}>
            <Text style={[styles.infoPillText, { color: Colors.green }]}>{dealer.loc}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <StatGrid items={[
            { label: 'This Month', value: formatCurrency(dealer.mamt), color: Colors.blue },
            { label: 'Outstanding', value: dealer.outstanding > 0 ? formatCurrency(dealer.outstanding) : '\u20b90', color: dealer.outstanding > 0 ? Colors.red : Colors.green },
            { label: 'Orders', value: String(dealer.orders), color: Colors.green },
            { label: 'Credit Left', value: formatCurrency(dealer.credit - dealer.outstanding), color: Colors.amber },
          ]} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <TouchableOpacity style={styles.placeOrderBtn} onPress={() => navigation.navigate('PlaceOrder')} activeOpacity={0.8}>
            <View style={styles.placeOrderIcon}>
              <Text style={{ fontSize: 18 }}>{'\u{1F6D2}'}</Text>
            </View>
            <View>
              <Text style={styles.placeOrderTitle}>Place Bulk Order</Text>
              <Text style={styles.placeOrderSub}>Case pricing {'\u00b7'} Up to 12% off</Text>
            </View>
            <Text style={styles.placeOrderArrow}>{'\u2192'}</Text>
          </TouchableOpacity>

          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.getParent()?.navigate('OrdersTab')}>
              <View style={[styles.quickIcon, { backgroundColor: Colors.blueLight }]}>
                <Text style={{ fontSize: 18 }}>{'\u{1F4E6}'}</Text>
              </View>
              <Text style={styles.quickCardTitle}>My Orders</Text>
              <Text style={styles.quickCardSub}>Track & history</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.getParent()?.navigate('InvoicesTab')}>
              <View style={[styles.quickIcon, { backgroundColor: Colors.purpleLight }]}>
                <Text style={{ fontSize: 18 }}>{'\u{1F4C4}'}</Text>
              </View>
              <Text style={styles.quickCardTitle}>Invoices</Text>
              <Text style={styles.quickCardSub}>View & download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Schemes')}>
              <View style={[styles.quickIcon, { backgroundColor: Colors.amberLight }]}>
                <Text style={{ fontSize: 18 }}>{'\u{1F3F7}'}</Text>
              </View>
              <Text style={styles.quickCardTitle}>Schemes</Text>
              <Text style={styles.quickCardSub}>Active offers</Text>
              <View style={styles.newBadge}><Text style={styles.newBadgeText}>2 NEW</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Payments')}>
              <View style={[styles.quickIcon, { backgroundColor: Colors.greenLight }]}>
                <Text style={{ fontSize: 18 }}>{'\u{1F4B3}'}</Text>
              </View>
              <Text style={styles.quickCardTitle}>Payments</Text>
              <Text style={styles.quickCardSub}>Ledger & dues</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>RECENT ORDERS</Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('OrdersTab')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <Card>
            {recentOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No orders yet</Text>
              </View>
            ) : (
              recentOrders.map((order, index) => (
                <TouchableOpacity
                  key={order.id}
                  style={[styles.orderRow, index < recentOrders.length - 1 && styles.orderBorder]}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                >
                  <View style={styles.orderLeft}>
                    <Text style={styles.orderId}>#{order.id}</Text>
                    <Text style={styles.orderItems}>
                      {order.items.map(it => `${it.name.split(' ').slice(0, 2).join(' ')}\u00d7${it.qty}`).join(', ')}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderAmount}>{formatCurrency(order.grand)}</Text>
                    <StatusPill status={order.status} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </Card>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  welcomeText: { fontSize: 12, color: Colors.ink3, fontWeight: '500' },
  dealerName: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4 },
  headerActions: { flexDirection: 'row', gap: 7 },
  iconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 16 },
  pills: { flexDirection: 'row', gap: 7, marginTop: 9 },
  infoPill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20 },
  infoPillText: { fontSize: 10, fontWeight: '700' },
  scroll: { flex: 1 },
  section: { padding: 13, paddingHorizontal: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  viewAll: { fontSize: 11, fontWeight: '700', color: Colors.blue },
  placeOrderBtn: { backgroundColor: Colors.blue, borderRadius: 13, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  placeOrderIcon: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  placeOrderTitle: { fontSize: 14, fontWeight: '800', color: '#fff' },
  placeOrderSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  placeOrderArrow: { marginLeft: 'auto', fontSize: 22, color: 'rgba(255,255,255,0.6)' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: '48%', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 13, padding: 14, shadowColor: '#0D1117', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  quickIcon: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickCardTitle: { fontSize: 13, fontWeight: '700' },
  quickCardSub: { fontSize: 10, color: Colors.ink3, marginTop: 1 },
  newBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: Colors.amber, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 20 },
  newBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  orderRow: { flexDirection: 'row', alignItems: 'center', padding: 13, paddingHorizontal: 14 },
  orderBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  orderLeft: { flex: 1 },
  orderId: { fontSize: 13, fontWeight: '800', color: Colors.blue },
  orderItems: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  orderRight: { alignItems: 'flex-end' },
  orderAmount: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 12, color: Colors.ink3 },
});
