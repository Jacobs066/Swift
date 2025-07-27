import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { i18n } = useTranslation();

  // Load saved language from AsyncStorage on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const changeLanguage = async (language) => {
    try {
      setCurrentLanguage(language);
      i18n.changeLanguage(language);
      await AsyncStorage.setItem('selectedLanguage', language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const getLanguageName = (languageCode) => {
    const languageNames = {
      en: 'English',
      fr: 'French',
      es: 'Spanish'
    };
    return languageNames[languageCode] || languageCode;
  };

  const getCurrentLanguageName = () => {
    return getLanguageName(currentLanguage);
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getLanguageName,
    getCurrentLanguageName,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 