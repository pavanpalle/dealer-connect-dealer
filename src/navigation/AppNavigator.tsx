import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MoreScreen from '../screens/MoreScreen';
import PlaceOrderScreen from '../screens/PlaceOrderScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import InvoiceViewScreen from '../screens/InvoiceViewScreen';
import SchemesScreen from '../screens/SchemesScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import CatalogScreen from '../screens/CatalogScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '\u{1F3E0}',
    Orders: '\u{1F4E6}',
    Invoices: '\u{1F4C4}',
    Reports: '\u{1F4CA}',
    More: '\u2630',
  };
  return (
    <View style={styles.tabIconWrap}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
        {icons[label] || '\u25CF'}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={MyOrdersScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Orders" focused={focused} /> }}
      />
      <Tab.Screen
        name="InvoicesTab"
        component={InvoicesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Invoices" focused={focused} /> }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Reports" focused={focused} /> }}
      />
      <Tab.Screen
        name="MoreTab"
        component={MoreScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="More" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { dealer } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!dealer ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="InvoiceView" component={InvoiceViewScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Schemes" component={SchemesScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Payments" component={PaymentsScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Catalog" component={CatalogScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 70,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabIconWrap: { alignItems: 'center', gap: 2 },
  tabIcon: { fontSize: 20 },
  tabIconActive: { transform: [{ scale: 1.1 }] },
  tabLabel: { fontSize: 10, fontWeight: '600', color: Colors.ink3 },
  tabLabelActive: { color: Colors.blue, fontWeight: '700' },
});
