import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Message } from '../types';
import { useTheme } from '../../../styles/theme';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const theme = useTheme();
  const { speak } = useTextToSpeech();
  const isUser = message.sender === 'user';

  const handlePlay = () => {
    speak(message.text);
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser 
          ? { backgroundColor: theme.accent } 
          : { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder, borderWidth: 1 }
      ]}>
        <Text style={[
          styles.text,
          isUser ? { color: '#ffffff' } : { color: theme.text }
        ]}>
          {message.text}
        </Text>
        
        {!isUser && (
          <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
            <Text style={{ fontSize: 16, color: theme.accent }}>🔊</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  playButton: {
    marginTop: 4,
    alignSelf: 'flex-end',
    padding: 4,
  },
});
