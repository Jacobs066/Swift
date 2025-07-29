import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { markNotificationAsRead, getTransactionById } from '../utils/api';

const NotificationDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const { isDarkMode } = useTheme();

  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Extract notification details from params
  const {
    title,
    message,
    time,
    icon,
    color,
    notificationId,
    transactionId,
    type,
    read
  } = params;

  useEffect(() => {
    // Mark notification as read when opened
    if (notificationId && !read) {
      markAsRead();
    }

    // Load transaction details if it's a transaction notification
    if (transactionId && ['deposit', 'withdrawal', 'transfer'].includes(type)) {
      loadTransactionDetails();
    }
  }, []);

  const markAsRead = async () => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      // Silently handle error - notification is already displayed
    }
  };

  const loadTransactionDetails = async () => {
    try {
      setLoading(true);
      const details = await getTransactionById(transactionId);
      setTransactionDetails(details);
    } catch (error) {
      // Transaction details not available, continue with basic notification
    } finally {
      setLoading(false);
    }
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

  const formatTime = (timestamp) => {
    if (!timestamp) return time || 'Just now';
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  const handleViewTransaction = () => {
    if (transactionId) {
      router.push({
        pathname: '/screens/TransactionDetails',
        params: { id: transactionId }
      });
    }
  };

  const handleBackToNotifications = () => {
    router.back();
  };

  const iconData = getNotificationIcon(type);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' },
      ]}
    >
      <TouchableOpacity onPress={handleBackToNotifications} style={styles.backBtn}>
        <Ionicons name="arrow-back-circle" size={28} color="#800080" />
      </TouchableOpacity>

      <View style={[styles.iconBox, { backgroundColor: color || iconData.color }]}>
        <Ionicons name={icon || iconData.icon} size={36} color="#fff" />
      </View>

      <Text
        style={[
          styles.title,
          { color: isDarkMode ? '#f1f1f1' : '#800080' },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.message,
          { color: isDarkMode ? '#ccc' : '#444' },
        ]}
      >
        {message}
      </Text>

      <Text
        style={[
          styles.time,
          { color: isDarkMode ? '#999' : '#888' },
        ]}
      >
        {formatTime(time)}
      </Text>

      {/* Transaction Details Section */}
      {transactionDetails && (
        <View style={[styles.transactionSection, { backgroundColor: isDarkMode ? '#1c1c1e' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f1f1f1' : '#800080' }]}>
            {t('transactionDetails') || 'Transaction Details'}
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              {t('amount') || 'Amount'}:
            </Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              ₵{transactionDetails.amount?.toFixed(2) || '0.00'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              {t('status') || 'Status'}:
            </Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              {transactionDetails.status || 'Completed'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: isDarkMode ? '#ccc' : '#666' }]}>
              {t('reference') || 'Reference'}:
            </Text>
            <Text style={[styles.detailValue, { color: isDarkMode ? '#fff' : '#333' }]}>
              {transactionDetails.reference || 'N/A'}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.viewTransactionBtn, { backgroundColor: '#800080' }]}
            onPress={handleViewTransaction}
          >
            <Text style={styles.viewTransactionText}>
              {t('viewFullTransaction') || 'View Full Transaction'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading State for Transaction Details */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#800080" />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#ccc' : '#666' }]}>
            {t('loadingTransactionDetails') || 'Loading transaction details...'}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0' }]}
          onPress={handleBackToNotifications}
        >
          <Ionicons name="list-outline" size={20} color={isDarkMode ? '#fff' : '#800080'} />
          <Text style={[styles.actionBtnText, { color: isDarkMode ? '#fff' : '#800080' }]}>
            {t('backToNotifications') || 'Back to Notifications'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#800080' }]}
          onPress={() => router.push('/screens/HomeScreen')}
        >
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={[styles.actionBtnText, { color: '#fff' }]}>
            {t('backToHome') || 'Back to Home'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 20,
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  time: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 30,
  },
  transactionSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewTransactionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  viewTransactionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 'auto',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
