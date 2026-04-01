import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme';
import { formatCurrency } from '../data/mockData';
import StatGrid from '../components/StatGrid';
import Card from '../components/Card';

const MONTHLY_DATA = [
  { month: 'Oct', amount: 62000 },
  { month: 'Nov', amount: 71000 },
  { month: 'Dec', amount: 58000 },
  { month: 'Jan', amount: 84000 },
  { month: 'Feb', amount: 76000 },
  { month: 'Mar', amount: 82400 },
];

const WEEKLY_ORDERS = [
  { week: 'W1', count: 14 },
  { week: 'W2', count: 18 },
  { week: 'W3', count: 12 },
  { week: 'W4', count: 20 },
];

const PRODUCT_MIX = [
  { name: 'Milk 500ml', pct: 35, color: Colors.blue },
  { name: 'Milk 1L', pct: 22, color: Colors.green },
  { name: 'Ghee', pct: 18, color: Colors.amber },
  { name: 'Curd', pct: 12, color: Colors.purple },
  { name: 'Others', pct: 13, color: Colors.ink3 },
];

export default function ReportsScreen() {
  const maxMonthly = Math.max(...MONTHLY_DATA.map(d => d.amount));
  const maxWeekly = Math.max(...WEEKLY_ORDERS.map(d => d.count));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <Text style={styles.subtitle}>March 2026</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          <StatGrid items={[
            { label: 'Total Spend', value: formatCurrency(82400), color: Colors.blue },
            { label: 'Orders', value: '64', color: Colors.green },
            { label: 'Avg Order', value: formatCurrency(1288), color: Colors.amber },
            { label: 'Bulk Savings', value: formatCurrency(4820), color: Colors.purple },
          ]} />
        </View>

        <View style={styles.section}>
          <Card style={{ padding: 14 }}>
            <Text style={styles.chartTitle}>Monthly Spend</Text>
            <Text style={styles.chartSub}>Last 6 months</Text>
            <View style={styles.barChart}>
              {MONTHLY_DATA.map(d => (
                <View key={d.month} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View style={[styles.bar, { height: `${(d.amount / maxMonthly) * 100}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>{d.month}</Text>
                  <Text style={styles.barValue}>{'\u20b9'}{Math.round(d.amount / 1000)}K</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card style={{ padding: 14 }}>
            <Text style={styles.chartTitle}>Order Frequency</Text>
            <Text style={styles.chartSub}>Weekly orders this month</Text>
            <View style={styles.lineChart}>
              {WEEKLY_ORDERS.map((d, i) => (
                <View key={d.week} style={styles.lineCol}>
                  <View style={[styles.lineDot, { bottom: `${(d.count / maxWeekly) * 80}%` }]}>
                    <View style={styles.dotInner} />
                    <Text style={styles.dotValue}>{d.count}</Text>
                  </View>
                  <Text style={styles.lineLabel}>{d.week}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card style={{ padding: 14 }}>
            <Text style={styles.chartTitle}>Product Mix</Text>
            <Text style={styles.chartSub}>Order distribution by product</Text>
            <View style={styles.donutRow}>
              <View style={styles.donutWrap}>
                <View style={styles.donut}>
                  {PRODUCT_MIX.map((p, i) => (
                    <View key={p.name} style={[styles.donutSeg, {
                      width: 20, height: 20, borderRadius: 10,
                      backgroundColor: p.color,
                      position: 'absolute',
                      top: 30 + Math.sin(i * 1.2) * 22,
                      left: 30 + Math.cos(i * 1.2) * 22,
                    }]} />
                  ))}
                  <Text style={styles.donutCenter}>100%</Text>
                </View>
              </View>
              <View style={styles.legend}>
                {PRODUCT_MIX.map(p => (
                  <View key={p.name} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                    <Text style={styles.legendName}>{p.name}</Text>
                    <Text style={styles.legendPct}>{p.pct}%</Text>
                  </View>
                ))}
              </View>
            </View>
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
  title: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 11, color: Colors.ink3, marginTop: 2, fontWeight: '500' },
  scroll: { flex: 1 },
  section: { padding: 13, paddingHorizontal: 14 },
  chartTitle: { fontSize: 13, fontWeight: '800' },
  chartSub: { fontSize: 11, color: Colors.ink3, marginTop: 1, marginBottom: 14 },
  barChart: { flexDirection: 'row', gap: 8, height: 130, alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: { width: '100%', height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '65%', backgroundColor: Colors.blue, borderRadius: 4 },
  barLabel: { fontSize: 9, fontWeight: '600', color: Colors.ink3, marginTop: 4 },
  barValue: { fontSize: 9, fontWeight: '700', color: Colors.ink2, marginTop: 1 },
  lineChart: { flexDirection: 'row', height: 110, gap: 8, paddingBottom: 20 },
  lineCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', position: 'relative' },
  lineDot: { position: 'absolute', alignItems: 'center' },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.blue, borderWidth: 2, borderColor: Colors.blueLight },
  dotValue: { fontSize: 10, fontWeight: '800', color: Colors.blue, marginTop: 2 },
  lineLabel: { fontSize: 9, fontWeight: '600', color: Colors.ink3 },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  donutWrap: { width: 90, height: 90 },
  donut: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.surface2, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  donutSeg: {},
  donutCenter: { fontSize: 14, fontWeight: '800', color: Colors.ink2 },
  legend: { flex: 1, gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendName: { flex: 1, fontSize: 11, fontWeight: '600', color: Colors.ink2 },
  legendPct: { fontSize: 11, fontWeight: '800' },
});
