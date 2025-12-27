import React from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '../../../styles/theme';

interface ChatLayoutProps {
  children: React.ReactNode;
  autoPlayEnabled: boolean;
  onToggleAutoPlay: (value: boolean) => void;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ 
  children, 
  autoPlayEnabled, 
  onToggleAutoPlay 
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.text }]}>Asistente</Text>
        <View style={styles.controls}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Auto-leer</Text>
          <Switch
            value={autoPlayEnabled}
            onValueChange={onToggleAutoPlay}
            trackColor={{ false: theme.cardBorder, true: theme.accent }}
          />
        </View>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
});
