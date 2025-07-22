import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const LanguagePicker = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const router = useRouter();

  const languages = [
    'English', 'French', 'Spanish', 'Arabic', 'Swahili', 'Portuguese',
    'Hausa', 'Yoruba', 'Twi',
    'German', 'Hindi', 'Mandarin', 'Italian',
  ];

  const handleContinue = () => {
    if (selectedLanguage) {
      console.log('Language selected:', selectedLanguage);
      router.push('/screens/HomeScreen'); // make sure this route exists
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang}
          onPress={() => setSelectedLanguage(lang)}
          style={[
            styles.languageButton,
            selectedLanguage === lang && styles.selectedLanguageButton,
          ]}
        >
          <Text style={styles.languageText}>{lang}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={handleContinue}
        style={[styles.continueButton, !selectedLanguage && { backgroundColor: '#ccc' }]}
        disabled={!selectedLanguage}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LanguagePicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#800080',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  languageButton: {
    marginVertical: 10,
  },
  selectedLanguageButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  languageText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  continueText: {
    color: '#800080',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
