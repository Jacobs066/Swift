
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ProfileContext } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import { getUserProfile } from '../api';
import BottomNavBar from '../components/BottomNavBar';

const SettingsScreen = () => {
  const router = useRouter();
  const { profileImage, setProfileImage } = useContext(ProfileContext);
  const { isDarkMode, toggleTheme } = useTheme();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.log('Failed to load user profile:', error);
      // Silently handle error, fallback to default values
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    if (userProfile?.fullName) return userProfile.fullName;
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    if (userProfile?.firstName) return userProfile.firstName;
    if (userProfile?.username) return userProfile.username;
    return 'User';
  };

  const getDisplayEmail = () => {
    if (userProfile?.email) return userProfile.email;
    if (userProfile?.emailOrPhone && userProfile.emailOrPhone.includes('@')) {
      return userProfile.emailOrPhone;
    }
    return 'No email';
  };

  const getDisplayPhone = () => {
    if (userProfile?.phone) return userProfile.phone;
    if (userProfile?.phoneNumber) return userProfile.phoneNumber;
    if (userProfile?.emailOrPhone && !userProfile.emailOrPhone.includes('@')) {
      return userProfile.emailOrPhone;
    }
    return 'No phone';
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to select photos.');
        return false;
      }
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return false;
      }
    }
    return true;
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImage(),
        },
        {
          text: 'Remove Photo',
          onPress: () => removePhoto(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
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

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const removePhoto = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setProfileImage(null),
        },
      ]
    );
  };

  const themeStyles = getThemeStyles(isDarkMode);

  return (
    <View style={{ flex: 1 }}>
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
                {getDisplayName()}
              </Text>
              <Text style={themeStyles.email}>
                {getDisplayEmail()}
              </Text>
              <Text style={themeStyles.phone}>
                {getDisplayPhone()}
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
      <BottomNavBar />
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
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
