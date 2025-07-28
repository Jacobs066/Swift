import React, { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider = ({ children }) => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = (transaction) => {
    setTransactionHistory(prev => [transaction, ...prev]);
  };

  const clearHistory = () => {
    setTransactionHistory([]);
  };

  const value = {
    transactionHistory,
    addTransaction,
    clearHistory,
    isLoading,
    setIsLoading,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
