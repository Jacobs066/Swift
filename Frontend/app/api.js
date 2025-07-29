import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set your backend API base URL here
export const API_URL = 'http://192.168.137.1:8082'; // Updated to new backend IP for device testing

export const login = async (emailOrPhone, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      emailOrPhone,
      password,
    });
    console.log('Login response:', response);
    return response.data;
  } catch (error) {
    console.log('Login error:', error);
    throw error.response?.data?.message || 'Login failed';
  }
};

export const signup = async (username, fullName, email, phoneNumber, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      emailOrPhone: email, // Use email as emailOrPhone
      username: username, // Use first word of full name as username
      password: password,
      confirmPassword: password, // Use same password for confirmation
      firstName: fullName // Store full name in firstName for now
    });
    console.log('Signup response:', response);
    return response.data;
  } catch (error) {
    console.log('Signup error:', error);
    throw error.response?.data?.message || 'Signup failed';
  }
};

// HomeScreen API functions
export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user profile';
  }
};

export const getAccountBalance = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Fetching account balance for user 1...');
    const response = await axios.get(`${API_URL}/api/wallets/balances?userId=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Balance response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Balance fetch error:', error);
    console.log('Error response:', error.response?.data);
    throw error.response?.data?.message || 'Failed to fetch account balance';
  }
};

export const getUserWallets = async (userId = 1) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/wallets/wallets?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.log('Failed to fetch user wallets:', error);
    throw error.response?.data?.message || 'Failed to fetch user wallets';
  }
};

export const ensureUserWallets = async (userId = 1) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Ensuring wallets for user:', userId);
    const response = await axios.post(`${API_URL}/api/wallets/wallets/ensure?userId=${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Wallets ensured successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log('Failed to ensure user wallets:', error);
    // Try alternative endpoint path
    try {
      console.log('Trying alternative endpoint...');
      const response = await axios.post(`${API_URL}/api/wallets/ensure?userId=${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Wallets ensured successfully with alternative endpoint:', response.data);
      return response.data;
    } catch (altError) {
      console.log('Alternative endpoint also failed:', altError);
      // Don't throw error, just log it and continue
      return { success: false, message: 'Failed to ensure user wallets' };
    }
  }
};

export const createWalletsForUser = async (userId = 1) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Creating wallets for user:', userId);
    const response = await axios.post(`${API_URL}/api/user/create-wallets?userId=${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Wallets created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log('Failed to create wallets for user:', error);
    return { success: false, message: 'Failed to create wallets' };
  }
};

export const allocateFundsToWallets = async (userId = 1) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Allocating funds to wallets for user:', userId);
    const response = await axios.post(`${API_URL}/api/user/allocate-funds?userId=${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Funds allocated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log('Failed to allocate funds:', error);
    return { success: false, message: 'Failed to allocate funds' };
  }
};

export const getRecentTransactions = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    // Use userId 1 for demo purposes
    const response = await axios.get(`${API_URL}/api/transactions/recent/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Recent transactions response:', response.data);
    return response.data || [];
  } catch (error) {
    console.log('Recent transactions API error:', error);
    // Return empty array instead of throwing error for better UX
    return [];
  }
};

export const getActivityLogs = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/user/activity-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Activity logs response:', response.data);
    // Extract logs array from response
    return response.data?.logs || [];
  } catch (error) {
    console.log('Activity logs API error:', error);
    // Return empty array instead of throwing error for better UX
    return [];
  }
};

export const getNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.log('Notifications API error:', error);
    // Return empty array instead of throwing error
    return { success: false, notifications: [] };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/api/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to mark notification as read';
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/api/notifications/mark-all-read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to mark all notifications as read';
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete notification';
  }
};

// Deposit API functions
export const getDepositMethods = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/deposit/methods`);
    return response.data.methods || [];
  } catch (error) {
    console.log('Deposit methods API error:', error);
    // Return default methods if API fails
    return [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Deposit via Mobile Money',
        icon: 'phone-portrait-outline',
        enabled: true
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Deposit via Bank Transfer',
        icon: 'business-outline',
        enabled: true
      },
      {
        id: 'card',
        name: 'Debit/Credit Card',
        description: 'Deposit via Card',
        icon: 'card-outline',
        enabled: true
      }
    ];
  }
};

export const initiateDeposit = async (method, amount, depositData) => {
  try {
    console.log('Initiating deposit with:', { method, amount, depositData });
    
    const response = await axios.post(`${API_URL}/api/deposit/initiate`, {
      method,
      amount,
      email: depositData.email,
      reference: depositData.reference,
      userId: 1 // For demo purposes, using userId 1
    });
    
    console.log('Deposit initiated:', response.data);
    return response.data;
  } catch (error) {
    console.log('Initiate deposit API error:', error);
    throw error.response?.data?.message || 'Failed to initiate deposit';
  }
};

export const processDeposit = async (depositId, paymentDetails) => {
  try {
    const response = await axios.post(`${API_URL}/api/deposit/process`, {
      depositId,
      paymentDetails
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to process deposit';
  }
};

export const verifyDeposit = async (email, reference, amount) => {
  try {
    const response = await axios.post(`${API_URL}/api/wallets/deposit/verify`, {
      email,
      reference,
      amount
    });
    
    console.log('Deposit verification response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Verify deposit API error:', error);
    throw error.response?.data?.message || 'Failed to verify deposit';
  }
};

// Withdraw API functions
export const getWithdrawMethods = async () => {
  try {
    console.log('Calling withdraw methods API:', `${API_URL}/api/withdraw/methods`);
    const response = await axios.get(`${API_URL}/api/withdraw/methods`);
    console.log('Withdraw methods response:', response.data);
    return response.data.methods || [];
  } catch (error) {
    console.log('Withdraw methods API error:', error);
    console.log('Error details:', error.response?.data);
    // Return default methods if API fails
    return [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Withdraw to Mobile Money',
        icon: 'phone-portrait-outline',
        enabled: true
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Withdraw to Bank Account',
        icon: 'business-outline',
        enabled: true
      }
    ];
  }
};

export const initiateWithdraw = async (method, amount, recipientDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Initiating withdrawal with:', { method, amount, recipientDetails });
    
    const response = await axios.post(`${API_URL}/api/withdraw/initiate`, {
      method,
      amount,
      recipientDetails,
      userId: 1 // For demo purposes, using userId 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Withdrawal initiated:', response.data);
    return response.data;
  } catch (error) {
    console.log('Initiate withdrawal API error:', error);
    console.log('Error response:', error.response?.data);
    throw error.response?.data?.message || error.response?.data?.error || 'Failed to initiate withdrawal';
  }
};

// Send API functions
export const getSendMethods = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/send/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch send methods';
  }
};

export const initiateSend = async (method, amount, recipientDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Initiating send with:', { method, amount, recipientDetails });

    const response = await axios.post(`${API_URL}/api/send/initiate`, {
      method,
      amount,
      recipientDetails,
      userId: 1 // For demo purposes, using userId 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Send initiated:', response.data);
    return response.data;
  } catch (error) {
    console.log('Initiate send API error:', error);
    console.log('Error response:', error.response?.data);
    throw error.response?.data?.message || error.response?.data?.error || 'Failed to initiate send';
  }
};

export const processSend = async (sendId, paymentDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/send/process`, {
      sendId,
      paymentDetails,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to process send';
  }
};

