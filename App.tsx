import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/features/auth/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useTheme } from './src/styles/theme';

export default function App() {
  const theme = useTheme();

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <AppNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
