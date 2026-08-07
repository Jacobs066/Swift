import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend base URL - configurable per environment via app.json's `extra.apiUrl`,
// so switching machines/networks doesn't require a code change.
export const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8082';

const client = axios.create({ baseURL: API_URL });

// Attach the auth token to every request uniformly.
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, the stored token is no longer valid - clear it so the app treats
// the user as logged out rather than silently failing every subsequent call.
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['token', 'userData']);
    }
    return Promise.reject(error);
  }
);

// AUTH
const login = async (emailOrPhone, password) => {
  try {
    const response = await client.post('/api/auth/login', {
      emailOrPhone,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

const signup = async (username, fullName, email, phoneNumber, password) => {
  try {
    // Backend requires both first and last name; the UI only collects one field.
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];
    const response = await client.post('/api/auth/signup', {
      emailOrPhone: email,
      username,
      password,
      confirmPassword: password,
      firstName,
      lastName
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};

// USER PROFILE
const getUserProfile = async () => {
  try {
    const response = await client.get('/api/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user profile';
  }
};

const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
  try {
    const response = await client.put('/api/user/password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to change password';
  }
};

// WALLETS
const getAccountBalance = async () => {
  try {
    const response = await client.get('/api/wallets/balances');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch account balance';
  }
};

const createWalletsForUser = async () => {
  try {
    const response = await client.post('/api/wallets/wallets/ensure');
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create wallets' };
  }
};

const getUserWallets = async () => {
  try {
    const response = await client.get('/api/wallets/wallets');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user wallets';
  }
};

// DEPOSIT
// Static, client-side list - these are UI options, not backend data.
const getDepositMethods = async () => ({
  methods: [
    { id: 'mobile_money', name: 'Mobile Money', description: 'Deposit via Mobile Money', icon: 'phone-portrait-outline', enabled: true },
    { id: 'bank', name: 'Bank Transfer', description: 'Deposit via Bank Transfer', icon: 'business-outline', enabled: true },
    { id: 'card', name: 'Debit/Credit Card', description: 'Deposit via Card', icon: 'card-outline', enabled: true },
  ],
});

const initiateDeposit = async (method, amount, depositData) => {
  try {
    const response = await client.post('/api/wallets/deposit', {
      method,
      amount,
      email: depositData.email,
      reference: depositData.reference,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate deposit';
  }
};

const verifyDeposit = async (reference, amount) => {
  try {
    const response = await client.post('/api/wallets/deposit/verify', {
      reference,
      amount,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to verify deposit';
  }
};

// WITHDRAW
const getWithdrawMethods = async () => ({
  methods: [
    { id: 'mobile_money', name: 'Mobile Money', description: 'Withdraw to Mobile Money', icon: 'phone-portrait-outline', enabled: true },
    { id: 'bank', name: 'Bank Transfer', description: 'Withdraw to Bank Account', icon: 'business-outline', enabled: true },
  ],
});

const initiateWithdraw = async (method, amount, recipientDetails) => {
  try {
    const response = await client.post('/api/wallets/withdraw', {
      reason: `Withdrawal via ${method}`,
      amount,
      name: recipientDetails?.fullName,
      accountNumber: recipientDetails?.accountNumber || recipientDetails?.phoneNumber,
      bankCode: recipientDetails?.bankCode || (method === 'mobile_money' ? 'MPS' : undefined),
      recipientCode: recipientDetails?.recipientCode,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate withdrawal';
  }
};

// SEND
const getSendMethods = async () => ({
  methods: [
    { id: 'bank', name: 'Bank Transfer', description: 'Send to Bank Account', icon: 'bank', enabled: true },
    { id: 'mobile_money', name: 'Mobile Money', description: 'Send to Mobile Money', icon: 'mobile', enabled: true },
  ],
});

const initiateSend = async (method, amount, recipientDetails) => {
  try {
    const response = await client.post('/api/wallets/send', {
      reason: `Send via ${method}`,
      amount,
      name: recipientDetails?.fullName || recipientDetails?.accountName,
      accountNumber: recipientDetails?.accountNumber || recipientDetails?.phoneNumber,
      bankCode: recipientDetails?.bankCode || (method === 'mobile_money' ? 'MPS' : undefined),
      recipientCode: recipientDetails?.recipientCode,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate send';
  }
};

// BANKS / MOBILE MONEY PROVIDERS
const getBanks = async (type) => {
  try {
    const response = await client.get('/api/wallets/banks', { params: type ? { type } : {} });
    return response.data;
  } catch (error) {
    return { success: false, banks: [] };
  }
};

// TRANSFER (INTERWALLET) & RATES
const getTransferRates = async () => {
  try {
    const response = await client.get('/api/wallets/rates');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transfer rates';
  }
};

const performInterwalletTransfer = async (fromCurrency, toCurrency, amount, description = 'Interwallet transfer') => {
  try {
    const response = await client.post('/api/wallets/interwallet', {
      fromCurrency,
      toCurrency,
      amount,
      description,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to perform interwallet transfer';
  }
};

// TRANSACTIONS
const getRecentTransactions = async (userId, limit = 5) => {
  try {
    const response = await client.get(`/api/transactions/recent/${userId}`, { params: { limit } });
    return response.data;
  } catch (error) {
    return [];
  }
};

const getTransactionSummary = async (userId) => {
  try {
    const response = await client.get(`/api/transactions/summary/${userId}`);
    return response.data;
  } catch (error) {
    return { totalTransactions: 0, totalDeposits: 0, totalWithdrawals: 0 };
  }
};

const getTransactionById = async (transactionId) => {
  try {
    const response = await client.get(`/api/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

const getTransactionHistory = async (userId, filters = {}) => {
  try {
    const params = {
      userId,
      page: filters.page || 0,
      size: filters.size || 20,
      sortBy: filters.sortBy || 'createdAt',
      sortDir: filters.sortDir || 'desc',
      ...(filters.walletId && { walletId: filters.walletId }),
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    };
    const response = await client.get('/api/transactions/history', { params });
    return response.data;
  } catch (error) {
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

// OTP FUNCTIONS
const sendOTP = async (phoneNumber, purpose = 'verification') => {
  try {
    const response = await client.post('/api/auth/send-otp', {
      phoneNumber,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to send OTP';
  }
};

const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const response = await client.post('/api/auth/verify-otp', {
      email: phoneNumber, // Backend expects 'email' field
      otp: otpCode,       // Backend expects 'otp' field
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to verify OTP';
  }
};

const resendOTP = async (phoneNumber, purpose = 'verification') => {
  try {
    const response = await client.post('/api/auth/resend-otp', {
      phoneNumber,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to resend OTP';
  }
};

const getActivityLogs = async () => {
  try {
    const response = await client.get('/api/user/activity-logs');
    if (response.data && response.data.success && response.data.logs) {
      return response.data.logs;
    }
    return [];
  } catch (error) {
    return [];
  }
};

// NOTIFICATIONS
const getNotifications = async () => {
  try {
    const response = await client.get('/api/notifications');
    return response.data;
  } catch (error) {
    return { success: true, notifications: [] };
  }
};

const markNotificationAsRead = async (id) => {
  try {
    const response = await client.put(`/api/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

const markAllNotificationsAsRead = async () => {
  try {
    const response = await client.put('/api/notifications/read-all');
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

const deleteNotification = async (id) => {
  try {
    const response = await client.delete(`/api/notifications/${id}`);
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Export all functions
export {
  login,
  signup,
  getUserProfile,
  changePassword,
  getAccountBalance,
  createWalletsForUser,
  getUserWallets,
  getDepositMethods,
  initiateDeposit,
  verifyDeposit,
  getWithdrawMethods,
  initiateWithdraw,
  getSendMethods,
  initiateSend,
  getBanks,
  getTransferRates,
  performInterwalletTransfer,
  getRecentTransactions,
  getTransactionHistory,
  getTransactionSummary,
  getTransactionById,
  sendOTP,
  verifyOTP,
  resendOTP,
  getActivityLogs,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};
