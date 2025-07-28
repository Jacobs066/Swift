import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set your backend API base URL here
export const API_URL = 'http://192.168.137.1:8082'; // Updated to new backend IP for device testing

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export const signup = async (fullName, email, phoneNumber, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, {
      emailOrPhone: email, // Use email as emailOrPhone
      username: fullName, // Use fullName as username
      password: password,
      confirmPassword: password, // Use same password for confirmation
    });
    return response.data;
  } catch (error) {
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
    const response = await axios.get(`${API_URL}/api/wallets/balances`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch account balance';
  }
};

export const getRecentTransactions = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    // Use userId 1 for demo purposes
    const response = await axios.get(`${API_URL}/api/transactions/recent/1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch recent transactions';
  }
};

export const getActivityLogs = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/user/activity-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch activity logs';
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
    throw error.response?.data?.message || 'Failed to fetch notifications';
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
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/deposit/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch deposit methods';
  }
};

export const initiateDeposit = async (method, amount) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/deposit/initiate`, {
      method,
      amount,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate deposit';
  }
};

export const processDeposit = async (depositId, paymentDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/deposit/process`, {
      depositId,
      paymentDetails,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to process deposit';
  }
};

// Withdraw API functions
export const getWithdrawMethods = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/withdraw/methods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch withdraw methods';
  }
};

export const initiateWithdraw = async (method, amount, accountDetails) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/withdraw/initiate`, {
      method,
      amount,
      accountDetails,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate withdraw';
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
    const response = await axios.post(`${API_URL}/api/send/initiate`, {
      method,
      amount,
      recipientDetails,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to initiate send';
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
    const token = await AsyncStorage.getItem('token');
    const params = new URLSearchParams({
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
    });
    
    const response = await axios.get(`${API_URL}/api/transactions/history?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transaction history';
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
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/transactions/summary/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch transaction summary';
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
    const response = await axios.get(`${API_URL}/api/transactions/recent/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch recent transactions';
  }
};

// Biometric Authentication API functions
export const biometricLogin = async (emailOrPhone, biometricType, biometricData, deviceId) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/biometric/login`, {
      emailOrPhone,
      biometricType,
      biometricData,
      deviceId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Biometric login failed';
  }
};

export const setupBiometric = async (emailOrPhone, password, biometricType, biometricData, deviceId, deviceName) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/biometric/setup`, {
      emailOrPhone,
      password,
      biometricType,
      biometricData,
      deviceId,
      deviceName
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Biometric setup failed';
  }
};

export const checkBiometricStatus = async (emailOrPhone) => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/biometric/status?emailOrPhone=${emailOrPhone}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to check biometric status';
  }
};

export const getBiometricDevices = async (emailOrPhone) => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/biometric/devices?emailOrPhone=${emailOrPhone}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch biometric devices';
  }
};

export const removeBiometricDevice = async (biometricId, emailOrPhone) => {
  try {
    const response = await axios.delete(`${API_URL}/api/auth/biometric/devices/${biometricId}?emailOrPhone=${emailOrPhone}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to remove biometric device';
  }
}; 