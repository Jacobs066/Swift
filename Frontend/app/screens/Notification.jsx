import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../api';

// Fallback notifications if API fails
const fallbackNotifications = [
  {
    id: '1',
    title: 'Deposit Successful',
    message: 'Your GHS50.00 deposit has been added to your wallet.',
    time: '2 mins ago',
    type: 'deposit',
    read: false,
  },
  {
    id: '2',
    title: 'Reward Unlocked',
    message: 'You\'ve earned a reward for your recent activity!',
    time: '1 hour ago',
    type: 'reward',
    read: false,
  },
  {
    id: '3',
    title: 'Interwallet Transfer',
    message: 'You transferred GHS100.00 to Evans.',
    time: 'Yesterday',
    type: 'transfer',
    read: true,
  },
  {
    id: '4',
    title: 'Withdrawal Complete',
    message: 'Your withdrawal of GHS20.00 has been processed.',
    time: '2 days ago',
    type: 'withdrawal',
    read: true,
  },
];

const NotificationScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, transactions, rewards

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      // Fallback to static data if API fails
      setNotifications(fallbackNotifications);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'deposit':
        return { icon: 'add-circle-outline', color: '#00C851' };
      case 'withdrawal':
        return { icon: 'remove-circle-outline', color: '#ff4444' };
      case 'transfer':
        return { icon: 'swap-horizontal-outline', color: '#33b5e5' };
      case 'reward':
        return { icon: 'gift-outline', color: '#ffbb33' };
      case 'security':
        return { icon: 'shield-checkmark-outline', color: '#ff8800' };
      default:
        return { icon: 'notifications-outline', color: '#800080' };
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      }

      // Navigate based on notification type
      switch (notification.type) {
        case 'transaction':
        case 'transfer':
        case 'deposit':
        case 'withdrawal':
          router.push({ 
            pathname: '/screens/TransactionDetails', 
            params: { id: notification.transactionId || notification.id } 
          });
          break;
        case 'reward':
          router.push('/screens/Rewards');
          break;
        default:
          router.push({ 
            pathname: '/screens/NotificationDetail', 
            params: {
              title: notification.title,
              message: notification.message,
              time: notification.time,
              icon: getNotificationIcon(notification.type).icon,
              color: getNotificationIcon(notification.type).color,
            }
          });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() =>
        Alert.alert('Delete Notification', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => handleDeleteNotification(id),
            style: 'destructive',
          },
        ])
      }
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const iconData = getNotificationIcon(item.type);
    
    return (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <TouchableOpacity onPress={() => handleNotificationPress(item)}>
        <View
          style={[
            styles.card,
            item.read ? styles.read : styles.unread,
            {
              backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
            },
          ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconData.color }]}>
              <Ionicons name={iconData.icon} size={24} color="#fff" />
          </View>
          <View style={styles.messageArea}>
            <Text
              style={[
                styles.title,
                { color: isDarkMode ? '#f1f1f1' : '#333' },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.message,
                { color: isDarkMode ? '#ccc' : '#666' },
              ]}
            >
              {item.message}
            </Text>
            <Text
              style={[
                styles.time,
                { color: isDarkMode ? '#999' : '#aaa' },
              ]}
            >
                {formatTime(item.timestamp || item.time)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={isDarkMode ? '#666' : '#ccc'} />
      <Text style={[styles.emptyText, { color: isDarkMode ? '#ccc' : '#666' }]}>
        {t('noNotifications') || 'No notifications yet'}
      </Text>
      <Text style={[styles.emptySubtext, { color: isDarkMode ? '#999' : '#aaa' }]}>
        {t('noNotificationsSubtext') || 'We\'ll notify you when something important happens'}
      </Text>
    </View>
  );

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
        onPress={() => setFilter('all')}
      >
        <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
        onPress={() => setFilter('unread')}
      >
        <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
          Unread
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'transactions' && styles.activeFilter]}
        onPress={() => setFilter('transactions')}
      >
        <Text style={[styles.filterText, filter === 'transactions' && styles.activeFilterText]}>
          Transactions
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'transactions') {
      return ['deposit', 'withdrawal', 'transfer'].includes(notification.type);
    }
    return true;
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle" size={24} color="#800080" />
          </TouchableOpacity>
          <Text style={[styles.header, { color: isDarkMode ? '#f1f1f1' : '#800080' }]}>
            Notifications
          </Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#800080" />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#ccc' : '#666' }]}>
            Loading notifications...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={24} color="#800080" />
        </TouchableOpacity>
        <Text
          style={[
            styles.header,
            { color: isDarkMode ? '#f1f1f1' : '#800080' },
          ]}
        >
          Notifications
        </Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text
            style={[
              styles.markAll,
              { color: isDarkMode ? '#a78bfa' : '#800080' },
            ]}
          >
            {t('markAllAsRead') || 'Mark all as read'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <FilterButtons />

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
      <FlatList
          data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#800080']}
              tintColor={isDarkMode ? '#fff' : '#800080'}
            />
          }
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#800080',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageArea: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    marginTop: 6,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: '#800080',
  },
  read: {
    opacity: 0.6,
  },
  deleteAction: {
    backgroundColor: '#cc0000',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: 12,
    marginVertical: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});
