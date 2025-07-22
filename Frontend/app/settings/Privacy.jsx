import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ Adjust path as needed

export default function Privacy() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={isDarkMode ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <Text style={styles.title}>Privacy & Data Policy</Text>
      <Text style={styles.text}>
        We respect your privacy. Your personal data is stored securely and never shared without your consent.
        {'\n\n'}This includes data such as email, phone number, and transaction history.
      </Text>
    </ScrollView>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      flexGrow: 1,
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
      color: isDarkMode ? '#ddd' : '#333',
    },
  });
