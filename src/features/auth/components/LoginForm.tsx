import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../styles/theme';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login({ email, password });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.cardBackground, 
            color: theme.text,
            borderColor: theme.cardBorder 
          }]}
          placeholder="Enter your email"
          placeholderTextColor={theme.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.cardBackground, 
            color: theme.text,
            borderColor: theme.cardBorder 
          }]}
          placeholder="Enter your password"
          placeholderTextColor={theme.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.errorBackground, borderColor: theme.errorBorder }]}>
          <Text style={[styles.errorText, { color: theme.errorText }]}>{error.message}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.accent, opacity: isLoading ? 0.7 : 1 }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
