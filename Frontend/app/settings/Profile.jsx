import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ProfileContext } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext'; // ✅ Import your theme context

export default function ChangeProfilePhoto() {
  const router = useRouter();
  const { profileImage, setProfileImage } = useContext(ProfileContext);
  const [image, setImage] = useState(profileImage);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={styles.title}>Change Profile Photo</Text>
        <Text style={{ marginTop: 20, fontSize: 16, color: colors.textMuted }}>
          This feature is not available on web.
        </Text>
      </View>
    );
  }

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission denied', 'We need media library access to pick an image.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const selected = result.assets[0].uri;
      setImage(selected);
      setProfileImage(selected);
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission denied', 'We need camera access to take a photo.');
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const captured = result.assets[0].uri;
      setImage(captured);
      setProfileImage(captured);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={styles.title}>Change Profile Photo</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="person-circle-outline" size={100} color={colors.textMuted} />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
        <Ionicons name="image-outline" size={20} color={colors.accentText} />
        <Text style={styles.buttonText}>Select from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhotoWithCamera}>
        <Ionicons name="camera-outline" size={20} color={colors.accentText} />
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.textPrimary,
    },
    placeholder: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 140,
      height: 140,
      borderRadius: 70,
      marginBottom: 20,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.accent,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 10,
    },
    buttonText: {
      color: colors.accentText,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });
