import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ make sure path is correct

export default function About() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const themeStyles = styles(isDarkMode);

  return (
    <View style={themeStyles.container}>
      <TouchableOpacity onPress={() => router.back()} style={themeStyles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Image source={require('../../assets/swift-logo.png')} style={themeStyles.logo} />

      <Text style={themeStyles.title}>About Swift</Text>
      <Text style={themeStyles.text}>
        Swift is a modern fintech solution for cross-border transfers and digital wallet services. Version 1.0.0
      </Text>
    </View>
  );
}

const styles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
    },
    logo: {
      width: 80,
      height: 80,
      marginTop: 60,
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#800080',
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      color: isDarkMode ? '#ccc' : '#333',
    },
  });
