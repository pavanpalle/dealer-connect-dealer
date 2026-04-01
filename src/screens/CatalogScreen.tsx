import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme';
import { PRODUCTS, BULK_TIERS, formatCurrency } from '../data/mockData';
import AppBar from '../components/AppBar';
import Card from '../components/Card';

const PRODUCT_EMOJI: Record<string, string> = {
  milk: '\u{1F95B}', ghee: '\u{1F9C8}', curd: '\u{1F95B}',
  butter: '\u{1F9C8}', drink: '\u{1F379}',
};

export default function CatalogScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppBar title="Product Catalogue" subtitle="All products & pricing" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {PRODUCTS.map(p => {
          const tiers = BULK_TIERS[p.id];
          const stockPct = Math.round((p.qty / (p.qty + p.min)) * 100);
          const lowStock = p.qty < p.min * 2;
          return (
            <Card key={p.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={[styles.productIcon, { backgroundColor: p.bg }]}>
                  <Text style={{ fontSize: 20 }}>{PRODUCT_EMOJI[p.icon] || '\u{1F4E6}'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{p.name}</Text>
                  <Text style={styles.productMeta}>{p.sku} {'\u00b7'} {p.type} {'\u00b7'} HSN {p.hsn}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{'\u20b9'}{p.price}</Text>
                    <Text style={styles.mrp}>MRP {'\u20b9'}{p.mrp}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.tierTitle}>PRICING TIERS</Text>
              <View style={styles.tierGrid}>
                {tiers.map(t => (
                  <View key={t.lbl} style={styles.tierCell}>
                    <Text style={styles.tierLabel}>{t.lbl}</Text>
                    <Text style={styles.tierMin}>{t.min}+ {p.unit}</Text>
                    <Text style={[styles.tierDisc, { color: t.disc > 0 ? Colors.green : Colors.ink3 }]}>
                      {t.disc > 0 ? `${t.disc}% off` : 'Base'}
                    </Text>
                    <Text style={styles.tierPrice}>{'\u20b9'}{(p.price * (100 - t.disc) / 100).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.stockRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.stockBarOuter}>
                    <View style={[styles.stockBarInner, { width: `${stockPct}%`, backgroundColor: lowStock ? Colors.amber : Colors.green }]} />
                  </View>
                  <Text style={[styles.stockText, { color: lowStock ? Colors.amber : Colors.green }]}>
                    {p.qty} {p.unit} in stock
                  </Text>
                </View>
                <TouchableOpacity style={styles.orderBtn} onPress={() => Alert.alert('Order', `Adding ${p.name} to cart`)}>
                  <Text style={styles.orderBtnText}>Order</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, gap: 12 },
  productCard: { padding: 14 },
  productHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  productIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '800' },
  productMeta: { fontSize: 10, color: Colors.ink3, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 },
  price: { fontSize: 17, fontWeight: '800', color: Colors.blue },
  mrp: { fontSize: 10, color: Colors.ink4, textDecorationLine: 'line-through' },
  tierTitle: { fontSize: 9, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, marginBottom: 6 },
  tierGrid: { flexDirection: 'row', backgroundColor: Colors.surface2, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 12 },
  tierCell: { flex: 1, padding: 8, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.border },
  tierLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink2 },
  tierMin: { fontSize: 8, color: Colors.ink4, marginTop: 1 },
  tierDisc: { fontSize: 9, fontWeight: '700', marginTop: 2 },
  tierPrice: { fontSize: 11, fontWeight: '800', marginTop: 2 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stockBarOuter: { height: 4, backgroundColor: Colors.surface2, borderRadius: 2, overflow: 'hidden' },
  stockBarInner: { height: '100%', borderRadius: 2 },
  stockText: { fontSize: 10, fontWeight: '600', marginTop: 3 },
  orderBtn: { backgroundColor: Colors.blue, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  orderBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
