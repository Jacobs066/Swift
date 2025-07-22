import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SendOptionsScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#800080' }]}>
        How would you like to send money?
      </Text>

      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}
        onPress={() => router.push('/screens/SendToBank')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4334/4334959.png' }}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#800080' }]}>
          Send to Bank Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}
        onPress={() => router.push('/screens/SendToWallet')}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#800080' }]}>
          Send to Mobile Wallet
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendOptionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
