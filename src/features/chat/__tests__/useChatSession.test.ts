import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useChatSession } from '../hooks/useChatSession';
import { chatService } from '../api/chatService';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../api/chatService');
jest.mock('../hooks/useTextToSpeech');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('useChatSession', () => {
  const mockSpeak = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTextToSpeech as jest.Mock).mockReturnValue({ speak: mockSpeak });
  });

  it('debería inicializar con estado por defecto', async () => {
    const { result } = renderHook(() => useChatSession());

    expect(result.current.state.messages).toEqual([]);
    expect(result.current.state.isTyping).toBe(false);
    // autoPlayEnabled might be true or false depending on async storage, but default is true in code
    // We need to wait for useEffect
    await waitFor(() => expect(result.current.state.autoPlayEnabled).toBe(true));
  });

  it('debería enviar mensaje y recibir respuesta', async () => {
    (chatService.sendMessage as jest.Mock).mockResolvedValue('Hello User');

    const { result } = renderHook(() => useChatSession());

    await act(async () => {
      await result.current.sendMessage('Hello Bot');
    });

    expect(result.current.state.messages).toHaveLength(2);
    expect(result.current.state.messages[0].text).toBe('Hello Bot');
    expect(result.current.state.messages[0].sender).toBe('user');
    expect(result.current.state.messages[1].text).toBe('Hello User');
    expect(result.current.state.messages[1].sender).toBe('bot');
    
    expect(chatService.sendMessage).toHaveBeenCalledWith('Hello Bot');
    expect(mockSpeak).toHaveBeenCalledWith('Hello User');
  });

  it('debería alternar reproducción automática', async () => {
    const { result } = renderHook(() => useChatSession());

    await act(async () => {
      await result.current.toggleAutoPlay(false);
    });

    expect(result.current.state.autoPlayEnabled).toBe(false);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@chat_autoplay_enabled', 'false');
  });
});
