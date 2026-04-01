import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme';
import { SCHEMES } from '../data/mockData';
import AppBar from '../components/AppBar';

export default function SchemesScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppBar title="Schemes & Offers" subtitle="Save more on bulk orders" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {SCHEMES.map((scheme, i) => {
          const isActive = scheme.tag.includes('Active');
          return (
            <View key={i} style={[styles.card, { backgroundColor: scheme.bg, borderColor: scheme.brd }]}>
              <View style={styles.cardHeader}>
                <View style={[styles.schemeIcon, { backgroundColor: scheme.bc }]}>
                  <Text style={{ fontSize: 18 }}>
                    {scheme.icon === 'milk' ? '\u{1F95B}' : scheme.icon === 'ghee' ? '\u{1F9C8}' : scheme.icon === 'combo' ? '\u{1F4E6}' : '\u{23F0}'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.schemeTitle, { color: scheme.bc }]}>{scheme.title}</Text>
                    <View style={[styles.badgePill, { backgroundColor: scheme.bc }]}>
                      <Text style={styles.badgeText}>{scheme.badge}</Text>
                    </View>
                  </View>
                  <Text style={[styles.schemeTag, { color: scheme.bc }]}>{scheme.tag}</Text>
                </View>
              </View>
              <Text style={[styles.schemeDesc, { color: scheme.bc + 'CC' }]}>{scheme.desc}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.savingText, { color: scheme.bc }]}>Save {scheme.saving}</Text>
                {isActive && (
                  <TouchableOpacity
                    style={[styles.orderBtn, { backgroundColor: scheme.bc }]}
                    onPress={() => Alert.alert('Navigate', 'Going to Place Order...')}
                  >
                    <Text style={styles.orderBtnText}>Order Now {'\u2192'}</Text>
                  </TouchableOpacity>
                )}
                {!isActive && (
                  <View style={[styles.upcomingBadge, { borderColor: scheme.bc }]}>
                    <Text style={[styles.upcomingText, { color: scheme.bc }]}>Coming Soon</Text>
                  </View>
                )}
              </View>
            </View>
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
  card: { borderRadius: 14, borderWidth: 1.5, padding: 14, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  schemeIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  schemeTitle: { fontSize: 14, fontWeight: '800' },
  badgePill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  schemeTag: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  schemeDesc: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  savingText: { fontSize: 12, fontWeight: '800' },
  orderBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  orderBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  upcomingBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1.5 },
  upcomingText: { fontSize: 11, fontWeight: '700' },
});
