import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ Import theme hook

const initialTransactions = [
  {
    id: '1',
    title: 'Cash Back',
    category: '2 days ago',
    amount: 'GHS36.00',
    icon: 'card-outline',
    color: '#FF6F61',
  },
  {
    id: '2',
    title: 'Reward',
    category: 'Yesterday',
    amount: 'GHS3.00',
    icon: 'gift-outline',
    color: '#40C4FF',
  },
  {
    id: '3',
    title: 'Deposit',
    category: 'Today, 12:30 PM',
    amount: 'GHS2599.00',
    icon: 'cash-outline',
    color: '#00E676',
  },
  {
    id: '4',
    title: 'Withdrawal',
    category: 'Just now',
    amount: '-GHS3.00',
    icon: 'arrow-down-outline',
    color: '#E040FB',
  },
  {
    id: '5',
    title: 'Cash Back',
    category: 'Last week',
    amount: 'GHS100.00',
    icon: 'card-outline',
    color: '#536DFE',
  },
  {
    id: '6',
    title: 'Interwallet Transfer',
    category: '4 days ago',
    amount: '-GHS33.00',
    icon: 'swap-horizontal-outline',
    color: '#FF4081',
  },
];

const TransactionsScreen = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);
  const { isDarkMode } = useTheme(); // ✅ Get dark mode state

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setTransactions((prev) => prev.filter((item) => item.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: isDarkMode ? '#2b2b2b' : '#800080' }]}>
      <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#fff" />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: '#fff' }]}>{item.title}</Text>
        <Text style={[styles.sub, { color: isDarkMode ? '#ccc' : '#ddd' }]}>{item.category}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: '#fff' }]}>{item.amount}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color="#800080" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      <Text style={[styles.header, { color: '#800080' }]}>Transaction History</Text>
      <Text style={[styles.subHeader, { color: '#800080' }]}>July 2025</Text>
      <Text style={[styles.totalAmount, { color: '#800080' }]}>GHS3,901.00</Text>

      <View style={styles.summaryBoxes}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>{transactions.length}</Text>
          <Text style={styles.summaryLabel}>Transactions</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>06</Text>
          <Text style={styles.summaryLabel}>Categories</Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});