// Transfer API functions
export const getTransferRates = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transfer/rates`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transfer rates';
  }
};

export const initiateTransfer = async (fromCurrency, toCurrency, amount) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/transfer/initiate`, {
      fromCurrency,
      toCurrency,
      amount,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate transfer';
  }
};

export const performInterwalletTransfer = async (fromCurrency, toCurrency, amount, description = 'Interwallet transfer') => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Performing interwallet transfer:', { fromCurrency, toCurrency, amount, description });
    
    const response = await axios.post(`${API_URL}/api/wallets/interwallet`, {
      fromCurrency,
      toCurrency,
      amount,
      userId: 1, // For demo purposes, using userId 1
      description,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Interwallet transfer response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Interwallet transfer error:', error);
    throw error.response?.data?.message || 'Failed to perform interwallet transfer';
  }
};

export const processTransfer = async (transferId, confirmationDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/transfer/process`, {
      transferId,
      confirmationDetails,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to process transfer';
  }
};

// Transaction API functions
export const getTransactionHistory = async (userId, filters = {}) => {
  try {
    const params = new URLSearchParams({
      userId: userId.toString(), // Ensure userId is a string
      page: filters.page || 0,
      size: filters.size || 20,
      sortBy: filters.sortBy || 'createdAt',
      sortDir: filters.sortDir || 'desc',
      ...(filters.walletId && { walletId: filters.walletId }),
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    });
    
    const response = await axios.get(`${API_URL}/api/transactions/history?${params}`);
    return response.data;
  } catch (error) {
    console.log('Transaction history API error:', error);
    // Return empty data instead of throwing error
    return {
      transactions: [],
      currentPage: 0,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false
    };
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transaction details';
  }
};

export const getTransactionSummary = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/transactions/summary/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Transaction summary API error:', error);
    // Return empty summary instead of throwing error
    return {
      totalTransactions: 0,
      totalAmount: 0,
      currentMonth: 'Current Month',
      currencySymbol: '₵'
    };
  }
};

export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${API_URL}/api/transactions/${transactionId}/status?status=${status}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update transaction status';
  }
};

export const getTransactionsByStatus = async (status) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transactions/status/${status}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transactions by status';
  }
};

export const getTransactionsByType = async (type) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transactions/type/${type}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transactions by type';
  }
};

// OTP API functions
export const sendOTP = async (phoneNumber, purpose = 'verification') => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
      phoneNumber,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send OTP';
  }
};

export const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
      email: phoneNumber, // Backend expects 'email' field
      otp: otpCode, // Backend expects 'otp' field
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to verify OTP';
  }
};

export const resendOTP = async (phoneNumber, purpose = 'verification') => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/resend-otp`, {
      phoneNumber,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to resend OTP';
  }
};

export const getUserRecentTransactions = async (userId, limit = 10) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transactions/recent?userId=${userId}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.log('Failed to fetch recent transactions:', error);
    throw error.response?.data?.message || 'Failed to fetch recent transactions';
  }
};

// Export all functions
export {
  login,
  signup,
  getUserProfile,
  getAccountBalance,
  getUserWallets,
  ensureUserWallets,
  createWalletsForUser,
  allocateFundsToWallets,
  getRecentTransactions,
  getActivityLogs,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getDepositMethods,
  initiateDeposit,
  processDeposit,
  verifyDeposit,
  getWithdrawMethods,
  initiateWithdraw,
  getSendMethods,
  initiateSend,
  processSend,
  getTransferRates,
  initiateTransfer,
  performInterwalletTransfer,
  processTransfer,
  getTransactionHistory,
  getTransactionById,
  getTransactionSummary,
  updateTransactionStatus,
  getTransactionsByStatus,
  getTransactionsByType,
  sendOTP,
  verifyOTP,
  resendOTP,
  getUserRecentTransactions
}; 