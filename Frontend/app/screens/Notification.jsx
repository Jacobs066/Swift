import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const initialNotifications = [
  {
    id: '1',
    title: 'Deposit Successful',
    message: 'Your GHS50.00 deposit has been added to your wallet.',
    time: '2 mins ago',
    icon: 'checkmark-circle-outline',
    color: '#00C851',
    read: false,
  },
  {
    id: '2',
    title: 'Reward Unlocked',
    message: 'You’ve earned a reward for your recent activity!',
    time: '1 hour ago',
    icon: 'gift-outline',
    color: '#ffbb33',
    read: false,
  },
  {
    id: '3',
    title: 'Interwallet Transfer',
    message: 'You transferred GHS100.00 to Evans.',
    time: 'Yesterday',
    icon: 'swap-horizontal-outline',
    color: '#33b5e5',
    read: true,
  },
  {
    id: '4',
    title: 'Withdrawal Complete',
    message: 'Your withdrawal of GHS20.00 has been processed.',
    time: '2 days ago',
    icon: 'arrow-down-outline',
    color: '#ff4444',
    read: true,
  },
];

const NotificationScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() =>
        Alert.alert('Delete Notification', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => deleteNotification(id),
            style: 'destructive',
          },
        ])
      }
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity
        onPress={() => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
          );
          router.push({
            pathname: '/screens/NotificationDetail',
            params: {
              title: item.title,
              message: item.message,
              time: item.time,
              icon: item.icon,
              color: item.color,
            },
          });
        }}
      >
        <View
          style={[
            styles.card,
            item.read ? styles.read : styles.unread,
            {
              backgroundColor: isDarkMode ? '#1c1c1e' : '#fff',
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#fff" />
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
              {item.time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView
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
        <TouchableOpacity onPress={markAllAsRead}>
          <Text
            style={[
              styles.markAll,
              { color: isDarkMode ? '#a78bfa' : '#800080' },
            ]}
          >
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
});
