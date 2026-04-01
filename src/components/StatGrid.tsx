import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface StatItem {
  label: string;
  value: string;
  color?: string;
}

export default function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              index % 2 === 0 && styles.borderRight,
              index < 2 && styles.borderBottom,
            ]}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={[styles.value, { color: item.color || Colors.ink }]}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', shadowColor: '#0D1117', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', padding: 13 },
  borderRight: { borderRightWidth: 1, borderRightColor: Colors.border },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { fontSize: 10, color: Colors.ink3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 5 },
  value: { fontSize: 19, fontWeight: '800', letterSpacing: -0.5 },
});
