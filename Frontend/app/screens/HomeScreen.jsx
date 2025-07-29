import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getUserProfile, getAccountBalance, getRecentTransactions, getActivityLogs, getNotifications, createWalletsForUser } from '../utils/api';
import { useWallet } from '../context/WalletContext';
import { useProfile } from '../context/ProfileContext';

const hardcodedRecentTx = [
  {
    id: 1,
    transactionType: 'DEPOSIT',
    amount: 500,
    currencySymbol: '₵',
    isIncoming: true,
    description: 'Initial deposit',
    formattedTime: 'Today, 10:00 AM',
  },
  {
    id: 2,
    transactionType: 'TRANSFER',
    amount: 200,
    currencySymbol: '₵',
    isIncoming: false,
    description: 'Transfer to USD wallet',
    formattedTime: 'Yesterday, 3:45 PM',
  },
  {
    id: 3,
    transactionType: 'WITHDRAWAL',
    amount: 100,
    currencySymbol: '₵',
    isIncoming: false,
    description: 'Bank withdrawal',
    formattedTime: '2 days ago, 1:20 PM',
  },
];

const hardcodedRecentLogs = [
  { id: 1, icon: 'cash-outline', label: 'Wallet created', time: 'Today, 9:00 AM' },
  { id: 2, icon: 'card-outline', label: 'Card linked', time: 'Today, 9:10 AM' },
  { id: 3, icon: 'swap-horizontal-outline', label: 'Interwallet transfer', time: 'Yesterday, 4:00 PM' },
  { id: 4, icon: 'gift-outline', label: 'Reward received', time: 'Yesterday, 5:00 PM' },
  { id: 5, icon: 'arrow-down-outline', label: 'Withdrawal processed', time: '2 days ago, 2:00 PM' },
];

