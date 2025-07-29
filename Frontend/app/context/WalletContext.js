import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default initial balances (customize as needed)
const initialBalances = {
  GHS: 1000,
  USD: 50,
  EUR: 100,
  GBP: 30,
};

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balances, setBalances] = useState(initialBalances);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user identifier (email or user ID)
  const getCurrentUserKey = async () => {
    try {
      // Try to get user email first
      const userEmail = await AsyncStorage.getItem('lastLoginEmail');
      if (userEmail) {
        return userEmail;
      }
      
      // Fallback to user data
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.email || user.emailOrPhone || user.id || 'default';
      }
      
      // If no user data, use default
      return 'default';
    } catch (error) {
      console.log('Error getting current user key:', error);
      return 'default';
    }
  };

  // Generate storage keys for current user
  const getStorageKeys = async () => {
    const userKey = await getCurrentUserKey();
    return {
      balances: `balances_${userKey}`,
      transactions: `transactions_${userKey}`,
    };
  };

  // Load user-specific data from AsyncStorage
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userKey = await getCurrentUserKey();
      setCurrentUserId(userKey);
      
      const { balances: balancesKey, transactions: transactionsKey } = await getStorageKeys();
      
      // Load balances
      const savedBalances = await AsyncStorage.getItem(balancesKey);
      if (savedBalances) {
        setBalances(JSON.parse(savedBalances));
      } else {
        // Initialize with default balances for new user
        setBalances(initialBalances);
        await AsyncStorage.setItem(balancesKey, JSON.stringify(initialBalances));
      }
      
      // Load transaction history
      const savedTransactions = await AsyncStorage.getItem(transactionsKey);
      if (savedTransactions) {
        setTransactionHistory(JSON.parse(savedTransactions));
      } else {
        setTransactionHistory([]);
      }
      
    } catch (error) {
      console.log('Error loading user data:', error);
      // Fallback to default values
      setBalances(initialBalances);
      setTransactionHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save balances to AsyncStorage
  const saveBalances = async (newBalances) => {
    try {
      const { balances: balancesKey } = await getStorageKeys();
      await AsyncStorage.setItem(balancesKey, JSON.stringify(newBalances));
    } catch (error) {
      console.log('Error saving balances:', error);
    }
  };

  // Save transaction history to AsyncStorage
  const saveTransactionHistory = async (newHistory) => {
    try {
      const { transactions: transactionsKey } = await getStorageKeys();
      await AsyncStorage.setItem(transactionsKey, JSON.stringify(newHistory));
    } catch (error) {
      console.log('Error saving transaction history:', error);
    }
  };

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  // Save balances whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveBalances(balances);
    }
  }, [balances, isLoading]);

  // Save transaction history whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveTransactionHistory(transactionHistory);
    }
  }, [transactionHistory, isLoading]);

  // Helper function to format timestamp
  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to add transaction to history
  const addTransaction = (type, amount, details = null, currency = 'GHS') => {
    const transaction = {
      id: Date.now() + Math.random(), // Unique ID
      type: type,
      amount: amount,
      currency: currency,
      timestamp: formatTimestamp(),
      details: details,
      date: new Date().toISOString()
    };

    setTransactionHistory(prev => [transaction, ...prev]); // Add to beginning
  };

  // Simulate deposit (GHS only)
  const deposit = (amount) => {
    const newBalances = {
      ...balances,
      GHS: balances.GHS + Number(amount),
    };
    setBalances(newBalances);

    // Add transaction to history
    if (amount && amount > 0) {
      addTransaction('Deposit', amount, `Deposited GHS ${amount}`, 'GHS');
    }
  };

  // Simulate send/withdraw (GHS only)
  const sendOrWithdraw = (amount, type = 'Send', recipient = null) => {
    const newBalances = {
      ...balances,
      GHS: balances.GHS - Number(amount),
    };
    setBalances(newBalances);

    // Add transaction to history
    if (amount && amount > 0) {
      let details = '';
      
      // Use switch statement to determine transaction details
      switch (type) {
        case 'Send':
          details = recipient ? `Sent GHS ${amount} to ${recipient}` : `Sent GHS ${amount}`;
          break;
        case 'Withdraw':
          details = `Withdrew GHS ${amount}`;
          break;
        default:
          details = `Transaction: GHS ${amount}`;
      }
      
      addTransaction(type, amount, details, 'GHS');
    }
  };

  // Exchange rates: always use these for GHS pairs
  const customRates = {
    GBP: { GHS: 13.98 },
    EUR: { GHS: 12.13 },
    USD: { GHS: 10.43 },
    GHS: {
      GBP: 1 / 13.98,
      EUR: 1 / 12.13,
      USD: 1 / 10.43,
    },
  };

  // Simulate transfer (any wallet to any wallet)
  const transfer = (from, to, amount, exchangeRate = 1) => {
    const newBalances = {
      ...balances,
      [from]: balances[from] - Number(amount),
      [to]: balances[to] + Number(amount) * exchangeRate,
    };
    setBalances(newBalances);

    // Add transaction to history
    if (amount && amount > 0) {
      let details = '';
      
      // Use if-else structure to determine transfer details
      if (from === to) {
        details = `Transferred ${amount} ${from} within same wallet`;
      } else if (exchangeRate === 1) {
        details = `Transferred ${amount} ${from} to ${to}`;
      } else {
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        details = `Transferred ${amount} ${from} to ${to} (Rate: ${exchangeRate}, Received: ${convertedAmount})`;
      }
      
      addTransaction('Transfer', amount, details, from);
    }
  };

  // Clear transaction history (for testing)
  const clearTransactionHistory = () => {
    setTransactionHistory([]);
  };

  // Reset balances to default (for testing)
  const resetBalances = () => {
    setBalances(initialBalances);
  };

  // Clear all user data (for testing)
  const clearAllUserData = async () => {
    try {
      const { balances: balancesKey, transactions: transactionsKey } = await getStorageKeys();
      await AsyncStorage.removeItem(balancesKey);
      await AsyncStorage.removeItem(transactionsKey);
      setBalances(initialBalances);
      setTransactionHistory([]);
      console.log('All user data cleared');
    } catch (error) {
      console.log('Error clearing user data:', error);
    }
  };

  // Get current user info
  const getCurrentUser = () => {
    return currentUserId;
  };

  return (
    <WalletContext.Provider value={{
      balances,
      deposit,
      sendOrWithdraw,
      transfer,
      setBalances, // for manual resets/testing
      transactionHistory,
      clearTransactionHistory,
      resetBalances,
      clearAllUserData,
      getCurrentUser,
      isLoading,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);