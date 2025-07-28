import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, biometricLogin } from '../api';

const LoginScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', api: '' });
  const [biometricLoading, setBiometricLoading] = useState(false);

  // Generate and store device ID for biometric authentication
  useEffect(() => {
    const generateDeviceId = async () => {
      try {
        const existingDeviceId = await AsyncStorage.getItem('deviceId');
        if (!existingDeviceId) {
          const deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          await AsyncStorage.setItem('deviceId', deviceId);
          await AsyncStorage.setItem('deviceName', 'Mobile Device');
        }
      } catch (error) {
        console.error('Error generating device ID:', error);
      }
    };
    
    generateDeviceId();
  }, []);

  const colors = {
    background: isDarkMode ? '#121212' : '#fff',
    text: isDarkMode ? '#fff' : '#000',
    primary: '#800080',
    inputBg: isDarkMode ? '#1E1E1E' : '#fff',
    border: '#800080',
    placeholder: isDarkMode ? '#aaa' : '#666',
  };

  const handleBiometricLogin = async () => {
    try {
      setBiometricLoading(true);
      setErrors({ email: '', password: '', api: '' });

      // Check if device supports biometric authentication
    const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Not Supported', 'Biometric authentication is not supported on this device.');
        return;
      }

      // Check if user has biometrics enrolled
    const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert('Not Set Up', 'No biometrics enrolled on this device. Please set up fingerprint or face recognition.');
        return;
      }

      // Get stored email for biometric login
      const storedEmail = await AsyncStorage.getItem('lastLoginEmail');
      if (!storedEmail) {
        Alert.alert('No Previous Login', 'Please login with email and password first to enable biometric authentication.');
        return;
      }

      // Authenticate with device biometrics
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with biometrics',
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      });

      if (!result.success) {
        if (result.error === 'UserCancel') {
          // User cancelled, no need to show error
          return;
        }
        Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again.');
        return;
      }

      // Get device info for biometric login
      const deviceId = await AsyncStorage.getItem('deviceId') || 'default-device';
      const deviceName = await AsyncStorage.getItem('deviceName') || 'Mobile Device';
      
      // Determine biometric type
      const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometricType = biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) 
        ? 'FINGERPRINT' 
        : 'FACE_ID';

      // Call backend biometric login
      const biometricData = 'biometric-auth-' + Date.now(); // Simplified for demo
      const response = await biometricLogin(storedEmail, biometricType, biometricData, deviceId);

      if (response.success) {
        // Store user info for OTP verification
        await AsyncStorage.setItem('tempUserData', JSON.stringify(response.user));
        
        Alert.alert(
          'Biometric Authentication Successful', 
          'OTP has been sent to your email for additional security verification.',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate to OTP verification
                router.push({
                  pathname: '/screens/OTPVerificationScreen',
                  params: {
                    phoneNumber: response.user.phoneNumber || response.user.emailOrPhone,
                    purpose: 'biometric_login'
                  }
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('Login Failed', response.message || 'Biometric login failed. Please try again.');
      }

    } catch (error) {
      console.error('Biometric login error:', error);
      
      // Handle specific error cases
      if (error.toString().includes('User not found')) {
        Alert.alert('User Not Found', 'No account found with the stored email. Please login with email and password first.');
      } else if (error.toString().includes('Biometric data not found')) {
        Alert.alert('Biometric Not Set Up', 'Biometric authentication is not set up for this device. Please login with email and password first.');
      } else if (error.toString().includes('Biometric verification failed')) {
        Alert.alert('Verification Failed', 'Biometric verification failed. Please try again or use email/password login.');
    } else {
        Alert.alert('Login Failed', error.toString() || 'Biometric login failed. Please try again.');
      }
    } finally {
      setBiometricLoading(false);
    }
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
      const data = await login(email, password);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('lastLoginEmail', email); // Store email for biometric login
      setErrors({ email: '', password: '', api: '' });
      
      // Navigate to OTP verification with user's phone number
      router.push({
        pathname: '/screens/OTPVerificationScreen',
        params: {
          phoneNumber: data.phoneNumber || email, // Use phone number from response or fallback to email
          purpose: 'login'
        }
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, api: error.toString() }));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

      <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
      {errors.api ? <Text style={styles.errorText}>{errors.api}</Text> : null}

      <Text style={[styles.orText, { color: colors.placeholder }]}>or</Text>

      <TouchableOpacity style={[styles.socialButton, { borderColor: colors.primary }]}>
        <Text style={[styles.altButtonText, { color: colors.primary }]}>Continue with Google</Text>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.biometricButton, biometricLoading && styles.biometricButtonDisabled]} 
        onPress={handleBiometricLogin}
        disabled={biometricLoading}
      >
        {biometricLoading ? (
          <>
            <Ionicons name="finger-print" size={24} color={colors.placeholder} />
            <Text style={[styles.biometricText, { color: colors.placeholder }]}>Authenticating...</Text>
          </>
        ) : (
          <>
        <Ionicons name="finger-print" size={24} color={colors.primary} />
        <Text style={[styles.biometricText, { color: colors.primary }]}>Login with biometrics</Text>
          </>
        )}
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
    fontSize: 16,
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
    fontSize: 14,
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
    fontSize: 14,
  },
  biometricButtonDisabled: {
    opacity: 0.6,
  },
  signupPrompt: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
  },
  signupLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 2,
  },
});
