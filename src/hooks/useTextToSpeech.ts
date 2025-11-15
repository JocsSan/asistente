import { useState, useEffect } from 'react';
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

    // Inicializar y configurar el motor TTS
    Tts.getInitStatus().then(() => {
        // Opcional: configurar idioma, velocidad, etc.
        //Tts.setDefaultVoice('es-us-x-sfb-network');  
        //Tts.setDefaultVoice('es-us-x-esc-network');
        // Tts.setDefaultLanguage('es-ES');
        // Tts.setDefaultRate(0.5);
    });

    return () => {
      Tts.removeEventListener('tts-start', handleTtsStart);
      Tts.removeEventListener('tts-finish', handleTtsFinish);
      Tts.removeEventListener('tts-cancel', handleTtsCancel);
    };

    //voces disponibles

  }, []);

  const speak = (text: string) => {
    Tts.stop();
    Tts.voices().then(voices => {
        const vocesEnEs = voices.filter(voice => voice.language.startsWith('es'));
      console.log('Voices:', vocesEnEs);
    });
    Tts.speak(text);
  };

  const stop = () => {
    Tts.stop();
  };

  return { speak, stop, isSpeaking, status };
};
