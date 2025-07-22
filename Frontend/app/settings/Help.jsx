import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ Ensure the path is correct

export default function Help() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={styles.title}>Help</Text>

      <Text style={styles.text}>
        For assistance, contact our support team at:
        {'\n\n'}📧 Email: support@swiftapp.com{'\n'}📞 Phone: +233 123 456 789
      </Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => openLink('https://wa.me/233123456789')} style={styles.icon}>
          <FontAwesome name="whatsapp" size={28} color="#25D366" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://x.com/swiftapp')} style={styles.icon}>
          <Entypo name="twitter" size={28} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://facebook.com/swiftapp')} style={styles.icon}>
          <FontAwesome name="facebook-square" size={28} color="#4267B2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    backButton: {
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: isDarkMode ? '#fff' : '#800080',
    },
    text: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#333',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30,
    },
    icon: {
      marginHorizontal: 15,
    },
  });

