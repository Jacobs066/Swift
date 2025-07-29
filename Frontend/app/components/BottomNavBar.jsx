import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { height: 4, width: 0 },
  },
  android: {
    elevation: 8,
  },
});

const TABS = [
  { name: 'home', label: 'Home', route: '/screens/HomeScreen' },
  { name: 'wallet', label: 'Wallet', route: '/screens/WalletScreen' },
  { name: 'document-text', label: 'History', route: '/screens/TransactionDetails' },
  { name: 'settings', label: 'Settings', route: '/screens/Settings' },
];

const BottomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[styles.fabBar, { backgroundColor: '#d6bde1ff' }]}> 
      {TABS.map(tab => {
        const active = pathname.startsWith(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => {
              if (!active) {
                router.replace(tab.route);
              }
            }}
            activeOpacity={0.8}
          >
            <Animated.View>
              <Ionicons name={tab.name} size={22} color="#800080" />
            </Animated.View>
            <Text style={[styles.tabText, active && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  fabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 28,
    ...shadow,
    zIndex: 100,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
  },
  tabText: {
    fontSize: 11,
    color: '#800080',
    marginTop: 2,
  },
  activeTab: {
    backgroundColor: '#d2aae3ff',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#800080',
  },
});

export default BottomNavBar; 