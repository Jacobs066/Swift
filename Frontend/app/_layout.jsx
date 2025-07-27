import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ProfileProvider } from './context/ProfileContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import '../i18n'; // Import i18n configuration

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <LanguageProvider>
        <ThemeProvider>
          <ProfileProvider>
            <Stack screenOptions={{ headerShown: false }} />
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



