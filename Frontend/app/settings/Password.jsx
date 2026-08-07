import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { changePassword } from '../utils/api';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

export default function ChangePassword() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword || newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters';
    if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Passwords do not match';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await changePassword(currentPassword, newPassword, confirmNewPassword);
      if (response.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        Alert.alert('Success', response.message || 'Password changed successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        setErrors({ api: response.message || 'Failed to change password' });
      }
    } catch (error) {
      setErrors({ api: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={styles.title}>Change Password</Text>

      <TextInput
        label="Current Password"
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        error={errors.currentPassword}
      />
      <TextInput
        label="New Password"
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        error={errors.newPassword}
      />
      <TextInput
        label="Confirm New Password"
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        error={errors.confirmNewPassword}
      />
      {errors.api ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.api}</Text> : null}

      <Button title="Update Password" onPress={handleUpdatePassword} loading={loading} style={{ marginTop: 20 }} />
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    backButton: {
      marginBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.textPrimary,
    },
    errorText: {
      marginTop: 8,
      fontSize: 12,
      textAlign: 'center',
    },
  });
