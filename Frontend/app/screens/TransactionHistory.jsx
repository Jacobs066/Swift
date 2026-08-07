import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useWallet } from '../context/WalletContext';

const TransactionHistoryScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { transactionHistory, refreshTransactionHistory } = useWallet();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactionHistory();
    setRefreshing(false);
  };

  // Control structure to get transaction icon based on the backend's transactionType enum
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'add-circle';
      case 'WITHDRAWAL':
        return 'remove-circle';
      case 'TRANSFER':
        return 'send';
      case 'CURRENCY_EXCHANGE':
        return 'swap-horizontal';
      default:
        return 'document-outline';
    }
  };

  // Control structure to get transaction color based on direction
  const getTransactionColor = (transaction) => {
    if (transaction.transactionType === 'CURRENCY_EXCHANGE') return '#FF9800';
    return transaction.isIncoming ? colors.success : colors.error;
  };

  // Control structure to filter transactions by the backend's transactionType enum
  const getFilteredTransactions = () => {
    if (selectedFilter === 'all') {
      return transactionHistory;
    }
    return transactionHistory.filter((transaction) => transaction.transactionType === selectedFilter);
  };

  // Control structure to format transaction amount
  const formatAmount = (transaction) => {
    const prefix = transaction.isIncoming ? '+' : '-';
    return `${prefix}${transaction.currencySymbol || ''}${parseFloat(transaction.amount).toFixed(2)}`;
  };

  const renderTransactionItem = ({ item }) => (
    <View style={[styles.transactionItem, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconWrapper, { backgroundColor: getTransactionColor(item) }]}>
        <Ionicons name={getTransactionIcon(item.transactionType)} size={24} color={colors.accentText} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {item.displayType}
        </Text>
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {item.formattedDate} {item.formattedTime}
        </Text>
        {item.description && (
          <Text style={[styles.detailsText, { color: colors.textMuted }]}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: colors.textPrimary }]}>
          {formatAmount(item)}
        </Text>
      </View>
    </View>
  );

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[
        styles.filterBtn,
        { backgroundColor: colors.surface },
        selectedFilter === filter && { backgroundColor: colors.accent },
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          { color: colors.textMuted },
          selectedFilter === filter && { color: colors.accentText },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredTransactions = getFilteredTransactions();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={[styles.header, { color: colors.textPrimary }]}>Transaction History</Text>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryLabel, { color: colors.textPrimary }]}>Total Transactions</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
            {transactionHistory.length}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryLabel, { color: colors.textPrimary }]}>This Session</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
            {filteredTransactions.length}
          </Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('DEPOSIT', 'Deposits')}
        {renderFilterButton('WITHDRAWAL', 'Withdrawals')}
        {renderFilterButton('TRANSFER', 'Transfers')}
        {renderFilterButton('CURRENCY_EXCHANGE', 'Exchanges')}
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.accent]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              No Transactions Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
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
  },
  filterBtnActive: {},
  filterText: {
    fontSize: 12,
  },
  filterTextActive: {},
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
