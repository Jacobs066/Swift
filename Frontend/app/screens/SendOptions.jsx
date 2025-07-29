import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getSendMethods } from '../utils/api';

const SendOptionsScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [sendMethods, setSendMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSendMethods();
  }, []);

  const loadSendMethods = async () => {
    try {
      setLoading(true);
      const methods = await getSendMethods();
      setSendMethods(methods);
    } catch (error) {
      Alert.alert('Error', 'Failed to load send methods: ' + error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleSendToBank = () => {
    router.push('/screens/SendToBank');
  };

  const handleSendToMobile = () => {
    router.push('/screens/SendToWallet');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#800080'} />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>Loading send methods...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#800080' }]}>
        How would you like to send money?
      </Text>

      {/* Send to Bank Account */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}
        onPress={handleSendToBank}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4334/4334959.png' }}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#800080' }]}>
          Send to Bank Account
        </Text>
        <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      {/* Send to Mobile Wallet */}
      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}
        onPress={handleSendToMobile}
      >
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }}
          style={styles.icon}
        />
        <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#800080' }]}>
          Send to Mobile Wallet
        </Text>
        <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#fff' : '#800080'} />
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    flex: 1,
  },
});
