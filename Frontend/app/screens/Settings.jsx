
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { useWallet } from '../context/WalletContext';
import { getUserProfile } from '../utils/api';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { profileImage, setProfileImage } = useProfile();
  const { 
    balances, 
    transactionHistory, 
    getCurrentUser, 
    clearAllUserData, 
    resetBalances, 
    clearTransactionHistory 
  } = useWallet();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    subtext: isDarkMode ? '#ccc' : '#666',
    card: isDarkMode ? '#1f1f1f' : '#f2e6f7',
    accent: '#800080',
    border: isDarkMode ? '#333' : '#ddd',
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.log('Failed to load user profile:', error);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    return userProfile?.fullName || userProfile?.firstName + ' ' + userProfile?.lastName || 'User Name';
  };

  const getDisplayEmail = () => {
    return userProfile?.email || userProfile?.emailOrPhone || 'user@example.com';
  };

  const getDisplayPhone = () => {
    return userProfile?.phoneNumber || userProfile?.phone || '+233 20 123 4567';
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera.');
      return false;
    }
    return true;
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Remove Photo', onPress: removePhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removePhoto = () => {
    setProfileImage(null);
  };

  // Debug functions for testing wallet persistence
  const handleResetBalances = () => {
    Alert.alert(
      'Reset Balances',
      'This will reset your balances to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: resetBalances, style: 'destructive' },
      ]
    );
  };

  const handleClearTransactions = () => {
    Alert.alert(
      'Clear Transactions',
      'This will clear all transaction history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearTransactionHistory, style: 'destructive' },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all wallet data for the current user. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', onPress: clearAllUserData, style: 'destructive' },
      ]
    );
  };

  const themeStyles = getThemeStyles(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.accent }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: '#fff' }]}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={[styles.card, themeStyles.card]}>
          {/* Profile Info */}
          <View style={styles.profile}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: '#800080' }]}>
                <Text style={styles.avatarText}>
                  {getInitials(getDisplayName())}
                </Text>
              </View>
            )}
            <View>
              <Text style={[styles.name, themeStyles.name]}>
                {userProfile?.fullName || getDisplayName()}
              </Text>
              <Text style={themeStyles.email}>
                {userProfile?.email || getDisplayEmail()}
              </Text>
              <Text style={themeStyles.phone}>
                {userProfile?.phoneNumber || getDisplayPhone()}
              </Text>
            </View>
          </View>

          {/* Change Profile Photo */}
          <TouchableOpacity
            style={[styles.profileBtn, themeStyles.profileBtn]}
            onPress={showImagePickerOptions}
          >
            <Text style={[styles.profileBtnText, themeStyles.profileBtnText]}>Change profile photo</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Section - Wallet Testing */}
        <View style={[styles.card, themeStyles.card]}>
          <Text style={[styles.debugTitle, { color: colors.accent }]}>Debug - Wallet Testing</Text>
          <Text style={[styles.debugText, { color: colors.subtext }]}>
            Current User: {getCurrentUser()}
          </Text>
          <Text style={[styles.debugText, { color: colors.subtext }]}>
            Balances: GHS {balances.GHS.toFixed(2)}, USD {balances.USD.toFixed(2)}
          </Text>
          <Text style={[styles.debugText, { color: colors.subtext }]}>
            Transactions: {transactionHistory.length} items
          </Text>
          
          <TouchableOpacity style={styles.debugButton} onPress={handleResetBalances}>
            <Text style={styles.debugButtonText}>Reset Balances</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.debugButton} onPress={handleClearTransactions}>
            <Text style={styles.debugButtonText}>Clear Transactions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.debugButton, { backgroundColor: '#ff4444' }]} onPress={handleClearAllData}>
            <Text style={styles.debugButtonText}>Clear All User Data</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={[styles.card, themeStyles.card]}>
          <View style={styles.row}>
            <Ionicons name="moon-outline" size={18} color="#800080" />
            <Text style={[styles.label, themeStyles.label]}>Dark mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          </View>

          {settingsItem('lock-closed-outline', 'Change password', () => router.push('../../settings/Password'), isDarkMode)}
          {settingsItem('shield-checkmark-outline', 'Privacy & Data', () => router.push('../../settings/Privacy'), isDarkMode)}
          {settingsItem('language-outline', 'Language', () => router.push('/screens/LanguageSelectionScreen'), isDarkMode)}
          {settingsItem('help-circle-outline', 'Help', () => router.push('../../settings/Help'), isDarkMode)}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={() => router.push('/screens/LoginScreen')}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        {/* About Us */}
        <TouchableOpacity
          style={[styles.bottomLink, isDarkMode && styles.bottomLinkDark]}
          onPress={() => router.push('../../settings/About')}
        >
          <Text style={[styles.bottomLinkText, isDarkMode && styles.bottomLinkTextDark]}>About Us</Text>
        </TouchableOpacity>

        {/* Customer Service */}
        <TouchableOpacity
          style={[styles.bottomLink, isDarkMode && styles.bottomLinkDark]}
          onPress={() => router.push('../../settings/Help')}
        >
          <Text style={[styles.bottomLinkText, isDarkMode && styles.bottomLinkTextDark]}>Customer Service</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <BottomNavBar /> */}
    </View>
  );
};

const settingsItem = (icon, label, onPress, isDarkMode) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#800080" />
    <Text style={[styles.label, { color: isDarkMode ? '#eee' : '#333' }]}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={18} color="#ccc" />
  </TouchableOpacity>
);

const getThemeStyles = (isDarkMode) => ({
  container: {
    backgroundColor: isDarkMode ? '#121212' : '#fff',
  },
  header: {
    backgroundColor: isDarkMode ? '#1e1e1e' : '#800080',
  },
  headerText: {
    color: '#fff',
  },
  name: {
    color: '#fff',
  },
  email: {
    color: isDarkMode ? '#ccc' : '#f2f2f2',
    fontSize: 13,
  },
  phone: {
    color: isDarkMode ? '#999' : '#d1c7e0',
    fontSize: 12,
  },
  profileBtn: {
    backgroundColor: isDarkMode ? '#333' : '#fff',
  },
  profileBtnText: {
    color: isDarkMode ? '#fff' : '#800080',
  },
  card: {
    backgroundColor: isDarkMode ? '#222' : '#f6f6f6',
  },
  label: {
    color: isDarkMode ? '#eee' : '#333',
  },
});

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  android: {
    elevation: 3,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f2e6f7',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  profileBtn: {
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  logout: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomLink: {
    marginHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bottomLinkDark: {
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bottomLinkText: {
    color: '#666',
    fontSize: 14,
  },
  bottomLinkTextDark: {
    color: '#ccc',
  },
  // Debug section styles
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  debugText: {
    fontSize: 14,
    marginBottom: 8,
  },
  debugButton: {
    backgroundColor: '#800080',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
