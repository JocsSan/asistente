import { useState, useEffect, useCallback } from 'react';
import Tts from '@chuvincent/react-native-tts';

type Status = 'started' | 'finished' | 'cancelled';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const handleTtsStart = () => {
      setIsSpeaking(true);
      setStatus('started');
    };

    const handleTtsFinish = () => {
      setIsSpeaking(false);
      setStatus('finished');
    };

    const handleTtsCancel = () => {
      setIsSpeaking(false);
      setStatus('cancelled');
    };

    Tts.addEventListener('tts-start', handleTtsStart);
    Tts.addEventListener('tts-finish', handleTtsFinish);
    Tts.addEventListener('tts-cancel', handleTtsCancel);

    // Initialize TTS
    Tts.getInitStatus().then(() => {
      // Optional: Configure default voice/language here if needed
      // Tts.setDefaultLanguage('es-ES');
    });

    return () => {
      Tts.removeEventListener('tts-start', handleTtsStart);
      Tts.removeEventListener('tts-finish', handleTtsFinish);
      Tts.removeEventListener('tts-cancel', handleTtsCancel);
    };
  }, []);

  const speak = useCallback((text: string) => {
    Tts.stop();
    Tts.speak(text);
  }, []);

  const stop = useCallback(() => {
    Tts.stop();
  }, []);

  return { speak, stop, isSpeaking, status };
};
