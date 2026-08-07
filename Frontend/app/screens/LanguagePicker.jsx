import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

const LanguagePicker = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const { colors } = useTheme();

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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleLanguageSelect(lang.code)}
          style={[
            styles.languageButton,
            selectedLanguage === lang.code && { borderBottomWidth: 2, borderBottomColor: colors.accent },
          ]}
        >
          <Text style={[styles.languageText, { color: colors.textPrimary }]}>{lang.name}</Text>
        </TouchableOpacity>
      ))}

      <Button
        title={t('continue')}
        onPress={handleContinue}
        disabled={!selectedLanguage}
        style={{ marginTop: 40 }}
      />
    </ScrollView>
  );
};

export default LanguagePicker;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  languageButton: {
    marginVertical: 10,
  },
  languageText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
