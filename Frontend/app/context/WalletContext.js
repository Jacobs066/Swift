import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUserWallets,
  createWalletsForUser,
  initiateWithdraw,
  initiateSend,
  performInterwalletTransfer,
  getTransactionHistory,
} from '../utils/api';
import { useAuth } from './AuthContext';

const emptyBalances = { GHS: 0, USD: 0, EUR: 0, GBP: 0 };

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balances, setBalances] = useState(emptyBalances);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const walletsToBalances = (wallets) =>
    wallets.reduce((acc, wallet) => {
      acc[wallet.currency] = wallet.balance;
      return acc;
    }, { ...emptyBalances });

  // Fetch real balances from the backend. Ensures wallets exist for a
  // brand-new user before the first fetch.
  const refreshBalances = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      let wallets = await getUserWallets();
      if (!wallets || wallets.length === 0) {
        await createWalletsForUser();
        wallets = await getUserWallets();
      }
      setBalances(walletsToBalances(wallets || []));
    } catch (error) {
      console.log('Error refreshing balances:', error);
    }
  }, [isAuthenticated]);

  const refreshTransactionHistory = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const history = await getTransactionHistory(user.id);
      setTransactionHistory(history?.transactions || []);
    } catch (error) {
      console.log('Error refreshing transaction history:', error);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        await Promise.all([refreshBalances(), refreshTransactionHistory()]);
      } else {
        setBalances(emptyBalances);
        setTransactionHistory([]);
      }
      setIsLoading(false);
    };
    load();
  }, [isAuthenticated, refreshBalances, refreshTransactionHistory]);

  // Withdraw to the user's own bank/mobile money account.
  const withdraw = async (amount, method, recipientDetails) => {
    const response = await initiateWithdraw(method, amount, recipientDetails);
    await refreshBalances();
    await refreshTransactionHistory();
    return response;
  };

  // Send to a third party's bank/mobile money account.
  const send = async (amount, method, recipientDetails) => {
    const response = await initiateSend(method, amount, recipientDetails);
    await refreshBalances();
    await refreshTransactionHistory();
    return response;
  };

  // Interwallet transfer between the user's own currency wallets.
  const transfer = async (fromCurrency, toCurrency, amount, description) => {
    const response = await performInterwalletTransfer(fromCurrency, toCurrency, amount, description);
    await refreshBalances();
    await refreshTransactionHistory();
    return response;
  };

  return (
    <WalletContext.Provider
      value={{
        balances,
        transactionHistory,
        isLoading,
        withdraw,
        send,
        transfer,
        refreshBalances,
        refreshTransactionHistory,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
