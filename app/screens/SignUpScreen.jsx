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

const SignUpScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      alert('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    alert('Account created successfully!');
    router.push('/screens/LanguageSelectionScreen');
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
        style={[styles.input, {
          borderColor: colors.border,
          backgroundColor: colors.inputBg,
          color: colors.text,
        }]}
        placeholder="Enter full name"
        placeholderTextColor={colors.placeholder}
        value={fullName}
        onChangeText={setFullName}
      />

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
        onChangeText={setEmail}
      />

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
        onChangeText={setPhoneNumber}
      />

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
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

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
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={[styles.signupButton, { backgroundColor: colors.primary }]} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

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
});

