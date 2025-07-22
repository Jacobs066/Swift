import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ProfileProvider } from './context/ProfileContext';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Import ThemeProvider

export default function Layout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider> {/* ✅ Wrap ThemeProvider first */}
        <ProfileProvider> {/* ✅ Wrap ProfileProvider inside */}
          <Stack screenOptions={{ headerShown: false }} />
        </ProfileProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



