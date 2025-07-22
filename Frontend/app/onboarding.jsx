import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext'; // 👈 your dark mode context

const slides = [
  {
    id: 1,
    title: 'Send money worry-free',
    subtitle: 'Trusted by over 5 million people worldwide.',
    image: require('../assets/phone.png'),
  },
  {
    id: 2,
    title: 'Safe and secure',
    subtitle: 'Your information is always confidential and your money is protected.',
    image: require('../assets/handshake.png'),
  },
  {
    id: 3,
    title: 'Guaranteed delivery',
    subtitle: 'Your money arrives at the time promised, or fees are refunded.',
    image: require('../assets/recieved.png'),
  },
];

const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  const colors = {
    background: isDark ? '#000' : '#fff',
    text: isDark ? '#fff' : '#800080',
    subtitle: isDark ? '#ccc' : '#888',
    dotActive: '#800080',
    dotInactive: isDark ? '#444' : '#ccc',
    border: '#800080',
    buttonText: '#fff',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Skip Button */}
      {currentSlide < slides.length && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/screens/SignUpScreen')}
        >
          <Text style={[styles.skipText, { color: colors.text }]}>SKIP</Text>
        </TouchableOpacity>
      )}

      {/* Slide Image */}
      <Image source={slides[currentSlide].image} style={styles.image} resizeMode="contain" />

      {/* Slide Text */}
      <Text style={[styles.title, { color: colors.text }]}>{slides[currentSlide].title}</Text>
      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        {slides[currentSlide].subtitle}
      </Text>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentSlide === index ? colors.dotActive : colors.dotInactive,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        {currentSlide > 0 && (
          <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconButton} onPress={handleNext}>
          <Ionicons
            name={currentSlide === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: colors.text }]}
        onPress={handleNext}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          {currentSlide === slides.length - 1 ? 'Continue' : 'Create a new profile'}
        </Text>
      </TouchableOpacity>

      {/* Already Have a Profile */}
      <TouchableOpacity
        style={[styles.secondaryButton, { borderColor: colors.border }]}
        onPress={() => router.push('/screens/LoginScreen')}
      >
        <Text style={[styles.secondaryText, { color: colors.text }]}>I already have a profile</Text>
      </TouchableOpacity>
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
  image: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  dot: {
    height: 6,
    width: 20,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  navButtons: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 15,
  },
  iconButton: {
    padding: 10,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  secondaryText: {
    fontWeight: 'bold',
  },
});
