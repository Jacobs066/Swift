// screens/SignUpScreen.js
import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { signup } from '../utils/api';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const SignUpScreen = () => {
  const router = useRouter();
  const { colors, spacing, typography } = useTheme();
  const { setIsNewUser } = useProfile();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', api: '' });

  const handleSignUp = async () => {
    let hasError = false;
    let newErrors = { fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', api: '' };
    if (!fullName) {
      newErrors.fullName = 'Full name is required';
      hasError = true;
    }
    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      hasError = true;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }
    setErrors(newErrors);
    if (hasError) return;
    try {
      setLoading(true);
      // Use the first word of the full name as the username
      const username = fullName.trim().split(' ')[0];
      await signup(username, fullName, email, phoneNumber, password);
      setErrors({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', api: '' });
      setIsNewUser(true);
      // Navigate to OTP verification for signup. The OTP is issued against the
      // account's email server-side, so that's the identifier verification needs -
      // not the phone number, even though this param is historically named phoneNumber.
      router.push({
        pathname: '/screens/OTPVerificationScreen',
        params: {
          phoneNumber: email,
          purpose: 'signup'
        }
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, api: error.toString() }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={30} color={colors.accent} />
      </TouchableOpacity>

      <Image
        source={require('../../assets/swift-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[typography.title, styles.header, { color: colors.textPrimary }]}>Create Your Swift Profile</Text>

      <TextInput
        label="Full Name"
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={text => {
          setFullName(text);
          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
        }}
        autoCapitalize="words"
        error={errors.fullName}
      />

      <TextInput
        label="Email"
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
        }}
        error={errors.email}
      />

      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={text => {
          setPhoneNumber(text);
          if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }}
        error={errors.phoneNumber}
      />

      <TextInput
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={text => {
          setPassword(text);
          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
        }}
        error={errors.password}
      />

      <TextInput
        label="Confirm Password"
        placeholder="Re-enter password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
          if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }}
        error={errors.confirmPassword}
      />

      <Button title="Sign Up" onPress={handleSignUp} loading={loading} style={{ marginTop: spacing.md }} />
      {errors.api ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.api}</Text> : null}

      <Text style={[styles.loginPrompt, { color: colors.textMuted }]}>
        Already have a profile?{' '}
        <Text
          style={[styles.loginLink, { color: colors.accent }]}
          onPress={() => router.push('/screens/LoginScreen')}
        >
          Log in
        </Text>
      </Text>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  backArrow: {
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 90,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginPrompt: {
    marginTop: 30,
    textAlign: 'center',
  },
  loginLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
