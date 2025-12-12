import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { WhisperContext, TranscribeRealtimeOptions } from 'whisper.rn';

const APP_DIRECTORY_NAME = 'whisper-app-files';

interface UseAudioRecorderProps {
  whisperContext: WhisperContext | null;
}

export const useAudioRecorder = ({ whisperContext }: UseAudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const ensureMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Unsupported Platform',
        'Real-time transcription is not available on the web.'
      );
      return false;
    }

    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    });

    if (!permission) {
      Alert.alert(
        'Unsupported Platform',
        'Microphone permission is not available on this platform.'
      );
      return false;
    }

    try {
      // Pequeña espera para asegurar que la Activity esté lista
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));

      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log('Microphone permission granted');
        return true;
      } else {
        console.warn('Microphone permission not granted:', result);
        Alert.alert(
          'Microphone Permission',
          'Microphone permission is required for real-time transcription.'
        );
        return false;
      }
    } catch (err: any) {
      console.error('Failed to verify microphone permission:', err);

      // Si el error es porque la Activity no está lista, reintentar
      if (err?.message?.includes('not attached to an Activity')) {
        console.log('Retrying permission request...');
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
        try {
          const result = await request(permission);
          return result === RESULTS.GRANTED;
        } catch (retryErr) {
          console.error('Retry failed:', retryErr);
        }
      }

      Alert.alert(
        'Microphone Permission',
        'Unable to verify microphone permission. Please try again.'
      );
      return false;
    }
  };

  const startRecording = useCallback(async () => {
    if (!whisperContext) {
      Alert.alert('Error', 'Whisper not initialized');
      return;
    }

    try {
      const hasMicPermission = await ensureMicrophonePermission();
      if (!hasMicPermission) {
        setError('Recording requires microphone access.');
        return;
      }

      setIsRecording(true);
      setError('');

      console.log('Starting audio recording (no real-time processing)...');

      const appDirectory = `${RNFS.DocumentDirectoryPath}/${APP_DIRECTORY_NAME}`;
      await RNFS.mkdir(appDirectory).catch(() => {});

      const audioPath = `${appDirectory}/temp_recording.wav`;
      await RNFS.unlink(audioPath).catch(() => {});

      setRecordedAudioPath(audioPath);

      // ✅ Configuración optimizada: SOLO GRABA, no transcribe en tiempo real
      const realtimeOptions: TranscribeRealtimeOptions = {
        language: 'es',
        realtimeAudioSec: 120, // Máximo 2 minutos
        realtimeAudioSliceSec: 120, // ✅ Igual al total = no procesa chunks
        realtimeAudioMinSec: 120, // ✅ No procesa hasta el final
        audioOutputPath: audioPath, // ✅ Solo guarda el archivo
        // audioSessionOnStartIos: {
        //   // category: "Record",          // ✅ Solo grabación (más eficiente)
        //   // mode: "Measurement",         // ✅ Mejor calidad para voz
        //   options: [],
        // },
        audioSessionOnStopIos: 'restore',
      };

      const { stop } = await whisperContext.transcribeRealtime(realtimeOptions);
      setMediaRecorder({ stop });

      console.log('✅ Recording started (audio-only mode). File:', audioPath);
      console.log(
        '📝 The model will NOT process audio until you stop recording.'
      );
    } catch (err: any) {
      const errorMessage = `Failed to start recording: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert('Recording Error', errorMessage);
      setIsRecording(false);
    }
  }, [whisperContext]);

  const stopRecording = useCallback(async () => {
    try {
      console.log('Stopping recording...');

      if (mediaRecorder?.stop) {
        await mediaRecorder.stop();
      }

      setIsRecording(false);
      setMediaRecorder(null);

      // Esperar un poco para que el archivo se termine de escribir
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

      console.log('Recording stopped. File saved at:', recordedAudioPath);
      return recordedAudioPath;
    } catch (err: any) {
      const errorMessage = `Failed to stop recording: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert('Recording Error', errorMessage);
      return null;
    }
  }, [mediaRecorder, recordedAudioPath]);

  return {
    isRecording,
    recordedAudioPath,
    startRecording,
    stopRecording,
    error,
  };
};
