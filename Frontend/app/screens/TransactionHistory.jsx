import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';

const TransactionHistoryScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { transactionHistory, clearTransactionHistory } = useWallet();
  
  const isDarkMode = theme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#333';
  const cardColor = isDarkMode ? '#1c1c1e' : '#f6f6f6';
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Control structure to get transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Deposit':
        return 'add-circle';
      case 'Send':
        return 'send';
      case 'Withdraw':
        return 'remove-circle';
      case 'Transfer':
        return 'swap-horizontal';
      default:
        return 'document-outline';
    }
  };

  // Control structure to get transaction color based on type
  const getTransactionColor = (type) => {
    switch (type) {
      case 'Deposit':
        return '#00E676';
      case 'Send':
      case 'Withdraw':
        return '#F44336';
      case 'Transfer':
        return '#FF9800';
      default:
        return '#800080';
    }
  };

  // Control structure to filter transactions
  const getFilteredTransactions = () => {
    if (selectedFilter === 'all') {
      return transactionHistory;
    }
    
    // Use forEach to filter transactions
    const filtered = [];
    transactionHistory.forEach(transaction => {
      if (transaction.type === selectedFilter) {
        filtered.push(transaction);
      }
    });
    
    return filtered;
  };

  // Control structure to format transaction amount
  const formatAmount = (amount, type) => {
    const prefix = type === 'Deposit' ? '+' : '-';
    return `${prefix}₵${parseFloat(amount).toFixed(2)}`;
  };

  // Control structure to get user-friendly transaction message
  const getTransactionMessage = (transaction) => {
    const { type, amount, details } = transaction;
    
    // Use if-else structure to determine message
    if (type === 'Deposit') {
      return `You deposited GHS ${amount}`;
    } else if (type === 'Send') {
      return `You sent GHS ${amount}`;
    } else if (type === 'Withdraw') {
      return `You withdrew GHS ${amount}`;
    } else if (type === 'Transfer') {
      return `You transferred ${amount}`;
    } else {
      return `Transaction: GHS ${amount}`;
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all transaction history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearTransactionHistory();
            Alert.alert('Success', 'Transaction history cleared');
          },
        },
      ]
    );
  };

  const renderTransactionItem = ({ item }) => (
    <View style={[styles.transactionItem, { backgroundColor: cardColor }]}>
      <View style={[styles.iconWrapper, { backgroundColor: getTransactionColor(item.type) }]}>
        <Ionicons name={getTransactionIcon(item.type)} size={24} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: textColor }]}>
          {getTransactionMessage(item)}
        </Text>
        <Text style={[styles.timestamp, { color: isDarkMode ? '#ccc' : '#666' }]}>
          {item.timestamp}
        </Text>
        {item.details && (
          <Text style={[styles.detailsText, { color: isDarkMode ? '#ccc' : '#666' }]}>
            {item.details}
          </Text>
        )}
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: textColor }]}>
          {formatAmount(item.amount, item.type)}
        </Text>
      </View>
    </View>
  );

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[styles.filterBtn, selectedFilter === filter && styles.filterBtnActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      <Text style={[styles.header, { color: '#800080' }]}>Transaction History</Text>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.summaryLabel, { color: textColor }]}>Total Transactions</Text>
          <Text style={[styles.summaryValue, { color: '#800080' }]}>
            {transactionHistory.length}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.summaryLabel, { color: textColor }]}>This Session</Text>
          <Text style={[styles.summaryValue, { color: '#800080' }]}>
            {filteredTransactions.length}
          </Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('Deposit', 'Deposits')}
        {renderFilterButton('Send', 'Sends')}
        {renderFilterButton('Withdraw', 'Withdrawals')}
        {renderFilterButton('Transfer', 'Transfers')}
      </View>

      {/* Clear History Button */}
      {transactionHistory.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearHistory}>
          <Ionicons name="trash-outline" size={16} color="#F44336" />
          <Text style={styles.clearBtnText}>Clear History</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#800080']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#999" />
            <Text style={[styles.emptyTitle, { color: textColor }]}>
              No Transactions Yet
            </Text>
            <Text style={[styles.emptyText, { color: isDarkMode ? '#ccc' : '#666' }]}>
              Your transaction history will appear here once you start making deposits, withdrawals, transfers, or other transactions.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  filterBtnActive: {
    backgroundColor: '#800080',
  },
  filterText: {
    color: '#666',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#fff',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  clearBtnText: {
    color: '#F44336',
    fontSize: 14,
    marginLeft: 5,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default TransactionHistoryScreen;