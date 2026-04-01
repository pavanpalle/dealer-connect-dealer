import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatCurrency } from '../data/mockData';
import StatusPill from '../components/StatusPill';
import Card from '../components/Card';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MyOrdersScreen() {
  const { dealer } = useAuth();
  const { orders } = useOrders();
  const navigation = useNavigation<Nav>();

  if (!dealer) return null;
  const myOrders = orders.filter(o => o.did === dealer.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{myOrders.length} orders</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {myOrders.map(order => (
          <TouchableOpacity
            key={order.id}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
          >
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date} {'\u00b7'} {order.time}</Text>
                </View>
                <StatusPill status={order.status} />
              </View>
              <View style={styles.orderBody}>
                <Text style={styles.orderItems}>
                  {order.items.map(it => `${it.name.split(' ').slice(0, 2).join(' ')} \u00d7${it.qty}`).join(', ')}
                </Text>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderInv}>{order.inv}</Text>
                <Text style={styles.orderAmount}>{formatCurrency(order.grand)}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        {myOrders.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 32 }}>{'\u{1F4E6}'}</Text>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySub}>Place your first order to get started</Text>
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
  orderCard: { padding: 14 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  orderId: { fontSize: 14, fontWeight: '800', color: Colors.blue },
  orderDate: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  orderBody: { marginBottom: 10 },
  orderItems: { fontSize: 12, color: Colors.ink2, lineHeight: 18 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  orderInv: { fontSize: 10, color: Colors.ink4, fontWeight: '600' },
  orderAmount: { fontSize: 16, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, fontWeight: '700', marginTop: 12 },
  emptySub: { fontSize: 12, color: Colors.ink3, marginTop: 4 },
});
