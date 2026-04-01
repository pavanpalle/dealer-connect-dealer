import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { DEALERS, DEALER_COLORS } from '../data/mockData';

export default function LoginScreen() {
  const { login } = useAuth();
  const [dealerId, setDealerId] = useState('RS-HYD-0001');
  const [password, setPassword] = useState('dealer123');

  const handleLogin = () => {
    const dealer = Object.values(DEALERS).find(d => d.lid === dealerId);
    if (dealer) login(dealer.id);
  };

  const quickLogins = [
    { id: 'd1', name: 'Ramesh Stores', lid: 'RS-HYD-0001', loc: 'Ameerpet', ini: 'RS', color: DEALER_COLORS.d1 },
    { id: 'd2', name: 'Lakshmi Kirana', lid: 'LK-HYD-0002', loc: 'Kukatpally', ini: 'LK', color: DEALER_COLORS.d2 },
    { id: 'd3', name: 'Sri Balaji Mart', lid: 'SB-HYD-0003', loc: 'Madhapur', ini: 'SB', color: DEALER_COLORS.d3 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.logo}>
        <Text style={styles.logoIcon}>{'\u{1F6D2}'}</Text>
      </View>
      <Text style={styles.appName}>DealerConnect</Text>
      <Text style={styles.appSub}>B2B Dealer Portal</Text>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DEALER ID</Text>
          <TextInput style={styles.input} value={dealerId} onChangeText={setDealerId} placeholder="e.g. RS-HYD-0001" placeholderTextColor={Colors.ink4} />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor={Colors.ink4} secureTextEntry />
        </View>
        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.loginBtnText}>Sign In to Portal</Text>
        </TouchableOpacity>
        <Text style={styles.supportText}>Support: <Text style={styles.supportNumber}>+91 93965 22666</Text></Text>
      </View>

      <View style={styles.quickSection}>
        <Text style={styles.quickLabel}>QUICK LOGIN</Text>
        {quickLogins.map(q => (
          <TouchableOpacity key={q.id} style={styles.quickCard} onPress={() => login(q.id)} activeOpacity={0.7}>
            <View style={[styles.quickAvatar, { backgroundColor: q.color }]}>
              <Text style={styles.quickAvatarText}>{q.ini}</Text>
            </View>
            <View style={styles.quickInfo}>
              <Text style={styles.quickName}>{q.name}</Text>
              <Text style={styles.quickSub}>{q.lid} {'\u00b7'} {q.loc}</Text>
            </View>
            <Text style={styles.quickAction}>Login {'\u2192'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>DealerConnect v2.4 {'\u00b7'} Plumsoft</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF0F7' },
  content: { alignItems: 'center', padding: 20, paddingTop: 40, paddingBottom: 30 },
  logo: { width: 60, height: 60, borderRadius: 18, backgroundColor: Colors.blue, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: Colors.blue, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 8 },
  logoIcon: { fontSize: 28 },
  appName: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, textAlign: 'center' },
  appSub: { fontSize: 12, color: Colors.ink3, marginTop: 4, marginBottom: 26, fontWeight: '500', textAlign: 'center' },
  form: { width: '100%' },
  fieldGroup: { marginBottom: 13 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, marginBottom: 5 },
  input: { width: '100%', backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, padding: 11, paddingHorizontal: 13, fontSize: 14, fontWeight: '500', color: Colors.ink },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 18 },
  forgotText: { fontSize: 12, fontWeight: '700', color: Colors.blue },
  loginBtn: { backgroundColor: Colors.blue, borderRadius: 12, padding: 13, alignItems: 'center', justifyContent: 'center', width: '100%' },
  loginBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  supportText: { textAlign: 'center', marginTop: 13, fontSize: 11, color: Colors.ink3 },
  supportNumber: { color: Colors.blue, fontWeight: '700' },
  quickSection: { marginTop: 22, width: '100%' },
  quickLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.7, textAlign: 'center', marginBottom: 10 },
  quickCard: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 11, padding: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 8 },
  quickAvatar: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  quickAvatarText: { fontWeight: '800', fontSize: 12, color: '#fff' },
  quickInfo: { flex: 1 },
  quickName: { fontSize: 13, fontWeight: '700' },
  quickSub: { fontSize: 11, color: Colors.ink3 },
  quickAction: { fontSize: 11, fontWeight: '700', color: Colors.blue },
  version: { marginTop: 24, fontSize: 10, color: Colors.ink4, textAlign: 'center' },
});
