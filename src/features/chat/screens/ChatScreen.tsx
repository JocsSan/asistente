import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { ChatLayout } from '../components/ChatLayout';
import { MessageList } from '../components/MessageList';
import { InputToolbar } from '../components/InputToolbar';
import { useChatSession } from '../hooks/useChatSession';
import { useWhisperTranscriber } from '../hooks/useWhisperTranscriber';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTheme } from '../../../styles/theme';

export const ChatScreen = () => {
  const theme = useTheme();
  const { state, sendMessage, toggleAutoPlay } = useChatSession();
  
  const { 
    whisperContext, 
    transcribeAudio, 
    isTranscribing, 
    initializeWhisperModel,
    isInitializingModel,
  } = useWhisperTranscriber();

  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
  } = useAudioRecorder({ whisperContext });

  useEffect(() => {
    // Initialize with base model by default
    initializeWhisperModel('base', { initVad: false }).catch(err => {
      console.error("Failed to init model", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopRecording = async () => {
    const audioPath = await stopRecording();
    if (audioPath) {
      const text = await transcribeAudio(audioPath);
      if (text) {
        sendMessage(text.trim());
      }
    }
  };

  return (
    <ChatLayout 
      autoPlayEnabled={state.autoPlayEnabled} 
      onToggleAutoPlay={toggleAutoPlay}
    >
      <MessageList messages={state.messages} />
      
      {(state.isTyping || isTranscribing || isInitializingModel) && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={[styles.typingText, { color: theme.textMuted }]}>
            {isInitializingModel ? "Cargando modelo..." : 
             isTranscribing ? "Transcribiendo..." : 
             "Escribiendo..."}
          </Text>
        </View>
      )}

      <InputToolbar 
        onSend={sendMessage} 
        isTyping={state.isTyping}
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={handleStopRecording}
        isTranscribing={isTranscribing || isInitializingModel}
      />
    </ChatLayout>
  );
};

const styles = StyleSheet.create({
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  typingText: {
    marginLeft: 8,
    fontSize: 12,
  },
});
