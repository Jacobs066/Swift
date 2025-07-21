import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const NotificationDetail = () => {
  const router = useRouter();
  const { title, message, time, icon, color } = useLocalSearchParams();
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f3ecf3ff' },
      ]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back-circle" size={28} color="#800080" />
      </TouchableOpacity>

      <View style={[styles.iconBox, { backgroundColor: color || '#800080' }]}>
        <Ionicons name={icon || 'notifications-outline'} size={36} color="#fff" />
      </View>

      <Text
        style={[
          styles.title,
          { color: isDarkMode ? '#f1f1f1' : '#800080' },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.message,
          { color: isDarkMode ? '#ccc' : '#444' },
        ]}
      >
        {message}
      </Text>

      <Text
        style={[
          styles.time,
          { color: isDarkMode ? '#999' : '#888' },
        ]}
      >
        {time}
      </Text>
    </SafeAreaView>
  );
};

export default NotificationDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 20,
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  time: {
    fontSize: 13,
    textAlign: 'center',
  },
});
