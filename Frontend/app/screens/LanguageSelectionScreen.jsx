import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelectionScreen = () => {
  const router = useRouter();
  const { selected } = useLocalSearchParams();
  const { t } = useTranslation();
  const { currentLanguage, getCurrentLanguageName } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    if (selected) {
      // Handle if a language is passed as parameter
      console.log('Selected language from params:', selected);
    }
  }, [selected]);

  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Image
        source={require('../../assets/swift-logo.png')}
        style={styles.logo}
      />

      <Text style={[styles.title, { color: isDark ? '#fff' : '#800080' }]}>
        {t('chooseLanguage')}
      </Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            borderColor: '#800080',
            backgroundColor: isDark ? '#1a1a1a' : '#fff',
          },
        ]}
        onPress={() => router.push('/screens/LanguagePicker')}
      >
        <Text style={[styles.dropdownText, { color: isDark ? '#fff' : '#800080' }]}>
          {getCurrentLanguageName()}
        </Text>
        <Ionicons name="chevron-down" size={20} color={isDark ? '#fff' : '#800080'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/screens/HomeScreen')}
      >
        <Text style={styles.buttonText}>{t('continue')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#800080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
