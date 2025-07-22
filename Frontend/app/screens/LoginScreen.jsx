import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const LoginScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    primary: '#800080',
    inputBg: isDarkMode ? '#1E1E1E' : '#fff',
    border: '#800080',
    placeholder: isDarkMode ? '#aaa' : '#666',
  };

  const handleBiometricLogin = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return alert('Biometric authentication not supported');

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return alert('No biometrics enrolled');

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with biometrics',
    });

    if (result.success) {
      Alert.alert('Success', 'Biometric authentication successful');
      // router.push('/home');
    } else {
      alert('Authentication failed');
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    alert('Login successful!');
    router.push('/screens/OTPVerificationScreen');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.push('onboarding')}>
        <Ionicons name="arrow-back-circle" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.header, { color: colors.primary }]}>Welcome back</Text>

      <Text style={[styles.label, { color: colors.primary }]}>Email address</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
        placeholder="Enter your email"
        placeholderTextColor={colors.placeholder}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={[styles.label, { color: colors.primary }]}>Password</Text>
      <View style={[styles.passwordContainer, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          placeholder="Enter your password"
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <Text style={[styles.orText, { color: colors.placeholder }]}>or</Text>

      <TouchableOpacity style={[styles.socialButton, { borderColor: colors.primary }]}>
        <Text style={[styles.altButtonText, { color: colors.primary }]}>Continue with Google</Text>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, { borderColor: colors.primary }]}>
        <Text style={[styles.altButtonText, { color: colors.primary }]}>Continue with Apple</Text>
        <Ionicons name="logo-apple" size={22} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
        <Ionicons name="finger-print" size={24} color={colors.primary} />
        <Text style={[styles.biometricText, { color: colors.primary }]}>Login with biometrics</Text>
      </TouchableOpacity>

      <Text style={[styles.signupPrompt, { color: colors.placeholder }]}>
        Need a profile?{' '}
        <Text style={[styles.signupLink, { color: colors.primary }]} onPress={() => router.push('/screens/SignUpScreen')}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  socialButton: {
    flexDirection: 'row',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 22,
    height: 22,
  },
  altButtonText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  biometricButton: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  signupPrompt: {
    marginTop: 30,
    textAlign: 'center',
  },
  signupLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
