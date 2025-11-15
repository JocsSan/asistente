import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { useWhisperModels } from "./src/hooks/useWhisperModel";
import { useTextToSpeech } from "./src/hooks/useTextToSpeech";
import RNFS from "react-native-fs";
import { TranscribeRealtimeOptions } from "whisper.rn/index.js";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useTheme } from "./src/styles/theme"; // Importa el hook del tema

const APP_DIRECTORY_NAME = "whisper-app-files";

export default function App() {
  const theme = useTheme(); // Usa el hook para obtener los colores del tema
  const styles = getStyles(theme); // Genera los estilos dinámicamente

  const { speak, stop: stopTts, isSpeaking, status: ttsStatus } = useTextToSpeech();
  const [textToSpeak, setTextToSpeak] = useState(
    "¡Hola! Esto es una prueba de la funcionalidad de texto a voz."
  );
  const [realtimeTranscriber, setRealtimeTranscriber] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string>("");
  const [realtimeResult, setRealtimeResult] = useState<string>("");
  const [realtimeFinalResult, setRealtimeFinalResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDeletingModelId, setIsDeletingModelId] = useState<string | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState<string>("");
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);

  const {
    whisperContext,
    isInitializingModel,
    isDownloading,
    downloadProgress,
    currentModelId,
    modelFiles,
    initializeWhisperModel,
    getCurrentModel,
    getDownloadProgress,
    getModelById,
    deleteModel,
  } = useWhisperModels();

  useEffect(() => {
    initializeModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeModel = async (modelId: string = "base") => {
    try {
      await initializeWhisperModel(modelId, { initVad: false });
    } catch (err: any) {
      console.error("Failed to initialize model:", err);
      setError(`Failed to initialize model: ${err.message}`);
    }
  };

  const ensureMicrophonePermission = async (): Promise<boolean> => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Unsupported Platform",
        "Real-time transcription is not available on the web."
      );
      return false;
    }

    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    });

    if (!permission) {
      Alert.alert(
        "Unsupported Platform",
        "Microphone permission is not available on this platform."
      );
      return false;
    }

    try {
      // Pequeña espera para asegurar que la Activity esté lista
      await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
      
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        console.log("Microphone permission granted");
        return true;
      } else {
        console.warn("Microphone permission not granted:", result);
        Alert.alert(
          "Microphone Permission",
          "Microphone permission is required for real-time transcription."
        );
        return false;
      }
    } catch (err: any) {
      console.error("Failed to verify microphone permission:", err);
      
      // Si el error es porque la Activity no está lista, reintentar
      if (err?.message?.includes("not attached to an Activity")) {
        console.log("Retrying permission request...");
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
        try {
          const result = await request(permission);
          return result === RESULTS.GRANTED;
        } catch (retryErr) {
          console.error("Retry failed:", retryErr);
        }
      }
      
      Alert.alert(
        "Microphone Permission",
        "Unable to verify microphone permission. Please try again."
      );
      return false;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.min(
      units.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024))
    );
    const scaled = bytes / Math.pow(1024, index);
    return `${scaled.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const handleDeleteModel = (modelId: string) => {
    if (isRealtimeActive || isTranscribing) {
      Alert.alert(
        "Busy",
        "Please stop any active transcription before deleting models."
      );
      return;
    }

    const modelLabel = getModelById(modelId)?.label || modelId;

    Alert.alert(
      "Delete Model",
      `Remove ${modelLabel} from this device? You can download it again later.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeletingModelId(modelId);
            try {
              await deleteModel(modelId);
              setRealtimeTranscriber(null);
              setRealtimeResult("");
              setRealtimeFinalResult("");
            } catch (err: any) {
              const message = `Failed to delete model: ${err.message}`;
              console.error(message);
              Alert.alert("Delete Error", message);
            } finally {
              setIsDeletingModelId(null);
            }
          },
        },
      ]
    );
  };

  const startRecording = async () => {
    if (!whisperContext) {
      Alert.alert("Error", "Whisper not initialized");
      return;
    }

    try {
      const hasMicPermission = await ensureMicrophonePermission();
      if (!hasMicPermission) {
        setError("Recording requires microphone access.");
        return;
      }

      // Limpiar estado anterior
      setIsRecording(true);
      setTranscriptionResult("");
      setError("");

      console.log("Starting audio recording...");

      const appDirectory = `${RNFS.DocumentDirectoryPath}/${APP_DIRECTORY_NAME}`;
      await RNFS.mkdir(appDirectory).catch(() => {}); // Crear directorio si no existe
      
      const audioPath = `${appDirectory}/temp_recording.wav`;
      
      // Borrar grabación anterior si existe
      await RNFS.unlink(audioPath).catch(() => {});
      
      setRecordedAudioPath(audioPath);

      const realtimeOptions: TranscribeRealtimeOptions = {
        language: "es",
        realtimeAudioSec: 120, // 2 minutos máximo
        realtimeAudioSliceSec: 120, // No procesar hasta el final
        realtimeAudioMinSec: 1,
        audioOutputPath: audioPath, // ¡AQUÍ SE GUARDA EL ARCHIVO!
        audioSessionOnStartIos: {
          category: "PlayAndRecord" as any,
          options: ["MixWithOthers" as any],
          mode: "Default" as any,
        },
        audioSessionOnStopIos: "restore" as any,
      };

      const { stop } = await whisperContext.transcribeRealtime(realtimeOptions);
      setMediaRecorder({ stop });
      
      console.log("Recording started. Audio will be saved to:", audioPath);
    } catch (err: any) {
      const errorMessage = `Failed to start recording: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert("Recording Error", errorMessage);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("Stopping recording...");
      
      if (mediaRecorder?.stop) {
        await mediaRecorder.stop();
      }
      
      setIsRecording(false);
      setMediaRecorder(null);
      
      // Esperar un poco para que el archivo se termine de escribir
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      
      console.log("Recording stopped. File saved at:", recordedAudioPath);
      
      // Preguntar si desea transcribir
      Alert.alert(
        "Grabación completa",
        "¿Deseas transcribir el audio grabado?",
        [
          { 
            text: "Cancelar", 
            style: "cancel",
            onPress: async () => {
              // Borrar el archivo temporal
              if (recordedAudioPath) {
                await RNFS.unlink(recordedAudioPath).catch(() => {});
                setRecordedAudioPath("");
              }
            }
          },
          { 
            text: "Transcribir", 
            onPress: () => transcribeRecordedAudio() 
          }
        ]
      );
    } catch (err: any) {
      const errorMessage = `Failed to stop recording: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert("Recording Error", errorMessage);
    }
  };

  const transcribeRecordedAudio = async () => {
    if (!whisperContext) {
      Alert.alert("Error", "Whisper not initialized");
      return;
    }

    if (!recordedAudioPath) {
      Alert.alert("Error", "No recorded audio found");
      return;
    }

    try {
      setIsTranscribing(true);
      setTranscriptionResult("");
      setError("");

      console.log("Starting transcription of recorded audio:", recordedAudioPath);

      const fileExists = await RNFS.exists(recordedAudioPath);
      if (!fileExists) {
        throw new Error("Recorded audio file not found");
      }

      const options = { language: "es" };
      const { promise } = whisperContext.transcribe(`file://${recordedAudioPath}`, options);

      const startTime = Date.now();
      const { result } = await promise;
      const endTime = Date.now();

      console.log(`Transcription completed in ${endTime - startTime}ms`);
      console.log("Result:", result);

      setTranscriptionResult(result || "No transcription result");
      
      // Borrar el archivo temporal después de transcribir
      await RNFS.unlink(recordedAudioPath).catch(() => {});
      setRecordedAudioPath("");
    } catch (err: any) {
      const errorMessage = `Transcription failed: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert("Transcription Error", errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  };

  const transcribeAudio = async () => {
    if (!whisperContext) {
      Alert.alert("Error", "Whisper not initialized");
      return;
    }

    try {
      setIsTranscribing(true);
      setTranscriptionResult("");
      setError("");

      console.log("Starting transcription...");

      const appDirectory = `${RNFS.DocumentDirectoryPath}/${APP_DIRECTORY_NAME}`;
      const audioFilePath = `${appDirectory}/sample.wav`;

      const fileExists = await RNFS.exists(audioFilePath);
      if (!fileExists) {
        console.log("Downloading audio sample...");
        const url =
          "https://github.com/ggerganov/whisper.cpp/raw/master/samples/jfk.wav";
        await RNFS.mkdir(appDirectory);
        await RNFS.downloadFile({ fromUrl: url, toFile: audioFilePath }).promise;
        console.log("download complete (sample.wav) file");
      }

      const options = { language: "en" };
      const { promise } = whisperContext.transcribe(`file://${audioFilePath}`, options);

      const startTime = Date.now();
      const { result } = await promise;
      const endTime = Date.now();

      console.log(`Transcription completed in ${endTime - startTime}ms`);
      console.log("Result:", result);

      setTranscriptionResult(result || "No transcription result");
    } catch (err: any) {
      const errorMessage = `Transcription failed: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert("Transcription Error", errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRealtimeTranscription = async () => {
    if (!whisperContext) {
      Alert.alert("Error", "Whisper not initialized");
      return;
    }

    try {
      const hasMicPermission = await ensureMicrophonePermission();
      if (!hasMicPermission) {
        setError("Real-time transcription requires microphone access.");
        return;
      }

      setIsRealtimeActive(true);
      setRealtimeResult("");
      setError("");

      console.log("Starting real-time transcription...");

      const realtimeOptions: TranscribeRealtimeOptions = {
        language: "es",
        realtimeAudioSec: 300,
        realtimeAudioSliceSec: 30,
        realtimeAudioMinSec: 2,
        audioSessionOnStartIos: {
          category: "PlayAndRecord" as any,
          options: ["MixWithOthers" as any],
          mode: "Default" as any,
        },
        audioSessionOnStopIos: "restore" as any,
      };

      const { stop, subscribe } = await whisperContext.transcribeRealtime(
        realtimeOptions
      );

      subscribe((event: any) => {
        const { isCapturing, data, processTime, recordingTime } = event;

        console.log(
          `Realtime transcribing: ${isCapturing ? "ON" : "OFF"}\n` +
            `Result: ${data?.result || "No result"}\n` +
            `Process time: ${processTime}ms\n` +
            `Recording time: ${recordingTime}ms`
        );

        if (data?.result) {
          const currentResult = data.result.trim();
          setRealtimeResult(currentResult);
          console.log(" Actualización en tiempo real:", {
            isCapturing,
            length: currentResult.length,
            lastWords: currentResult.split(" ").slice(-5).join(" "),
            totalWords: currentResult.split(" ").length,
          });
        }

        if (!isCapturing) {
          console.log("Speech segment finished, but continuing to listen...");
        }
      });

      setRealtimeTranscriber({ stop });
    } catch (err: any) {
      const errorMessage = `Real-time transcription failed: ${err.message}`;
      console.error(errorMessage);
      setError(errorMessage);
      Alert.alert("Real-time Error", errorMessage);
      setIsRealtimeActive(false);
    }
  };

  const stopRealtimeTranscription = async () => {
    try {
      if (realtimeTranscriber?.stop) {
        await realtimeTranscriber.stop();
        setRealtimeTranscriber(null);
      }

      const finalTranscript = realtimeResult.trim();
      if (finalTranscript) {
        setRealtimeFinalResult(finalTranscript);
        console.log("Final real-time transcript:", finalTranscript);
      }

      setIsRealtimeActive(false);
      console.log("Real-time transcription stopped");
    } catch (err) {
      console.error("Error stopping real-time transcription:", err);
    }
  };

  const activeModelLabel = getCurrentModel()?.label || "Model";
  const downloadPercentage =
    getDownloadProgress(currentModelId || "base") ?? 0;
  const whisperStatusText = isDownloading
    ? `Downloading ${activeModelLabel} · ${(downloadPercentage * 100).toFixed(
        0
      )}%`
    : isInitializingModel
    ? "Initializing…"
    : whisperContext
    ? `Ready · ${activeModelLabel}`
    : "Not initialized";
  const realtimeStatusText = isRealtimeActive ? "Listening" : "Idle";
  const transcriptionStatusText = isTranscribing
    ? "Processing sample…"
    : "Idle";
  const storedModels = Object.entries(modelFiles);
  const isDarkMode = theme.background === '#000000';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Whisper Demo</Text>
          <Text style={styles.subtitle}>
            Minima transcripción de modelos whisper.rn.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.cardLabel}>Algo salió mal</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Status</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusCard,
                whisperContext && styles.statusCardActive,
              ]}
            >
              <Text style={styles.statusTitle}>Modelo</Text>
              <Text style={styles.statusValue}>{whisperStatusText}</Text>
            </View>
            <View
              style={[
                styles.statusCard,
                isRealtimeActive && styles.statusCardActive,
              ]}
            >
              <Text style={styles.statusTitle}>En vivo</Text>
              <Text style={styles.statusValue}>{realtimeStatusText}</Text>
            </View>
            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Archivo</Text>
              <Text style={styles.statusValue}>{transcriptionStatusText}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, isRealtimeActive && styles.liveCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Transcripción en vivo</Text>
            {isRealtimeActive ? (
              <Text style={styles.liveBadge}>En vivo</Text>
            ) : null}
          </View>
          <Text
            style={[
              styles.cardText,
              !realtimeResult && styles.placeholderText,
            ]}
          >
            {realtimeResult ||
              "Inicie una sesión en vivo para ver la transcripción aquí en tiempo real."}
          </Text>
        </View>

        {realtimeFinalResult ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Última transcripción en vivo</Text>
              <TouchableOpacity onPress={() => setRealtimeFinalResult("")}>
                <Text style={styles.link}>Borrar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{realtimeFinalResult}</Text>
          </View>
        ) : null}

        {transcriptionResult ? (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Transcripción de archivo</Text>
            <Text style={styles.cardText}>{transcriptionResult}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Texto a Voz</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Prueba la conversión de texto a voz</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setTextToSpeak}
              value={textToSpeak}
              placeholder="Escribe algo para escuchar..."
              placeholderTextColor={theme.textMuted}
              multiline
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.primaryButton,
                  (isSpeaking || !textToSpeak) && styles.buttonDisabled,
                ]}
                onPress={() => speak(textToSpeak)}
                disabled={isSpeaking || !textToSpeak}
              >
                <Text style={styles.primaryButtonText}>
                  {isSpeaking ? "Hablando..." : "Reproducir"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.stopButton,
                  !isSpeaking && styles.buttonDisabled,
                ]}
                onPress={stopTts}
                disabled={!isSpeaking}
              >
                <Text style={styles.stopButtonText}>Detener</Text>
              </TouchableOpacity>
            </View>
            {ttsStatus && <Text style={[styles.statusValue, { marginTop: 12 }]}>Estado: {ttsStatus}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Grabación de Audio</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                isRecording ? styles.stopButton : styles.primaryButton,
                (!whisperContext || isTranscribing || isRealtimeActive) && styles.buttonDisabled,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={!whisperContext || isTranscribing || isRealtimeActive}
            >
              <Text style={isRecording ? styles.stopButtonText : styles.primaryButtonText}>
                {isRecording ? "⏹ Detener grabación" : "🎤 Grabar audio"}
              </Text>
            </TouchableOpacity>


          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Acciones rápidas</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                (!whisperContext || isTranscribing) && styles.buttonDisabled,
              ]}
              onPress={transcribeAudio}
              disabled={!whisperContext || isTranscribing}
            >
              <Text style={styles.primaryButtonText}>
                {isTranscribing ? "Transcribing…" : "Transcribe sample"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                isRealtimeActive ? styles.stopButton : styles.secondaryButton,
                !whisperContext && styles.buttonDisabled,
              ]}
              onPress={
                isRealtimeActive
                  ? stopRealtimeTranscription
                  : startRealtimeTranscription
              }
              disabled={!whisperContext}
            >
              <Text
                style={
                  isRealtimeActive
                    ? styles.stopButtonText
                    : styles.secondaryButtonText
                }
              >
                {isRealtimeActive ? "Stop live session" : "Start live session"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Modelos</Text>
          <View style={styles.modelGrid}>
            {["large-v3-turbo", "large-v3-turbo-q5_0", "tiny", "base", "small", "small-q5_1"].map((modelId) => {
              const isActive = getCurrentModel()?.id === modelId;
              return (
                <TouchableOpacity
                  key={modelId}
                  style={[
                    styles.modelChip,
                    isActive && styles.modelChipActive,
                    (isDownloading || isInitializingModel) &&
                      styles.buttonDisabled,
                  ]}
                  onPress={() => initializeModel(modelId)}
                  disabled={isDownloading || isInitializingModel}
                >
                  <Text
                    style={[
                      styles.modelChipText,
                      isActive && styles.modelChipTextActive,
                    ]}
                  >
                    {modelId}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {storedModels.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Modelos almacenados</Text>
            {storedModels.map(([modelId, info]) => {
              const modelLabel = getModelById(modelId)?.label || modelId;
              const isCurrent = currentModelId === modelId;
              const deleting = isDeletingModelId === modelId;

              return (
                <View key={modelId} style={styles.storageRow}>
                  <View style={styles.storageMeta}>
                    <Text style={styles.storageName}>
                      {modelLabel}
                      {isCurrent ? " · active" : ""}
                    </Text>
                    <Text style={styles.storageDetails}>
                      Size {formatBytes(info.size)}
                    </Text>
                    <Text
                      style={styles.storagePath}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {info.path}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteModel(modelId)}
                    disabled={deleting}
                  >
                    <Text
                      style={[
                        styles.deleteLink,
                        deleting && styles.deleteDisabled,
                      ]}
                    >
                      {deleting ? "Deleting…" : "Remove"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.textSecondary,
  },
  textInput: {
    borderColor: theme.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
    color: theme.text,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  statusCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 12,
    minWidth: 140,
    flexGrow: 1,
  },
  statusCardActive: {
    borderColor: theme.accent,
    backgroundColor: theme.liveBackground,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    lineHeight: 22,
  },
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 20,
    marginBottom: 24,
  },
  liveCard: {
    borderColor: theme.accent,
    backgroundColor: theme.liveBackground,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.text,
  },
  placeholderText: {
    color: theme.textMuted,
  },
  liveBadge: {
    color: theme.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  errorCard: {
    borderColor: theme.errorBorder,
    backgroundColor: theme.errorBackground,
  },
  errorText: {
    color: theme.errorText,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    marginBottom: 16,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme.accent,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  secondaryButtonText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  stopButton: {
    backgroundColor: "#111111",
  },
  stopButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  modelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  modelChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    marginHorizontal: 6,
    marginBottom: 12,
    backgroundColor: theme.cardBackground,
  },
  modelChipActive: {
    borderColor: theme.accent,
    backgroundColor: theme.liveBackground,
  },
  modelChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.text,
  },
  modelChipTextActive: {
    color: theme.accent,
  },
  storageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.cardBorder,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    backgroundColor: theme.cardBackground,
  },
  storageMeta: {
    flex: 1,
    marginRight: 12,
  },
  storageName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 6,
  },
  storageDetails: {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 4,
  },
  storagePath: {
    fontSize: 11,
    color: theme.textMuted,
  },
  deleteLink: {
    color: theme.text,
    fontSize: 12,
    fontWeight: "600",
  },
  deleteDisabled: {
    opacity: 0.4,
  },
  link: {
    color: theme.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  footerNote: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
});