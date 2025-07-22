import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';

const OTPVerificationScreen = () => {
  const router = useRouter();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
      if (index < 5) inputRefs.current[index + 1].focus();
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const resendCode = () => {
    setTimer(60);
    alert('Code resent');
  };

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Please enter the code that was sent to {'\n'}
        <Text style={styles.bold}>your number</Text>
      </Text>

      <Text style={styles.label}>Enter Code</Text>
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
          />
        ))}
      </View>

      <TouchableOpacity
        disabled={timer !== 0}
        onPress={resendCode}
        style={styles.resend}
      >
        <Text style={styles.resendText}>
          {timer === 0 ? 'Send another code' : `Send another code (${timer}s)`}
        </Text>
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
    resend: {
      alignSelf: 'center',
    },
    resendText: {
      color: '#800080',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
