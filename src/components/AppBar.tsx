import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme';

interface AppBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function AppBar({ title, subtitle, onBack, rightAction }: AppBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backText}>{'\u2039'}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 24, color: Colors.ink2, lineHeight: 28, marginTop: -2 },
  titleWrap: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { fontSize: 11, color: Colors.ink3, marginTop: 1, fontWeight: '500' },
});
