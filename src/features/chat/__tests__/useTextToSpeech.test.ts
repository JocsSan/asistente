import { renderHook } from '@testing-library/react-native';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import Tts from '@chuvincent/react-native-tts';

describe('useTextToSpeech', () => {
  it('speak llama a Tts.speak', () => {
    const { result } = renderHook(() => useTextToSpeech());
    result.current.speak('Hello');
    expect(Tts.speak).toHaveBeenCalledWith('Hello');
  });
});
