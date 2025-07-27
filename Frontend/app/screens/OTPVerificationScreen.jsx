import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { verifyOTP, resendOTP } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPVerificationScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const phoneNumber = params.phoneNumber || '';
  const purpose = params.purpose || 'verification';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Auto-focus to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Last digit entered, auto-verify
        const fullOtp = newOtp.join('');
        if (fullOtp.length === 6) {
          handleVerifyOTP(fullOtp);
        }
      }
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      
      // Focus previous input on backspace
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    if (!phoneNumber) {
      Alert.alert(t('error'), 'Phone number is required');
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOTP(phoneNumber, otpCode);
      
      // Store verification token if provided
      if (response.token) {
        await AsyncStorage.setItem('verificationToken', response.token);
      }
      
      // For biometric login, get stored user data
      if (purpose === 'biometric_login') {
        const tempUserData = await AsyncStorage.getItem('tempUserData');
        if (tempUserData) {
          const userData = JSON.parse(tempUserData);
          // Store token for biometric login
          await AsyncStorage.setItem('token', 'biometric-auth-token-' + Date.now());
          await AsyncStorage.removeItem('tempUserData'); // Clean up
        }
      }
      
      Alert.alert(
        t('success'), 
        t('otpVerificationSuccess') || 'OTP verified successfully!',
        [
          {
            text: t('continue'),
            onPress: () => {
              // Navigate based on purpose
              if (purpose === 'login' || purpose === 'signup' || purpose === 'biometric_login') {
                router.push('/screens/HomeScreen');
              } else {
                router.push('/screens/HomeScreen');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('error'), error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) {
      Alert.alert(t('error'), 'Phone number is required');
      return;
    }

    try {
      setResending(true);
      await resendOTP(phoneNumber, purpose);
      setTimer(60);
      Alert.alert(t('success'), t('otpResentSuccess') || 'Code resent successfully!');
    } catch (error) {
      Alert.alert(t('error'), error.toString());
    } finally {
      setResending(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    // Format phone number for display (e.g., +233 50 123 4567)
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+233 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        {t('otpInfoText') || 'Please enter the code that was sent to'}{'\n'}
        <Text style={styles.bold}>{formatPhoneNumber(phoneNumber)}</Text>
      </Text>

      <Text style={styles.label}>{t('enterCode') || 'Enter Code'}</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              digit && styles.filledInput,
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            placeholder="-"
            placeholderTextColor={isDark ? '#aaa' : '#999'}
            editable={!loading}
          />
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#800080" />
          <Text style={styles.loadingText}>{t('verifying') || 'Verifying...'}</Text>
        </View>
      )}

      <TouchableOpacity
        disabled={timer !== 0 || resending}
        onPress={handleResendCode}
        style={[styles.resend, resending && styles.disabledResend]}
      >
        {resending ? (
          <ActivityIndicator size="small" color="#800080" />
        ) : (
          <Text style={styles.resendText}>
            {timer === 0 
              ? (t('sendAnotherCode') || 'Send another code')
              : `${t('sendAnotherCode') || 'Send another code'} (${timer}s)`
            }
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>{t('back') || 'Back'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerificationScreen;

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      padding: 24,
      justifyContent: 'center',
    },
    infoText: {
      textAlign: 'center',
      color: isDark ? '#fff' : '#800080',
      fontSize: 16,
      marginBottom: 30,
    },
    bold: {
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#800080',
    },
    label: {
      textAlign: 'center',
      fontSize: 16,
      color: isDark ? '#fff' : '#800080',
      marginBottom: 12,
      fontWeight: 'bold',
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 24,
    },
    otpInput: {
      borderWidth: 2,
      borderColor: '#800080',
      borderRadius: 10,
      width: 45,
      height: 55,
      textAlign: 'center',
      fontSize: 18,
      color: isDark ? '#fff' : '#800080',
      backgroundColor: isDark ? '#1e1e1e' : '#fff',
    },
    filledInput: {
      backgroundColor: '#800080',
      color: '#fff',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    loadingText: {
      marginLeft: 10,
      color: isDark ? '#fff' : '#800080',
      fontSize: 14,
    },
    resend: {
      alignSelf: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    disabledResend: {
      opacity: 0.5,
    },
    resendText: {
      color: '#800080',
      fontWeight: 'bold',
      fontSize: 16,
    },
    backButton: {
      alignSelf: 'center',
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    backButtonText: {
      color: isDark ? '#fff' : '#800080',
      fontSize: 16,
    },
  });
