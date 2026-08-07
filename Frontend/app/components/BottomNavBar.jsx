import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

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
  { name: 'document-text', label: 'History', route: '/screens/TransactionHistory' },
  { name: 'settings', label: 'Settings', route: '/screens/Settings' },
];

const BottomNavBar = () => {
  const router = useRouter();
  const { colors, radius } = useTheme();

  return (
    <View style={[styles.fabBar, { backgroundColor: colors.surface, borderRadius: radius.pill, borderColor: colors.border }, shadow]}>
      {TABS.map(tab => {
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => {
              router.push(tab.route);
            }}
            activeOpacity={0.8}
          >
            <Animated.View>
              <Ionicons name={tab.name} size={22} color={colors.accent} />
            </Animated.View>
            <Text style={[styles.tabText, { color: colors.accent }]}>{tab.label}</Text>
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
    borderWidth: StyleSheet.hairlineWidth,
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
    marginTop: 2,
  },
});

export default BottomNavBar;
