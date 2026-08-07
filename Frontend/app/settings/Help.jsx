import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

export default function Help() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle" size={24} color={colors.accent} />
      </TouchableOpacity>

      <Text style={styles.title}>Customer Service</Text>
      <Text style={styles.text}>For assistance, contact our support team at:</Text>

      <View style={styles.iconRow}>
        {/* Email */}
        <TouchableOpacity
          onPress={() => openLink('mailto:israelabaefah2005@gmail.com')}
          style={styles.iconBox}
        >
          <Entypo name="email" size={30} color={colors.accent} />
          <Text style={styles.iconLabel}>Email</Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity
          onPress={() => openLink('tel:+233549308770')}
          style={styles.iconBox}
        >
          <FontAwesome name="phone" size={28} color={colors.accent} />
          <Text style={styles.iconLabel}>Call</Text>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity
          onPress={() => openLink('https://wa.me/233244361454')}
          style={styles.iconBox}
        >
          <FontAwesome name="whatsapp" size={30} color="#25D366" />
          <Text style={styles.iconLabel}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
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
      marginBottom: 15,
      color: colors.textPrimary,
    },
    text: {
      fontSize: 16,
      color: colors.textMuted,
      marginBottom: 20,
    },
    iconRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    iconBox: {
      alignItems: 'center',
    },
    iconLabel: {
      marginTop: 5,
      color: colors.textMuted,
      fontSize: 12,
    },
  });
