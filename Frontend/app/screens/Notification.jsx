import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../utils/api';

const NotificationScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
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

      // Handle backend response format
      if (data && data.success && data.notifications) {
        setNotifications(data.notifications);
      } else if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        // If no notifications or invalid response, show empty state
        setNotifications([]);
      }
    } catch (error) {
      console.log('Failed to load notifications:', error);
      // Show empty state instead of fallback data
      setNotifications([]);
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
      case 'DEPOSIT':
        return { icon: 'add-circle-outline', color: colors.success };
      case 'WITHDRAWAL':
        return { icon: 'remove-circle-outline', color: colors.error };
      case 'SEND':
        return { icon: 'arrow-redo-outline', color: colors.error };
      case 'TRANSFER':
        return { icon: 'swap-horizontal-outline', color: '#33b5e5' };
      case 'CURRENCY_EXCHANGE':
        return { icon: 'sync-outline', color: '#33b5e5' };
      case 'SIGNUP':
        return { icon: 'person-add-outline', color: colors.success };
      case 'LOGIN':
        return { icon: 'log-in-outline', color: colors.accent };
      case 'PASSWORD_CHANGE':
        return { icon: 'key-outline', color: '#ff8800' };
      case 'SECURITY_ALERT':
        return { icon: 'shield-checkmark-outline', color: '#ff8800' };
      default:
        return { icon: 'notifications-outline', color: colors.accent };
    }
  };

  const TRANSACTIONAL_TYPES = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'SEND', 'CURRENCY_EXCHANGE'];

  const handleNotificationPress = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      }

      const iconData = getNotificationIcon(notification.type);
      router.push({
        pathname: '/screens/NotificationDetail',
        params: {
          title: notification.title,
          message: notification.message,
          time: notification.timestamp || notification.time,
          icon: iconData.icon,
          color: iconData.color,
          notificationId: notification.id,
          transactionId: notification.referenceId || '',
          type: notification.type,
          read: '1',
        }
      });
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
      style={[styles.deleteAction, { backgroundColor: colors.error }]}
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
      <Ionicons name="trash-outline" size={24} color={colors.accentText} />
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
            item.read
              ? styles.read
              : { borderLeftWidth: 4, borderLeftColor: colors.accent },
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconData.color }]}>
              <Ionicons name={iconData.icon} size={24} color={colors.accentText} />
          </View>
          <View style={styles.messageArea}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.message,
                { color: colors.textMuted },
              ]}
            >
              {item.message}
            </Text>
            <Text
              style={[
                styles.time,
                { color: colors.textMuted },
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
      <Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>
        No notifications yet
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
        We'll notify you when something important happens
      </Text>
    </View>
  );

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: colors.surface },
          filter === 'all' && { backgroundColor: colors.accent },
        ]}
        onPress={() => setFilter('all')}
      >
        <Text
          style={[
            styles.filterText,
            { color: colors.textMuted },
            filter === 'all' && { color: colors.accentText },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: colors.surface },
          filter === 'unread' && { backgroundColor: colors.accent },
        ]}
        onPress={() => setFilter('unread')}
      >
        <Text
          style={[
            styles.filterText,
            { color: colors.textMuted },
            filter === 'unread' && { color: colors.accentText },
          ]}
        >
          Unread
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: colors.surface },
          filter === 'transactions' && { backgroundColor: colors.accent },
        ]}
        onPress={() => setFilter('transactions')}
      >
        <Text
          style={[
            styles.filterText,
            { color: colors.textMuted },
            filter === 'transactions' && { color: colors.accentText },
          ]}
        >
          Transactions
        </Text>
      </TouchableOpacity>
    </View>
  );

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'transactions') {
      return TRANSACTIONAL_TYPES.includes(notification.type);
    }
    return true;
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: colors.textPrimary }]}>
            Notifications
          </Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
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
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text
          style={[
            styles.header,
            { color: colors.textPrimary },
          ]}
        >
          Notifications
        </Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text
            style={[
              styles.markAll,
              { color: colors.accent },
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
              colors={[colors.accent]}
              tintColor={colors.accent}
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
  },
  activeFilter: {},
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {},
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
  read: {
    opacity: 0.6,
  },
  deleteAction: {
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
