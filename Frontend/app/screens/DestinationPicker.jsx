import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ Dark mode support
import { Ionicons } from '@expo/vector-icons'; // ✅ npm install @expo/vector-icons

const DestinationPicker = () => {
  const [fromCountry, setFromCountry] = useState('United States');
  const [toCountry, setToCountry] = useState('');
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const countries = [
    'Ghana',
    'Nigeria',
    'Kenya',
    'India',
    'Philippines',
    'Italy',
    'France',
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color="#800080" />
      </TouchableOpacity>

      <Text style={[styles.title, { color: '#800080' }]}>
        Where do you want to send money?
      </Text>

      <Text style={[styles.label, { color: '#800080' }]}>From</Text>
      <View
        style={[
          styles.dropdown,
          { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        ]}
      >
        <Picker
          selectedValue={fromCountry}
          onValueChange={(itemValue) => setFromCountry(itemValue)}
          dropdownIconColor="#800080"
          style={{ color: isDark ? '#fff' : '#000' }}
        >
          <Picker.Item label="United States" value="United States" />
          <Picker.Item label="Canada" value="Canada" />
          <Picker.Item label="UK" value="UK" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: '#800080' }]}>To</Text>
      <View
        style={[
          styles.dropdown,
          { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        ]}
      >
        <Picker
          selectedValue={toCountry}
          onValueChange={(itemValue) => setToCountry(itemValue)}
          dropdownIconColor="#800080"
          style={{ color: isDark ? '#fff' : '#000' }}
        >
          <Picker.Item label="Choose your country" value="" />
          {countries.map((country) => (
            <Picker.Item key={country} label={country} value={country} />
          ))}
        </Picker>
      </View>

      <Text style={[styles.orText, { color: '#800080' }]}>――― or ―――</Text>

      <Text style={[styles.choosePopular, { color: '#800080' }]}>
        choose a popular country to send money
      </Text>

      <View style={styles.flagRow}>
        <TouchableOpacity onPress={() => setToCountry('Italy')}>
          <Image
            source={{ uri: 'https://flagcdn.com/w320/it.png' }}
            style={styles.flag}
          />
          <Text style={styles.flagLabel}>Italy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setToCountry('Philippines')}>
          <Image
            source={{ uri: 'https://flagcdn.com/w320/ph.png' }}
            style={styles.flag}
          />
          <Text style={styles.flagLabel}>Philippines</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push('/screens/HomeScreen')}
        disabled={!toCountry}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DestinationPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 70,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#800080',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  choosePopular: {
    textAlign: 'center',
    marginBottom: 10,
  },
  flagRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 6,
  },
  flagLabel: {
    textAlign: 'center',
    marginTop: 4,
    color: '#800080',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#800080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

