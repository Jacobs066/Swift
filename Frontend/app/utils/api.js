import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set your backend API base URL here
export const API_URL = 'http://192.168.137.1:8082';

// AUTH
const login = async (emailOrPhone, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
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
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      emailOrPhone: email,
      username,
      password,
      confirmPassword: password,
      firstName: fullName
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Signup failed';
  }
};

// USER PROFILE
const getUserProfile = async () => {
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

// WALLETS
const getAccountBalance = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/wallets/balances?userId=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch account balance';
  }
};

const createWalletsForUser = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/wallets/wallets/ensure?userId=${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Failed to create wallets' };
  }
};

const getUserWallets = async (userId = 1) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/wallets/wallets?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch user wallets';
  }
};

// DEPOSIT
const getDepositMethods = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/deposit/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { methods: [] };
  }
};

const initiateDeposit = async (method, amount, depositData) => {
  try {
    const response = await axios.post(`${API_URL}/api/deposit/initiate`, {
      method,
      amount,
      email: depositData.email,
      reference: depositData.reference,
      userId: 1
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate deposit';
  }
};

// WITHDRAW
const getWithdrawMethods = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/withdraw/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { methods: [] };
  }
};

const initiateWithdraw = async (method, amount, recipientDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/withdraw/initiate`, {
      method,
      amount,
      recipientDetails,
      userId: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate withdrawal';
  }
};

// SEND
const getSendMethods = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/send/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return { methods: [] };
  }
};

const initiateSend = async (method, amount, recipientDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/send/initiate`, {
      method,
      amount,
      recipientDetails,
      userId: 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate send';
  }
};

// TRANSFER (INTERWALLET)
const getTransferRates = async () => {
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

const performInterwalletTransfer = async (fromCurrency, toCurrency, amount, description = 'Interwallet transfer') => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/wallets/interwallet`, {
      fromCurrency,
      toCurrency,
      amount,
      userId: 1,
      description,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to perform interwallet transfer';
  }
};

// TRANSACTIONS
const getRecentTransactions = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transactions/recent?userId=1&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

const getTransactionHistory = async (userId, filters = {}) => {
  try {
    const params = new URLSearchParams({
      userId: userId.toString(),
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
    const response = await axios.post(`${API_URL}/api/auth/send-otp`, {
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
    const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
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
    const response = await axios.post(`${API_URL}/api/auth/resend-otp`, {
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
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/user/activity-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.data && response.data.success && response.data.logs) {
      return response.data.logs;
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Export all functions
export {
  login,
  signup,
  getUserProfile,
  getAccountBalance,
  createWalletsForUser,
  getUserWallets,
  getDepositMethods,
  initiateDeposit,
  getWithdrawMethods,
  initiateWithdraw,
  getSendMethods,
  initiateSend,
  getTransferRates,
  performInterwalletTransfer,
  getRecentTransactions,
  getTransactionHistory,
  sendOTP,
  verifyOTP,
  resendOTP,
  getActivityLogs
  // ...add any other functions you need
};