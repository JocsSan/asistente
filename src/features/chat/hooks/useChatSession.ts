import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatState, Message } from '../types';
import { chatService } from '../api/chatService';
import { useTextToSpeech } from './useTextToSpeech';

const STORAGE_KEY_AUTOPLAY = '@chat_autoplay_enabled';

export const useChatSession = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    isRecording: false,
    isTranscribing: false,
    autoPlayEnabled: true,
  });

  const { speak } = useTextToSpeech();

  // Load persisted preference
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY_AUTOPLAY);
        if (value !== null) {
          setState(prev => ({ ...prev, autoPlayEnabled: JSON.parse(value) }));
        }
      } catch (e) {
        console.error('Failed to load autoplay preference', e);
      }
    };
    loadPreference();
  }, []);

  const toggleAutoPlay = useCallback(async (value: boolean) => {
    setState(prev => ({ ...prev, autoPlayEnabled: value }));
    try {
      await AsyncStorage.setItem(STORAGE_KEY_AUTOPLAY, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save autoplay preference', e);
    }
  }, []);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(), // Simple ID generation
      text,
      sender,
      timestamp: Date.now(),
      status: 'sent',
    };
    setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    addMessage(text, 'user');
    setState(prev => ({ ...prev, isTyping: true }));

    try {
      const reply = await chatService.sendMessage(text);
      addMessage(reply, 'bot');
      
      if (state.autoPlayEnabled) {
        speak(reply);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error state if needed
    } finally {
      setState(prev => ({ ...prev, isTyping: false }));
    }
  }, [addMessage, state.autoPlayEnabled, speak]);

  return {
    state,
    sendMessage,
    toggleAutoPlay,
  };
};
