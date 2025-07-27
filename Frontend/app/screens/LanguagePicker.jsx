import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const LanguagePicker = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: t('english') },
    { code: 'fr', name: t('french') },
    { code: 'es', name: t('spanish') }
  ];

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = async () => {
    if (selectedLanguage) {
      try {
        await changeLanguage(selectedLanguage);
        console.log('Language selected:', selectedLanguage);
        router.push('/screens/HomeScreen');
      } catch (error) {
        console.error('Error changing language:', error);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleLanguageSelect(lang.code)}
          style={[
            styles.languageButton,
            selectedLanguage === lang.code && styles.selectedLanguageButton,
          ]}
        >
          <Text style={styles.languageText}>{lang.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={handleContinue}
        style={[styles.continueButton, !selectedLanguage && { backgroundColor: '#ccc' }]}
        disabled={!selectedLanguage}
      >
        <Text style={styles.continueText}>{t('continue')}</Text>
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
