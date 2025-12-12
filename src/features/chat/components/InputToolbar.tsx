import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../styles/theme';
import { AudioRecorderButton } from './AudioRecorderButton';

interface InputToolbarProps {
  onSend: (text: string) => void;
  isTyping?: boolean;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isTranscribing?: boolean;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({ 
  onSend, 
  isTyping,
  isRecording = false,
  onStartRecording = () => {},
  onStopRecording = () => {},
  isTranscribing = false,
}) => {
  const theme = useTheme();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const showRecorder = (!text.trim() || isRecording) && onStartRecording;

  return (
    <View style={[styles.container, { borderTopColor: theme.cardBorder, backgroundColor: theme.background }]}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text }]}
        placeholder={isTranscribing ? "Procesando audio..." : "Escribe un mensaje..."}
        placeholderTextColor={theme.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        editable={!isTranscribing && !isRecording}
      />
      
      {showRecorder ? (
        <AudioRecorderButton 
          isRecording={isRecording}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          disabled={isTranscribing}
        />
      ) : (
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: theme.accent }]} 
          onPress={handleSend}
          disabled={!text.trim() || isTranscribing}
        >
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