const hardcodedNotifications = [
  {
    id: 1,
    title: 'Welcome to Swift!',
    message: 'Your account has been successfully created. Start exploring our features!',
    type: 'welcome',
    read: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Security Alert',
    message: 'New login detected from your device. If this wasn\'t you, please contact support.',
    type: 'security',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    title: 'Transaction Successful',
    message: 'Your deposit of ₵500 has been processed successfully.',
    type: 'transaction',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 4,
    title: 'Reward Available',
    message: 'You\'ve earned ₵50 in rewards! Check your wallet to claim.',
    type: 'reward',
    read: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 5,
    title: 'App Update',
    message: 'New features available! Update to the latest version for better experience.',
    type: 'update',
    read: true,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { balances } = useWallet();
  const { isNewUser } = useProfile();

  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const cardColor = isDarkMode ? '#1c1c1e' : '#f6f6f6';
  const secondaryCard = isDarkMode ? '#2c2c2e' : '#e0c3f7';
  const balanceTextColor = '#fff';
  const fabColor = isDarkMode ? '#2e2e2e' : '#d6bde1ff';

  const [hasUnread, setHasUnread] = useState(false);
  const [badge, setBadge] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const pulse = useRef(new Animated.Value(1)).current;
  const [showGhsBalance, setShowGhsBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  // Refresh data when screen comes into focus (e.g., after deposit)
  useFocusEffect(
    React.useCallback(() => {
      loadHomeData();
    }, [])
  );

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

  useEffect(() => {
    if (isNewUser) {
      setRecentTx([]);
      setRecentLogs([]);
    } else {
      setRecentTx(hardcodedRecentTx);
      setRecentLogs(hardcodedRecentLogs);
    }
  }, [isNewUser]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      console.log('=== LOADING HOME DATA ===');
      
      // Ensure demo user has wallets - this is critical
      console.log('Creating wallets for user 1...');
      const walletResult = await createWalletsForUser(1);
      console.log('Wallet creation result:', walletResult);
      
      if (!walletResult.success) {
        console.log('Failed to create wallets, but continuing...');
      }
      
      const [profile, transactions, logs] = await Promise.all([
        getUserProfile().catch(() => ({ firstName: 'User' })),
        getRecentTransactions(),
        getActivityLogs(),
      ]);
      setUserProfile(profile);
      
      console.log('Recent transactions loaded:', transactions);
      console.log('Activity logs loaded:', logs);
      setRecentTx(transactions);
      setRecentLogs(logs);
      
      // Set notifications based on user type
      if (isNewUser) {
        setNotifications([]); // Empty for signup users
      } else {
        setNotifications(hardcodedNotifications); // Hardcoded for login users
      }
      
      const unreadCount = notifications?.filter(n => !n.read)?.length || 0;
      setHasUnread(unreadCount > 0);
      setBadge(unreadCount);
      
      console.log('=== HOME DATA LOADED ===');
    } catch (error) {
      console.log('Error loading home data:', error);
      // Only alert for critical errors, not profile fetch
      // Alert.alert('Error', 'Failed to load home data: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await loadHomeData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const openDetails = (item) => router.push({ pathname: '/screens/TransactionDetails', params: item });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: textColor }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor, flex: 1 }]}> {/* Ensure full height */}
      {console.log('recentLogs:', recentLogs)}
      {console.log('recentTx:', recentTx)}
      <ScrollView
        contentContainerStyle={{
          ...styles.scrollContent,
          flexGrow: 1,
          minHeight: '100%',
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#800080']}
            tintColor="#800080"
          />
        }
      >
        <View style={styles.greetingRow}>
          <View style={styles.greetingLeft}>
            <View style={[styles.avatar, { backgroundColor: '#800080' }]}>
              <Text style={styles.avatarText}>
                {userProfile?.firstName?.split(' ')[0]?.charAt(0) || userProfile?.fullName?.split(' ')[0]?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text style={[styles.welcomeText, { color: textColor }]}> 
              {t('welcomeBack')} to Swift! 👋
            </Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.balanceAmount, { color: balanceTextColor }]}> 
              {showGhsBalance ? `₵${balances.GHS.toFixed(2)}` : '****'}
            </Text>
            <TouchableOpacity onPress={() => setShowGhsBalance(v => !v)} style={{ marginLeft: 10 }}>
              <Ionicons
                name={showGhsBalance ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <ActionBtn icon="download-outline" label={t('deposit')} onPress={() => router.push('/screens/Deposit')} />
            <ActionBtn icon="cash-outline" label={t('withdraw')} onPress={() => router.push('/screens/Withdraw')} />
            <ActionBtn icon="send-outline" label={t('send')} onPress={() => router.push('/screens/SendOptions')} />
            <ActionBtn icon="swap-horizontal-outline" label={t('transfer')} onPress={() => router.push('/screens/Convert')} />
          </View>
        </View>

        <ActivityBlock title={t('recentActivity')} data={recentLogs} cardColor={cardColor} />
        <ActivityBlock title={t('recentTransactions')} data={recentTx} cardColor={cardColor} withAmounts onItemPress={openDetails} />
      </ScrollView>

      <View style={[styles.fabBar, { backgroundColor: fabColor }]}>
        <Tab name="home" label="Home" active onPress={() => {}} />
        <Tab name="wallet" label="Wallet" onPress={() => router.push('/screens/WalletScreen')} />
        <Tab name="document-text" label="History" onPress={() => router.push('/screens/TransactionHistory')} />
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

const ActivityBlock = ({ title, data, cardColor, withAmounts = false, onItemPress = () => {} }) => {
  const { t } = useTranslation();
  
  if (!Array.isArray(data)) {
    return (
      <View style={[styles.activityCard, { backgroundColor: cardColor }]}> 
        <Text style={{ color: 'red' }}>Error: Activity data is not an array.</Text>
      </View>
    );
  }

  const getTransactionIcon = (type, isIncoming, description) => {
    // Check for specific transaction types based on description first
    if (description) {
      const desc = description.toLowerCase();
      if (desc.includes('cash back') || desc.includes('cashback')) {
        return 'card-outline';
      }
      if (desc.includes('reward') || desc.includes('bonus')) {
        return 'gift-outline';
      }
      if (desc.includes('interwallet') || desc.includes('currency exchange')) {
        return 'swap-horizontal-outline';
      }
    }

    // Then check by transaction type
    switch (type) {
      case 'DEPOSIT':
        return 'cash-outline';
      case 'WITHDRAWAL':
        return 'arrow-down-outline';
      case 'TRANSFER':
        return 'swap-horizontal-outline';
      case 'CURRENCY_EXCHANGE':
        return 'swap-horizontal-outline';
      case 'PAYMENT':
        return 'card-outline';
      default:
        return isIncoming ? 'arrow-up-outline' : 'arrow-down-outline';
    }
  };

  const formatAmount = (amount, currencySymbol, isIncoming) => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    const sign = isIncoming ? '+' : '-';
    return `${sign}${currencySymbol}${formattedAmount}`;
  };

  const getDisplayLabel = (transaction) => {
    if (transaction.displayType) {
      return transaction.displayType;
    }
    
    // Fallback to description or type
    if (transaction.description) {
      return transaction.description.length > 30 
        ? transaction.description.substring(0, 30) + '...' 
        : transaction.description;
    }
    
    return transaction.transactionType || 'Transaction';
  };

  const getTimeDisplay = (transaction) => {
    if (transaction.formattedTime) {
      return transaction.formattedTime;
    }
    
    // Fallback for old data format
    if (transaction.time) {
      return transaction.time;
    }
    
    return 'Now';
  };
  
  return (
  <View style={[styles.activityCard, { backgroundColor: cardColor }]}>
    <Text style={styles.activityTitle}>{title}</Text>
      {data && data.length > 0 ? (
        data.map((it) => {
          // Handle both transaction data and old activity data format
          const isTransaction = it.transactionType || it.displayType;
          
          if (isTransaction) {
            // Handle transaction data from backend
            const icon = getTransactionIcon(it.transactionType, it.isIncoming, it.description);
            const label = getDisplayLabel(it);
            const time = getTimeDisplay(it);
            const amount = it.amount;
            const currencySymbol = it.currencySymbol || '₵';
            const isIncoming = it.isIncoming;
            
            return (
              <TouchableOpacity key={it.id} style={styles.activityRow} onPress={() => onItemPress(it)} activeOpacity={0.65}>
                <View style={styles.activityIcon}>
                  <Ionicons name={icon} size={20} color="#800080" />
                </View>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={styles.activityLabel}>{label}</Text>
                  <Text style={styles.activityTime}>{time}</Text>
                </View>
                {withAmounts && (
                  <Text style={[styles.amount, { color: isIncoming ? '#009900' : '#cc0000' }]}>
                    {formatAmount(amount, currencySymbol, isIncoming)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          } else {
            // Handle old activity data format
            return (
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
            );
          }
        })
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={24} color="#999" />
          <Text style={styles.emptyText}>
            {title === t('recentActivity') ? t('noRecentActivity') : t('noRecentTransactions')}
          </Text>
        </View>
      )}
  </View>
);
};

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
  container: { flex: 1, minHeight: '100%' },
  scrollContent: { flexGrow: 1, minHeight: '100%', padding: 20, paddingBottom: 140 },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 20, // Add padding to move top content down
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
