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

  // Load transaction history from AsyncStorage on app start
  useEffect(() => {
    loadTransactionHistory();
  }, []);

  // Save transaction history to AsyncStorage whenever it changes
  useEffect(() => {
    saveTransactionHistory();
  }, [transactionHistory]);

  const loadTransactionHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('transactionHistory');
      if (savedHistory) {
        setTransactionHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Error loading transaction history:', error);
    }
  };

  const saveTransactionHistory = async () => {
    try {
      await AsyncStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    } catch (error) {
      console.log('Error saving transaction history:', error);
    }
  };

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
  const addTransaction = (type, amount, details = null) => {
    const transaction = {
      id: Date.now() + Math.random(), // Unique ID
      type: type,
      amount: amount,
      timestamp: formatTimestamp(),
      details: details
    };

    setTransactionHistory(prev => [transaction, ...prev]); // Add to beginning
  };

  // Simulate deposit (GHS only)
  const deposit = (amount) => {
    setBalances(prev => ({
      ...prev,
      GHS: prev.GHS + Number(amount),
    }));

    // Add transaction to history using control structure
    if (amount && amount > 0) {
      addTransaction('Deposit', amount, `Deposited GHS ${amount}`);
    }
  };

  // Simulate send/withdraw (GHS only)
  const sendOrWithdraw = (amount, type = 'Send', recipient = null) => {
    setBalances(prev => ({
      ...prev,
      GHS: prev.GHS - Number(amount),
    }));

    // Add transaction to history using control structure
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
      
      addTransaction(type, amount, details);
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
    setBalances(prev => ({
      ...prev,
      [from]: prev[from] - Number(amount),
      [to]: prev[to] + Number(amount) * exchangeRate,
    }));

    // Add transaction to history using control structure
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
      
      addTransaction('Transfer', amount, details);
    }
  };

  // Clear transaction history (for testing)
  const clearTransactionHistory = () => {
    setTransactionHistory([]);
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
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);