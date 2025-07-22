import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ Update path if needed

export default function ChangePassword() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={styles.title}>Change Password</Text>

      <TextInput
        placeholder="Current Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="New Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm New Password"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
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
      marginBottom: 20,
      color: isDarkMode ? '#fff' : '#800080',
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#ccc',
      padding: 12,
      marginBottom: 15,
      borderRadius: 10,
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? '#222' : '#fff',
    },
    button: {
      backgroundColor: '#800080',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
