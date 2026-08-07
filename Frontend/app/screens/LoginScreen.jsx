import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const LoginScreen = () => {
  const router = useRouter();
  const { colors, spacing, typography } = useTheme();
  const { setIsNewUser } = useProfile();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', api: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    let hasError = false;
    let newErrors = { email: '', password: '', api: '' };
    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;
    try {
      setLoading(true);
      const data = await login(email, password);
      // Only save token if it exists
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        await AsyncStorage.setItem('lastLoginEmail', email); // Store email for future logins
        setIsNewUser(false);
      }
      setErrors({ email: '', password: '', api: '' });
      // If OTP is required, navigate to OTP verification
      if (data.message && data.message.includes('OTP')) {
        router.push({
          pathname: '/screens/OTPVerificationScreen',
          params: {
            phoneNumber: data.phoneNumber || email, // Use phone number from response or fallback to email
            purpose: 'login'
          }
        });
      } else if (data.token) {
        // If token is present, login is complete, navigate to home
        router.push('/screens/HomeScreen');
      } else {
        // Handle other cases or show a message
        setErrors(prev => ({ ...prev, api: data.message || 'Unknown login response' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, api: error.toString() }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backArrow} onPress={() => router.push('onboarding')}>
          <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
        </TouchableOpacity>

        <Text style={[typography.title, { color: colors.textPrimary, marginTop: spacing.md, marginBottom: spacing.md }]}>
          Welcome back
        </Text>

        <TextInput
          label="Email address"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          autoCapitalize="none"
          error={errors.email}
        />

        <TextInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
          }}
          error={errors.password}
        />

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { color: colors.accent }]}>Forgot password?</Text>
        </TouchableOpacity>

        <Button title="Log in" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.md }} />
        {errors.api ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.api}</Text> : null}

        <Text style={[styles.orText, { color: colors.textMuted }]}>or</Text>

        <Button
          title="Continue with Google"
          variant="secondary"
          onPress={() => {}}
        />

        <Text style={[styles.signupPrompt, { color: colors.textMuted }]}>
          Need a profile?{' '}
          <Text style={[styles.signupLink, { color: colors.accent }]} onPress={() => router.push('/screens/SignUpScreen')}>
            Sign up
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backArrow: {
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  signupPrompt: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  signupLink: {
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
