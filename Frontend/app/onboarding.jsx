import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext';
import Button from './components/Button';
import DotIndicator from './components/DotIndicator';

const slides = [
  {
    id: 1,
    title: 'Send money worry-free',
    subtitle: 'Trusted by over 5 million people worldwide.',
    icon: 'phone-portrait-outline',
  },
  {
    id: 2,
    title: 'Safe and secure',
    subtitle: 'Your information is always confidential and your money is protected.',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 3,
    title: 'Guaranteed delivery',
    subtitle: 'Your money arrives at the time promised, or fees are refunded.',
    icon: 'checkmark-circle-outline',
  },
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { colors, spacing, typography } = useTheme();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/screens/SignUpScreen');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {currentSlide < slides.length && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/screens/SignUpScreen')}
        >
          <Text style={[styles.skipText, { color: colors.textMuted }]}>SKIP</Text>
        </TouchableOpacity>
      )}

      <Ionicons name={slides[currentSlide].icon} size={200} color={colors.accent} />

      <Text style={[typography.title, styles.title, { color: colors.textPrimary }]}>
        {slides[currentSlide].title}
      </Text>
      <Text style={[typography.body, styles.subtitle, { color: colors.textMuted }]}>
        {slides[currentSlide].subtitle}
      </Text>

      <DotIndicator total={slides.length} currentIndex={currentSlide} />

      <View style={styles.navButtons}>
        {currentSlide > 0 && (
          <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={handleNext}>
          <Ionicons
            name={currentSlide === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <Button
        title={currentSlide === slides.length - 1 ? 'Continue' : 'Create a new profile'}
        onPress={handleNext}
        style={{ width: '100%', marginBottom: spacing.sm }}
      />

      <Button
        title="I already have a profile"
        variant="secondary"
        onPress={() => router.push('/screens/LoginScreen')}
        style={{ width: '100%' }}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  skipText: {
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    marginHorizontal: 20,
  },
  navButtons: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 15,
  },
  iconButton: {
    padding: 10,
  },
});
