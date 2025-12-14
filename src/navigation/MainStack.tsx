import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatScreen } from '../features/chat/screens/ChatScreen';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useTheme } from '../styles/theme';

const Stack = createStackNavigator();

export const MainStack = () => {
  const { logout } = useAuth();
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: 'transparent', // iOS
          elevation: 0, // Android
          borderBottomWidth: 1,
          borderBottomColor: theme.cardBorder,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          title: 'Asistente',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={[styles.logoutText, { color: theme.accent }]}>Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
