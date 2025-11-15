import { useColorScheme } from 'react-native';

const ACCENT_COLOR = '#0A84FF';

const lightTheme = {
  background: '#ffffff',
  text: '#111111',
  textSecondary: '#333333',
  textMuted: '#666666',
  cardBackground: '#ffffff',
  cardBorder: '#e5e5ea',
  errorBackground: '#fff5f4',
  errorText: '#b3261e',
  errorBorder: '#ff3b30',
  liveBackground: '#f5f8ff',
  accent: ACCENT_COLOR,
};

const darkTheme = {
  background: '#000000',
  text: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#999999',
  cardBackground: '#1c1c1e',
  cardBorder: '#3a3a3c',
  errorBackground: '#2c1a19',
  errorText: '#ffb4ab',
  errorBorder: '#ff6666',
  liveBackground: '#001f57',
  accent: ACCENT_COLOR,
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
