import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { verifyOTP, resendOTP } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const OTPVerificationScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { colors, radius, spacing } = useTheme();
  const { login } = useAuth();

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

      // The backend issues the session token here, once OTP is verified -
      // persist it via AuthContext rather than relying on a value from an
      // earlier screen.
      if ((purpose === 'login' || purpose === 'signup') && response.token) {
        await login(response.token, response.user);
      }

      // Navigate to home screen
      if (purpose === 'login' || purpose === 'signup') {
        router.push('/screens/HomeScreen');
      } else {
        // For other purposes, go back to previous screen
        router.push('/screens/HomeScreen');
      }

      Alert.alert(
        t('success'),
        t('otpVerificationSuccess') || 'OTP verified successfully!',
        [
          {
            text: t('continue'),
            onPress: () => {
              // Navigate based on purpose
              if (purpose === 'login' || purpose === 'signup') {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.infoText, { color: colors.textMuted }]}>
        {t('otpInfoText') || 'Please enter the code that was sent to'}{'\n'}
        <Text style={[styles.bold, { color: colors.textPrimary }]}>{formatPhoneNumber(phoneNumber)}</Text>
      </Text>

      <Text style={[styles.label, { color: colors.textPrimary }]}>{t('enterCode') || 'Enter Code'}</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpInput,
              {
                borderColor: colors.accent,
                borderRadius: radius.md,
                backgroundColor: digit ? colors.accent : colors.surface,
                color: digit ? colors.accentText : colors.textPrimary,
              },
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            placeholder="-"
            placeholderTextColor={colors.textMuted}
            editable={!loading}
          />
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>{t('verifying') || 'Verifying...'}</Text>
        </View>
      )}

      <TouchableOpacity
        disabled={timer !== 0 || resending}
        onPress={handleResendCode}
        style={[styles.resend, resending && styles.disabledResend]}
      >
        {resending ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Text style={[styles.resendText, { color: colors.accent }]}>
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
        <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>{t('back') || 'Back'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  bold: {
    fontWeight: 'bold',
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
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
    width: 45,
    height: 55,
    textAlign: 'center',
    fontSize: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
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
    fontSize: 16,
  },
});
