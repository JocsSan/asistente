import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ChatScreen } from './src/features/chat/screens/ChatScreen';
import { useTheme } from './src/styles/theme';

export default function App() {
  const theme = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <ChatScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
