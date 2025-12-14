import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../features/auth/hooks/useAuth';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import { View, ActivityIndicator } from 'react-native';

export const AppNavigator = () => {
  const { status } = useAuth();

  if (status === 'idle') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {status === 'authenticated' ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
