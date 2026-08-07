
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../utils/api';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors, spacing, radius, typography } = useTheme();
  const { profileImage, setProfileImage } = useProfile();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUserProfile(response?.user || response);
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
    if (userProfile?.fullName) return userProfile.fullName;
    if (userProfile?.firstName || userProfile?.lastName) {
      return `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim();
    }
    return 'User Name';
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

  const handleLogout = async () => {
    await logout();
    router.push('/screens/LoginScreen');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.accent }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={24} color={colors.accentText} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.accentText }]}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Profile Info */}
          <View style={styles.profile}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
                <Text style={[styles.avatarText, { color: colors.accentText }]}>
                  {getInitials(getDisplayName())}
                </Text>
              </View>
            )}
            <View>
              <Text style={[styles.name, { color: colors.textPrimary }]}>
                {userProfile?.fullName || getDisplayName()}
              </Text>
              <Text style={[styles.email, { color: colors.textMuted }]}>
                {userProfile?.email || getDisplayEmail()}
              </Text>
              <Text style={[styles.phone, { color: colors.textMuted }]}>
                {userProfile?.phoneNumber || getDisplayPhone()}
              </Text>
            </View>
          </View>

          {/* Change Profile Photo */}
          <TouchableOpacity
            style={[styles.profileBtn, { backgroundColor: colors.accent }]}
            onPress={showImagePickerOptions}
          >
            <Text style={[styles.profileBtnText, { color: colors.accentText }]}>Change profile photo</Text>
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Ionicons name="moon-outline" size={18} color={colors.accent} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>Dark mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.disabled, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          {settingsItem('lock-closed-outline', 'Change password', () => router.push('../../settings/Password'), colors)}
          {settingsItem('shield-checkmark-outline', 'Privacy & Data', () => router.push('../../settings/Privacy'), colors)}
          {settingsItem('language-outline', 'Language', () => router.push('/screens/LanguageSelectionScreen'), colors)}
          {settingsItem('help-circle-outline', 'Help', () => router.push('../../settings/Help'), colors)}
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.logout, { backgroundColor: colors.error }]} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: colors.accentText }]}>Log out</Text>
        </TouchableOpacity>

        {/* About Us */}
        <TouchableOpacity
          style={[styles.bottomLink, isDarkMode && { borderTopWidth: 1, borderTopColor: colors.border }]}
          onPress={() => router.push('../../settings/About')}
        >
          <Text style={[styles.bottomLinkText, { color: colors.textMuted }]}>About Us</Text>
        </TouchableOpacity>

        {/* Customer Service */}
        <TouchableOpacity
          style={[styles.bottomLink, isDarkMode && { borderTopWidth: 1, borderTopColor: colors.border }]}
          onPress={() => router.push('../../settings/Help')}
        >
          <Text style={[styles.bottomLinkText, { color: colors.textMuted }]}>Customer Service</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <BottomNavBar /> */}
    </View>
  );
};

const settingsItem = (icon, label, onPress, colors) => (
  <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={onPress}>
    <Ionicons name={icon} size={18} color={colors.accent} />
    <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={18} color={colors.textMuted} />
  </TouchableOpacity>
);

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
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
  },
  profileBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileBtnText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  logout: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomLink: {
    marginHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bottomLinkText: {
    fontSize: 14,
  },
});

export default SettingsScreen;
