import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ProfileProvider } from './context/ProfileContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { WalletProvider } from './context/WalletContext';
import '../i18n'; // Import i18n configuration

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <LanguageProvider>
        <ThemeProvider>
          <ProfileProvider>
            <WalletProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </WalletProvider>
          </ProfileProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



