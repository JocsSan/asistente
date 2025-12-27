import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ChatScreen } from '../screens/ChatScreen';
import { useChatSession } from '../hooks/useChatSession';
import { useWhisperTranscriber } from '../hooks/useWhisperTranscriber';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

// Mock hooks
jest.mock('../hooks/useChatSession');
jest.mock('../hooks/useWhisperTranscriber');
jest.mock('../hooks/useAudioRecorder');
// Mock useTextToSpeech because MessageBubble uses it
jest.mock('../hooks/useTextToSpeech', () => ({
  useTextToSpeech: () => ({ speak: jest.fn() }),
}));

describe('ChatScreen', () => {
  const mockSendMessage = jest.fn();
  const mockToggleAutoPlay = jest.fn();
  const mockStartRecording = jest.fn();
  const mockStopRecording = jest.fn();
  const mockTranscribeAudio = jest.fn();
  const mockInitializeWhisperModel = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();

    (useChatSession as jest.Mock).mockReturnValue({
      state: {
        messages: [],
        isTyping: false,
        autoPlayEnabled: true,
      },
      sendMessage: mockSendMessage,
      toggleAutoPlay: mockToggleAutoPlay,
    });

    (useWhisperTranscriber as jest.Mock).mockReturnValue({
      whisperContext: {},
      transcribeAudio: mockTranscribeAudio,
      isTranscribing: false,
      initializeWhisperModel: mockInitializeWhisperModel,
      isInitializingModel: false,
    });

    (useAudioRecorder as jest.Mock).mockReturnValue({
      isRecording: false,
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
    });
  });

  it('renderiza correctamente', () => {
    const { getByPlaceholderText } = render(<ChatScreen />);
    expect(getByPlaceholderText('Escribe un mensaje...')).toBeTruthy();
  });

  it('envía un mensaje cuando se presiona el botón de enviar', () => {
    const { getByPlaceholderText, getByText } = render(<ChatScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Escribe un mensaje...'), 'Hello');
    fireEvent.press(getByText('Enviar'));

    expect(mockSendMessage).toHaveBeenCalledWith('Hello');
  });

  it('muestra mensajes', () => {
    (useChatSession as jest.Mock).mockReturnValue({
      state: {
        messages: [
          { id: '1', text: 'Hello User', sender: 'bot', timestamp: 123 },
          { id: '2', text: 'Hi Bot', sender: 'user', timestamp: 124 },
        ],
        isTyping: false,
        autoPlayEnabled: true,
      },
      sendMessage: mockSendMessage,
      toggleAutoPlay: mockToggleAutoPlay,
    });

    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('Hello User')).toBeTruthy();
    expect(getByText('Hi Bot')).toBeTruthy();
  });

  it('muestra indicador de escritura', () => {
    (useChatSession as jest.Mock).mockReturnValue({
      state: {
        messages: [],
        isTyping: true,
        autoPlayEnabled: true,
      },
      sendMessage: mockSendMessage,
      toggleAutoPlay: mockToggleAutoPlay,
    });

    const { getByText } = render(<ChatScreen />);
    
    expect(getByText('Escribiendo...')).toBeTruthy();
  });
});
