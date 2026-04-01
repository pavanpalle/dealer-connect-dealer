import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: string;
  title: string;
  sub: string;
  bg: string;
  action: () => void;
}

export default function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { dealer, logout } = useAuth();

  if (!dealer) return null;

  const sections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'SHOPPING',
      items: [
        { icon: '\u{1F4E6}', title: 'Product Catalogue', sub: 'Browse all products & pricing', bg: Colors.blueLight, action: () => navigation.navigate('Catalog') },
        { icon: '\u{1F3F7}', title: 'Schemes & Offers', sub: 'Active & upcoming deals', bg: Colors.amberLight, action: () => navigation.navigate('Schemes') },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { icon: '\u{1F4B3}', title: 'Payments & Ledger', sub: 'Credit, payments & statements', bg: Colors.greenLight, action: () => navigation.navigate('Payments') },
        { icon: '\u{1F4CA}', title: 'My Reports', sub: 'Spend, orders & analytics', bg: Colors.purpleLight, action: () => navigation.getParent()?.navigate('ReportsTab') },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { icon: '\u{1F4AC}', title: 'Chat Support', sub: 'Get help from SSR team', bg: Colors.blueLight, action: () => Alert.alert('Chat', 'Opening chat support...') },
        { icon: '\u{1F4DE}', title: 'Call SSR', sub: '+91 93965 22666', bg: Colors.greenLight, action: () => Linking.openURL('tel:+919396522666').catch(() => {}) },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{dealer.ini}</Text>
          </View>
          <View>
            <Text style={styles.dealerName}>{dealer.name}</Text>
            <Text style={styles.dealerSub}>{dealer.lid} {'\u00b7'} {dealer.loc}</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <Card>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.title}
                  style={[styles.menuRow, i < section.items.length - 1 && styles.menuBorder]}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                  <Text style={styles.menuArrow}>{'\u203A'}</Text>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>{'\u{1F6AA}'} Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>DealerConnect v2.4 {'\u00b7'} Plumsoft</Text>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  dealerName: { fontSize: 16, fontWeight: '800' },
  dealerSub: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 14, paddingTop: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, marginBottom: 8 },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 14, gap: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { fontSize: 13, fontWeight: '700' },
  menuSub: { fontSize: 10, color: Colors.ink3, marginTop: 1 },
  menuArrow: { fontSize: 20, color: Colors.ink4 },
  logoutBtn: { backgroundColor: Colors.redLight, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F5A6A0' },
  logoutText: { color: Colors.red, fontSize: 14, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: 10, color: Colors.ink4, marginTop: 20 },
});
