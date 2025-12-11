# Tareas: Asistente de Chat

**Feature**: `001-chat-assistant`
**Estado**: Pendiente
**Total de Tareas**: 24

## Fase 1: Configuración (Inicialización del Proyecto)

Objetivo: Instalar dependencias y configurar permisos nativos para Audio y TTS.

- [ ] T001 Instalar dependencias (whisper.rn, react-native-tts, fs, permissions) en `package.json`
- [ ] T002 Configurar permisos de iOS (Micrófono, Reconocimiento de Voz) en `ios/asistente/Info.plist`
- [ ] T003 Configurar permisos de Android (Grabar Audio) en `android/app/src/main/AndroidManifest.xml`
- [ ] T004 Configurar script de descarga del modelo Whisper en `scripts/download-whisper-model.js`
- [ ] T005 Ejecutar pod install para iOS en `ios/`

## Fase 2: Fundamentos (Prerrequisitos Bloqueantes)

Objetivo: Establecer la estructura del feature y los tipos compartidos.

- [ ] T006 Crear estructura de directorios del feature en `src/features/chat/`
- [ ] T007 Definir tipos Message y ChatState en `src/features/chat/types.ts`
- [ ] T008 Crear componente básico ChatLayout en `src/features/chat/components/ChatLayout.tsx`
- [ ] T009 Crear shell inicial de ChatScreen en `src/features/chat/screens/ChatScreen.tsx`

## Fase 3: Historia de Usuario 1 - Interacción por Texto (Prioridad: P1)

Objetivo: Habilitar el envío y recepción de mensajes de texto.
**Prueba Independiente**: Enviar "Hola", verificar que aparece en la lista y recibe una respuesta simulada.

- [ ] T010 [P] [US1] Crear componente MessageBubble en `src/features/chat/components/MessageBubble.tsx`
- [ ] T011 [P] [US1] Crear componente MessageList en `src/features/chat/components/MessageList.tsx`
- [ ] T012 [P] [US1] Crear componente InputToolbar (Solo texto) en `src/features/chat/components/InputToolbar.tsx`
- [ ] T013 [US1] Implementar chatService simulado (mock) en `src/features/chat/api/chatService.ts`
- [ ] T014 [US1] Implementar hook useChatSession (manejo de estado) en `src/features/chat/hooks/useChatSession.ts`
- [ ] T015 [US1] Integrar flujo de texto en `src/features/chat/screens/ChatScreen.tsx`

## Fase 4: Historia de Usuario 2 - Entrada de Voz (Prioridad: P2)

Objetivo: Habilitar grabación de voz y transcripción local.
**Prueba Independiente**: Grabar audio, verificar que se convierte a texto y se envía.

- [ ] T016 [P] [US2] Implementar hook useAudioRecorder en `src/features/chat/hooks/useAudioRecorder.ts`
- [ ] T017 [P] [US2] Implementar hook useWhisperTranscriber en `src/features/chat/hooks/useWhisperTranscriber.ts`
- [ ] T018 [US2] Crear componente AudioRecorderButton en `src/features/chat/components/AudioRecorderButton.tsx`
- [ ] T019 [US2] Actualizar InputToolbar para incluir RecorderButton en `src/features/chat/components/InputToolbar.tsx`
- [ ] T020 [US2] Integrar flujo de transcripción en `src/features/chat/screens/ChatScreen.tsx`

## Fase 5: Historia de Usuario 3 - Salida de Voz (Prioridad: P2)

Objetivo: Habilitar TTS para las respuestas del asistente.
**Prueba Independiente**: Recibir mensaje, verificar que reproduce audio si está habilitado.

- [ ] T021 [P] [US3] Implementar hook useTextToSpeech en `src/features/chat/hooks/useTextToSpeech.ts`
- [ ] T022 [US3] Actualizar MessageBubble con controles de Play/Stop en `src/features/chat/components/MessageBubble.tsx`
- [ ] T023 [US3] Integrar lógica de auto-reproducción en `src/features/chat/hooks/useChatSession.ts`

## Fase 6: Pulido y Transversales

Objetivo: Refinar UI y manejar errores.

- [ ] T024 Agregar manejo de errores y estados de carga en `src/features/chat/screens/ChatScreen.tsx`

## Dependencias

1. **US1 (Texto)**: Depende de Fase 1 y 2.
2. **US2 (Entrada de Voz)**: Depende de US1 (usa la misma lista de mensajes/lógica de sesión).
3. **US3 (Salida de Voz)**: Depende de US1 (necesita mensajes para leer).

## Ejemplos de Ejecución Paralela

- **UI vs Lógica**: Un desarrollador puede construir `MessageBubble.tsx` (T010) mientras otro construye `useChatSession.ts` (T014).
- **Entrada vs Salida**: `useAudioRecorder.ts` (T016) y `useTextToSpeech.ts` (T021) son independientes y pueden construirse en paralelo.

## Estrategia de Implementación

1. **MVP (US1)**: Enfocarse estrictamente en el chat de texto primero. Esto prueba que la UI y el manejo de estado funcionan.
2. **Entrada de Voz (US2)**: Agregar los "oídos". Este es el levantamiento técnico más pesado debido a la carga del modelo Whisper.
3. **Salida de Voz (US3)**: Agregar la "boca". Esto es relativamente simple usando `react-native-tts`.
