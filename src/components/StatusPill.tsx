import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import { OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; label: string }> = {
  delivered: { color: Colors.green, bg: Colors.greenLight, label: 'Delivered' },
  pending: { color: Colors.amber, bg: Colors.amberLight, label: 'Pending' },
  processing: { color: Colors.blue, bg: Colors.blueLight, label: 'Processing' },
  cancelled: { color: Colors.red, bg: Colors.redLight, label: 'Cancelled' },
};

export default function StatusPill({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.pill, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 100 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  text: { fontSize: 11, fontWeight: '700' },
});
