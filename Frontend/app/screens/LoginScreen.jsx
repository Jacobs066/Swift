import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', api: '' });
  const [loading, setLoading] = useState(false);

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    primary: '#800080',
    inputBg: isDarkMode ? '#1E1E1E' : '#fff',
    border: '#800080',
    placeholder: isDarkMode ? '#aaa' : '#666',
  };

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
          <Ionicons name="arrow-back-circle" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.header, { color: colors.primary }]}>Welcome back</Text>

        <Text style={[styles.label, { color: colors.primary }]}>Email address</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Enter your email"
          placeholderTextColor={colors.placeholder}
          keyboardType="email-address"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
          }}
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={[styles.label, { color: colors.primary }]}>Password</Text>
        <View style={[styles.passwordContainer, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
          <TextInput
            style={[styles.passwordInput, { color: colors.text }]}
            placeholder="Enter your password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Log in</Text>
          )}
        </TouchableOpacity>
        {errors.api ? <Text style={styles.errorText}>{errors.api}</Text> : null}

        <Text style={[styles.orText, { color: colors.placeholder }]}>or</Text>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.primary }]}>
          <Text style={[styles.altButtonText, { color: colors.primary }]}>Continue with Google</Text>
          <Ionicons name="logo-google" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.signupPrompt, { color: colors.placeholder }]}>
          Need a profile?{' '}
          <Text style={[styles.signupLink, { color: colors.primary }]} onPress={() => router.push('/screens/SignUpScreen')}>
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  altButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  icon: {
    width: 24,
    height: 24,
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
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2,
  },
});
