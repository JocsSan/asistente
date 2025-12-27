import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { useWhisperModels } from '../../../hooks/useWhisperModel';

export const useWhisperTranscriber = () => {
  const { whisperContext, ...modelProps } = useWhisperModels();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const transcribeAudio = useCallback(async (audioPath: string) => {
    if (!whisperContext) {
      Alert.alert('Error', 'Whisper not initialized');
      return null;
    }

    if (!audioPath) {
      Alert.alert('Error', 'No recorded audio found');
      return null;
    }

    try {
      setIsTranscribing(true);
      setTranscriptionResult('');
      setError('');

      console.log('Starting transcription of recorded audio:', audioPath);

      const fileExists = await RNFS.exists(audioPath);
      if (!fileExists) {
        throw new Error('Recorded audio file not found');
      }

      const options = { language: 'es' };
      const { promise } = whisperContext.transcribe(`file://${audioPath}`, options);

      const startTime = Date.now();
      const { result } = await promise;
      const endTime = Date.now();

      console.log(`Transcription completed in ${endTime - startTime}ms`);
      console.log('Result:', result);
      
      setTranscriptionResult(result);
      return result;

    } catch (err: any) {
      const errorMessage = `Transcription failed: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert('Transcription Error', errorMessage);
      return null;
    } finally {
      setIsTranscribing(false);
    }
  }, [whisperContext]);

  return {
    whisperContext,
    isTranscribing,
    transcriptionResult,
    transcribeAudio,
    error,
    ...modelProps,
  };
};
