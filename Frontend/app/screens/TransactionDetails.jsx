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
import { useTranslation } from 'react-i18next';
import { getTransactionHistory, getTransactionSummary } from '../utils/api';
import BottomNavBar from '../components/BottomNavBar';

const TransactionHistoryScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const cardColor = isDarkMode ? '#1c1c1e' : '#f6f6f6';
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalSent, setTotalSent] = useState(0);

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
      
      // Calculate totals from transactions
      const transactions = historyData.transactions || [];
      let received = 0;
      let sent = 0;
      
      transactions.forEach(transaction => {
        if (transaction.isIncoming) {
          received += parseFloat(transaction.amount) || 0;
        } else {
          sent += parseFloat(transaction.amount) || 0;
        }
      });
      
      setTotalReceived(received);
      setTotalSent(sent);
      
      // Load transaction summary
      const summaryData = await getTransactionSummary(userId);
      setSummary(summaryData);
      
    } catch (error) {
      // Only log once to avoid spam
      if (page === 0) {
        console.log('Transaction history error:', error);
      }
      // Set empty data on error
      setTransactions([]);
      setTotalReceived(0);
      setTotalSent(0);
      setSummary({
        totalTransactions: 0,
        totalAmount: 0,
        currentMonth: 'Current Month',
        currencySymbol: '₵'
      });
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
        <BottomNavBar />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={24} color="#800080" />
        </TouchableOpacity>

        <Text style={[styles.header, { color: '#800080' }]}>Transaction History</Text>
        <Text style={[styles.subHeader, { color: '#800080' }]}>
          {summary.currentMonth || 'Current Month'}
        </Text>

        {/* Total Amounts */}
        <View style={styles.totalAmountsContainer}>
          <View style={[styles.totalAmountCard, { backgroundColor: isDarkMode ? '#1c1c1e' : '#fff' }]}>
            <Text style={[styles.totalAmountLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Total Received</Text>
            <Text style={[styles.totalAmountValue, { color: '#00E676' }]}>
              {summary.currencySymbol || '₵'}{totalReceived.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.totalAmountCard, { backgroundColor: isDarkMode ? '#1c1c1e' : '#fff' }]}>
            <Text style={[styles.totalAmountLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Total Sent Out</Text>
            <Text style={[styles.totalAmountValue, { color: '#F44336' }]}>
              {summary.currencySymbol || '₵'}{totalSent.toFixed(2)}
            </Text>
          </View>
        </View>

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
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#800080',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  summaryBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sub: {
    fontSize: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  emptyActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
  },
  emptyActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  totalAmountCard: {
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  totalAmountValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TransactionHistoryScreen; 