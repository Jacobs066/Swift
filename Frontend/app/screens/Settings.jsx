
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProfileContext } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const router = useRouter();
  const { profileImage } = useContext(ProfileContext);
  const { isDarkMode, toggleTheme } = useTheme();

  const themeStyles = getThemeStyles(isDarkMode);

  return (
    <ScrollView style={[styles.container, themeStyles.container]} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      {/* Header */}
      <View style={[styles.header, themeStyles.header]}>
        <Text style={[styles.headerText, themeStyles.headerText]}>Settings</Text>

        {/* Profile Info */}
        <View style={styles.profile}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/swift-logo.png')
            }
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.name, themeStyles.name]}>Leslie Alexander</Text>
            <Text style={themeStyles.email}>abc@gmail.com</Text>
            <Text style={themeStyles.phone}>1234567890</Text>
          </View>
        </View>

        {/* Change Profile Photo */}
        <TouchableOpacity
          style={[styles.profileBtn, themeStyles.profileBtn]}
          onPress={() => router.push('../../settings/Profile')}
        >
          <Text style={[styles.profileBtnText, themeStyles.profileBtnText]}>Change profile photo</Text>
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
    padding: 20,
  },
  header: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  profileBtnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    ...shadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontWeight: '500',
    fontSize: 14,
  },
  logout: {
    backgroundColor: '#800080',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomLink: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#800080',
  },
  bottomLinkDark: {
    backgroundColor: '#333',
  },
  bottomLinkTextDark: {
    color: '#fff',
  },
});

export default SettingsScreen;
