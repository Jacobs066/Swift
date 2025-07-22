import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const cardColor = isDarkMode ? '#1c1c1e' : '#f6f6f6';
  const secondaryCard = isDarkMode ? '#2c2c2e' : '#e0c3f7';
  const balanceTextColor = '#fff';
  const fabColor = isDarkMode ? '#2e2e2e' : '#d6bde1ff';

  const [hasUnread, setHasUnread] = useState(true);
  const [badge, setBadge] = useState(3);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasUnread) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [hasUnread]);

  const recentTx = [
    { id: 1, label: 'Reward', time: 'Just now', amount: 0.1, icon: 'gift-outline' },
    { id: 2, label: 'Deposit', time: 'Today, 12:30 PM', amount: 5.0, icon: 'cash-outline' },
    { id: 3, label: 'Withdrawal', time: 'Yesterday', amount: -2.5, icon: 'arrow-down-outline' },
    { id: 4, label: 'Interwallet', time: '2 days ago', amount: -1.75, icon: 'swap-horizontal-outline' },
    { id: 5, label: 'Cashback', time: 'Last week', amount: 0.25, icon: 'card-outline' },
  ];

  const recentLogs = [
    { id: 'l1', label: 'Logged in', time: '5 min ago', icon: 'log-in-outline' },
    { id: 'l2', label: 'PIN changed', time: 'Today, 10:12 AM', icon: 'key-outline' },
    { id: 'l3', label: 'Biometric enabled', time: 'Yesterday', icon: 'finger-print-outline' },
    { id: 'l4', label: 'Updated profile', time: '2 days ago', icon: 'person-outline' },
    { id: 'l5', label: 'Logged out', time: '3 days ago', icon: 'log-out-outline' },
  ];

  const openDetails = (item) => router.push({ pathname: '/screens/TransactionDetails', params: item });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <View style={[styles.avatar, { backgroundColor: '#800080' }]}>
              <Text style={styles.avatarText}>I</Text>
            </View>
            <Text style={[styles.welcomeText, { color: textColor }]}>Welcome to Swift! 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationWrapper}
            onPress={() => {
              setHasUnread(false);
              setBadge(0);
              router.push('/screens/Notification');
            }}
          >
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <Ionicons name="notifications-outline" size={24} color={hasUnread ? '#800080' : '#999'} />
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={[styles.balanceCard, { backgroundColor: '#800080' }]}>
          <Text style={[styles.balanceAmount, { color: balanceTextColor }]}>GHS</Text>
          <Text style={[styles.balanceAmount, { color: balanceTextColor }]}>₵100.00</Text>

          <View style={styles.actionRow}>
            <ActionBtn icon="download-outline" label="Deposit" onPress={() => router.push('/screens/Deposit')} />
            <ActionBtn icon="cash-outline" label="Withdraw" onPress={() => router.push('/screens/Withdraw')} />
            <ActionBtn icon="send-outline" label="Send" onPress={() => router.push('/screens/SendOptions')} />
          </View>
        </View>

        <ActivityBlock title="Recent Logs" data={recentLogs} cardColor={cardColor} />
        <ActivityBlock title="Recent Activity" data={recentTx} cardColor={cardColor} withAmounts onItemPress={openDetails} />
      </ScrollView>

      <View style={[styles.fabBar, { backgroundColor: fabColor }]}>
        <Tab name="home" label="Home" active onPress={() => {}} />
        <Tab name="wallet" label="Wallet" onPress={() => router.push('/screens/WalletScreen')} />
        <Tab name="document-text" label="History" onPress={() => router.push('/screens/TransactionDetails')} />
        <Tab name="settings" label="Settings" onPress={() => router.push('/screens/Settings')} />
      </View>
    </View>
  );
};

const ActionBtn = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#800080" style={{ marginRight: 6 }} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const ActivityBlock = ({ title, data, cardColor, withAmounts = false, onItemPress = () => {} }) => (
  <View style={[styles.activityCard, { backgroundColor: cardColor }]}>
    <Text style={styles.activityTitle}>{title}</Text>
    {data.map((it) => (
      <TouchableOpacity key={it.id} style={styles.activityRow} onPress={() => onItemPress(it)} activeOpacity={0.65}>
        <View style={styles.activityIcon}>
          <Ionicons name={it.icon} size={20} color="#800080" />
        </View>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.activityLabel}>{it.label}</Text>
          <Text style={styles.activityTime}>{it.time}</Text>
        </View>
        {withAmounts && (
          <Text style={[styles.amount, { color: it.amount >= 0 ? '#009900' : '#cc0000' }]}>
            {it.amount >= 0 ? `+${it.amount.toFixed(2)}` : `-${Math.abs(it.amount).toFixed(2)}`}
          </Text>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

const Tab = ({ name, label, onPress, active }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [active]);

  return (
    <TouchableOpacity style={[styles.tab, active && styles.activeTab]} onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name={name} size={22} color="#800080" />
      </Animated.View>
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );
};

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

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 140 },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  welcomeText: { fontSize: 16, fontWeight: '600' },
  notificationWrapper: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  balanceAmount: { fontSize: 28, fontWeight: 'bold' },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
  actionText: { color: '#800080', fontWeight: '600' },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  activityTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityIcon: {
    backgroundColor: '#e0c3f7',
    borderRadius: 20,
    padding: 10,
  },
  activityLabel: { fontWeight: '600' },
  activityTime: { fontSize: 12, color: '#888' },
  amount: { fontWeight: 'bold' },
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

export default HomeScreen;
