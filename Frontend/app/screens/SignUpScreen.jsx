// screens/SignUpScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext'; // ✅ Using your context
import { signup } from '../api';

const SignUpScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      // Use the first word of the full name as the username
      const username = fullName.trim().split(' ')[0];
      await signup(username, fullName, email, phoneNumber, password);
      setErrors({ fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '', api: '' });
      // Navigate to OTP verification for signup
      router.push({
        pathname: '/screens/OTPVerificationScreen',
        params: {
          phoneNumber: phoneNumber,
          purpose: 'signup'
        }
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, api: error.toString() }));
    }
  };

  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    placeholder: isDark ? '#aaaaaa' : '#888888',
    border: isDark ? '#555555' : '#800080',
    inputBg: isDark ? '#1e1e1e' : '#ffffff',
    primary: '#800080',
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Ionicons name="arrow-back-circle" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Image
        source={require('../../assets/swift-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.header, { color: colors.primary }]}>Create Your Swift Profile</Text>

      {/* Full Name */}
      <Text style={[styles.label, { color: colors.primary }]}>Full Name</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.inputBg, color: colors.text }]}
        placeholder="Enter your full name"
        placeholderTextColor={colors.placeholder}
        value={fullName}
        onChangeText={text => {
          setFullName(text);
          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
        }}
        autoCapitalize="words"
      />
      {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

      {/* Email */}
      <Text style={[styles.label, { color: colors.primary }]}>Email</Text>
      <TextInput
        style={[styles.input, {
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
          color: colors.text,
        }]}
        placeholder="Enter email"
        placeholderTextColor={colors.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => {
          setEmail(text);
          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
        }}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      {/* Phone Number */}
      <Text style={[styles.label, { color: colors.primary }]}>Phone Number</Text>
      <TextInput
        style={[styles.input, {
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
          color: colors.text,
        }]}
        placeholder="Enter phone number"
        placeholderTextColor={colors.placeholder}
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={text => {
          setPhoneNumber(text);
          if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
        }}
      />
      {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

      {/* Password */}
      <Text style={[styles.label, { color: colors.primary }]}>Password</Text>
      <View style={[styles.passwordContainer, {
        borderColor: colors.border,
        backgroundColor: colors.inputBg,
      }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          placeholder="Enter password"
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      {/* Confirm Password */}
      <Text style={[styles.label, { color: colors.primary }]}>Confirm Password</Text>
      <View style={[styles.passwordContainer, {
        borderColor: colors.border,
        backgroundColor: colors.inputBg,
      }]}>
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          placeholder="Re-enter password"
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
          }}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

      {/* Sign Up Button */}
      <TouchableOpacity style={[styles.signupButton, { backgroundColor: colors.primary }]} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
      {errors.api ? <Text style={styles.errorText}>{errors.api}</Text> : null}

      <Text style={[styles.loginPrompt, { color: colors.placeholder }]}>
        Already have a profile?{' '}
        <Text
          style={[styles.loginLink, { color: colors.primary }]}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
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
    marginRight: 10,
  },
  signupButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2,
  },
});

