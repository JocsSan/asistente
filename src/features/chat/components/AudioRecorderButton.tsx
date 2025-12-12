import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../styles/theme';

interface AudioRecorderButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

export const AudioRecorderButton: React.FC<AudioRecorderButtonProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  disabled,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handlePress = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isRecording && styles.recordingButton,
        disabled && styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        {isRecording ? (
          <View style={styles.stopIcon} />
        ) : (
          <View style={styles.micIcon} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    recordingButton: {
      backgroundColor: theme.errorBorder || '#FF3B30',
    },
    disabledButton: {
      backgroundColor: theme.textMuted || '#A0A0A0',
      opacity: 0.6,
    },
    iconContainer: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    micIcon: {
      width: 12,
      height: 18,
      borderRadius: 6,
      backgroundColor: '#FFFFFF',
    },
    stopIcon: {
      width: 14,
      height: 14,
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
    },
  });
