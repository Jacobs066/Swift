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
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { 
  getTransactionHistory, 
  getTransactionSummary, 
  updateTransactionStatus,
  getTransactionsByStatus,
  getTransactionsByType 
} from '../api';

const TransactionsScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadTransactionData();
  }, []);

  const loadTransactionData = async (page = 0, refresh = false) => {
    try {
      setLoading(true);
      
      // Get user ID from storage or context (you might need to implement this)
      const userId = 1; // This should come from user context or storage
      
      // Load transaction history
      const historyData = await getTransactionHistory(userId, {
        page,
        size: 20,
        sortBy: 'createdAt',
        sortDir: 'desc',
        ...(selectedFilter !== 'all' && { status: selectedFilter })
      });
      
      if (refresh || page === 0) {
        setTransactions(historyData.transactions || []);
      } else {
        setTransactions(prev => [...prev, ...(historyData.transactions || [])]);
      }
      
      setCurrentPage(historyData.currentPage || 0);
      setHasMore(historyData.hasNext || false);
      
      // Load transaction summary
      const summaryData = await getTransactionSummary(userId);
      setSummary(summaryData);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to load transaction data: ' + error.toString());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactionData(0, true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadTransactionData(currentPage + 1);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await updateTransactionStatus(id, 'CANCELLED');
              setTransactions(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'Transaction cancelled successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel transaction: ' + error.toString());
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

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

  const getTransactionColor = (type, isIncoming, description) => {
    // Check for specific transaction types based on description first
    if (description) {
      const desc = description.toLowerCase();
      if (desc.includes('cash back') || desc.includes('cashback')) {
        return '#FF6F61';
      }
      if (desc.includes('reward') || desc.includes('bonus')) {
        return '#40C4FF';
      }
      if (desc.includes('interwallet') || desc.includes('currency exchange')) {
        return '#FF4081';
      }
    }

    // Then check by transaction type and direction
    if (isIncoming) {
      return '#00E676'; // Green for incoming
    }
    switch (type) {
      case 'DEPOSIT':
        return '#00E676';
      case 'WITHDRAWAL':
        return '#E040FB';
      case 'TRANSFER':
        return '#FF4081';
      case 'CURRENCY_EXCHANGE':
        return '#536DFE';
      case 'PAYMENT':
        return '#FF6F61';
      default:
        return '#800080';
    }
  };

  const getDisplayType = (type, description, isIncoming) => {
    // Check for specific transaction types based on description first
    if (description) {
      const desc = description.toLowerCase();
      if (desc.includes('cash back') || desc.includes('cashback')) {
        return 'Cash Back';
      }
      if (desc.includes('reward') || desc.includes('bonus')) {
        return 'Reward';
      }
      if (desc.includes('interwallet') || desc.includes('currency exchange')) {
        return 'Interwallet Transfer';
      }
    }

    // Then check by transaction type
    switch (type) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAWAL':
        return 'Withdrawal';
      case 'TRANSFER':
        return isIncoming ? 'Received' : 'Sent';
      case 'CURRENCY_EXCHANGE':
        return 'Currency Exchange';
      case 'PAYMENT':
        return 'Payment';
      default:
        return type || 'Transaction';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return '#00E676';
      case 'PENDING':
        return '#FF9800';
      case 'FAILED':
        return '#F44336';
      case 'CANCELLED':
        return '#9E9E9E';
      default:
        return '#800080';
    }
  };

  const formatAmount = (amount, currency, isIncoming) => {
    const symbol = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '';
    const prefix = isIncoming ? '' : '-';
    return `${prefix}${symbol}${amount}`;
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: isDarkMode ? '#2b2b2b' : '#800080' }]}>
      <View style={[styles.iconWrapper, { backgroundColor: getTransactionColor(item.transactionType, item.isIncoming, item.description) }]}>
        <Ionicons name={getTransactionIcon(item.transactionType, item.isIncoming, item.description)} size={24} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: '#fff' }]}>{getDisplayType(item.transactionType, item.description, item.isIncoming)}</Text>
        <Text style={[styles.sub, { color: isDarkMode ? '#ccc' : '#ddd' }]}>
          {item.formattedDate} • {item.formattedTime}
        </Text>
        {item.description && (
          <Text style={[styles.description, { color: isDarkMode ? '#ccc' : '#ddd' }]}>
            {item.description}
          </Text>
        )}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: '#fff' }]}>
          {formatAmount(item.amount, item.currency, item.isIncoming)}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="#800080" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[styles.filterBtn, selectedFilter === filter && styles.filterBtnActive]}
      onPress={() => {
        setSelectedFilter(filter);
        loadTransactionData(0, true);
      }}
    >
      <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && transactions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#800080" />
          <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
            Loading transactions...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      <Text style={[styles.header, { color: '#800080' }]}>Transaction History</Text>
      <Text style={[styles.subHeader, { color: '#800080' }]}>
        {summary.currentMonth || 'Current Month'}
      </Text>
      <Text style={[styles.totalAmount, { color: '#800080' }]}>
        {summary.totalAmount ? `${summary.currencySymbol || '₵'}${summary.totalAmount}` : '₵0.00'}
      </Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('COMPLETED', 'Completed')}
        {renderFilterButton('PENDING', 'Pending')}
        {renderFilterButton('FAILED', 'Failed')}
      </View>

      <View style={styles.summaryBoxes}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>{transactions.length}</Text>
          <Text style={styles.summaryLabel}>Transactions</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>{summary.totalCategories || 0}</Text>
          <Text style={styles.summaryLabel}>Categories</Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#999" />
            <Text style={[styles.emptyTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
              No Transactions Yet
            </Text>
            <Text style={[styles.emptyText, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Your transaction history will appear here once you start making deposits, withdrawals, transfers, or other transactions.
            </Text>
            <View style={styles.emptyActions}>
              <TouchableOpacity 
                style={[styles.emptyActionBtn, { backgroundColor: '#800080' }]}
                onPress={() => router.push('/screens/Deposit')}
              >
                <Ionicons name="cash-outline" size={20} color="#fff" />
                <Text style={styles.emptyActionText}>Make a Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.emptyActionBtn, { backgroundColor: '#f0f0f0' }]}
                onPress={() => router.push('/screens/Convert')}
              >
                <Ionicons name="swap-horizontal-outline" size={20} color="#666" />
                <Text style={[styles.emptyActionText, { color: '#666' }]}>Transfer Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  backBtn: {
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    marginTop: 6,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#800080',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  summaryBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#800080',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 6,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    fontSize: 13,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '600',
    fontSize: 16,
  },
  deleteBtn: {
    marginTop: 6,
    backgroundColor: '#e0c3f7',
    padding: 6,
    borderRadius: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  emptyActionText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});
