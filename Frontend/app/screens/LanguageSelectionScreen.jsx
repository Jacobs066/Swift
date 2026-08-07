import React, { useEffect } from 'react';
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
import Button from '../components/Button';

const LanguageSelectionScreen = () => {
  const router = useRouter();
  const { selected } = useLocalSearchParams();
  const { t } = useTranslation();
  const { currentLanguage, getCurrentLanguageName } = useLanguage();
  const { colors } = useTheme();

  useEffect(() => {
    if (selected) {
      // Handle if a language is passed as parameter
      console.log('Selected language from params:', selected);
    }
  }, [selected]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../../assets/swift-logo.png')}
        style={styles.logo}
      />

      <Text style={[styles.title, { color: colors.accent }]}>
        {t('chooseLanguage')}
      </Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            borderColor: colors.accent,
            backgroundColor: colors.surface,
          },
        ]}
        onPress={() => router.push('/screens/LanguagePicker')}
      >
        <Text style={[styles.dropdownText, { color: colors.accent }]}>
          {getCurrentLanguageName()}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.accent} />
      </TouchableOpacity>

      <Button
        title={t('continue')}
        onPress={() => router.push('/screens/HomeScreen')}
      />
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
});
