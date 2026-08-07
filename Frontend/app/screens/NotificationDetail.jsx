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
import Button from '../components/Button';

const NotificationDetail = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const { colors } = useTheme();

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
    if (transactionId && ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'SEND', 'CURRENCY_EXCHANGE'].includes(type)) {
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
        { backgroundColor: colors.background },
      ]}
    >
      <TouchableOpacity onPress={handleBackToNotifications} style={styles.backBtn}>
        <Ionicons name="arrow-back-circle" size={28} color={colors.accent} />
      </TouchableOpacity>

      <View style={[styles.iconBox, { backgroundColor: color || iconData.color }]}>
        <Ionicons name={icon || iconData.icon} size={36} color={colors.accentText} />
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.textPrimary },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.message,
          { color: colors.textMuted },
        ]}
      >
        {message}
      </Text>

      <Text
        style={[
          styles.time,
          { color: colors.textMuted },
        ]}
      >
        {formatTime(time)}
      </Text>

      {/* Transaction Details Section */}
      {transactionDetails && (
        <View style={[styles.transactionSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('transactionDetails') || 'Transaction Details'}
          </Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
              {t('amount') || 'Amount'}:
            </Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              ₵{transactionDetails.amount?.toFixed(2) || '0.00'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
              {t('status') || 'Status'}:
            </Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {transactionDetails.status || 'Completed'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
              {t('reference') || 'Reference'}:
            </Text>
            <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
              {transactionDetails.reference || 'N/A'}
            </Text>
          </View>

          <Button
            title={t('viewFullTransaction') || 'View Full Transaction'}
            onPress={handleViewTransaction}
            style={{ marginTop: 16 }}
          />
        </View>
      )}

      {/* Loading State for Transaction Details */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            {t('loadingTransactionDetails') || 'Loading transaction details...'}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.surface }]}
          onPress={handleBackToNotifications}
        >
          <Ionicons name="list-outline" size={20} color={colors.textPrimary} />
          <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
            {t('backToNotifications') || 'Back to Notifications'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/screens/HomeScreen')}
        >
          <Ionicons name="home-outline" size={20} color={colors.accentText} />
          <Text style={[styles.actionBtnText, { color: colors.accentText }]}>
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
