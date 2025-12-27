# Data Model: Chat Assistant

## Entities

### Message
Representa un mensaje individual en la conversación.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | `string` | UUID único del mensaje | Required |
| `text` | `string` | Contenido del mensaje | Required, Max 1000 chars |
| `sender` | `enum` | 'user' \| 'bot' | Required |
| `timestamp` | `number` | Unix timestamp de creación | Required |
| `status` | `enum` | 'pending' \| 'sent' \| 'error' | Default: 'pending' |
| `audioPath` | `string?` | Ruta local al archivo de audio (si aplica) | Optional |

### ChatState
Estado global de la sesión de chat (manejado por `useChatSession`).

| Field | Type | Description |
|-------|------|-------------|
| `messages` | `Message[]` | Lista de mensajes en la sesión actual |
| `isTyping` | `boolean` | Indicador de si el bot está "escribiendo" o procesando |
| `isRecording` | `boolean` | Indicador de si el usuario está grabando audio |
| `isTranscribing` | `boolean` | Indicador de si Whisper está procesando audio |
| `autoPlayEnabled` | `boolean` | Preferencia: ¿Leer respuestas automáticamente? (Persistido) |

## State Transitions

### Sending a Text Message
1. User types text -> `InputToolbar`
2. User presses Send -> `useChatSession.sendMessage(text)`
3. State update: Add `Message` (sender='user', status='pending')
4. API Call: `chatService.sendMessage(text)`
5. State update: Update `Message` (status='sent')
6. State update: `isTyping = true`
7. API Response: Receive bot text
8. State update: Add `Message` (sender='bot')
9. State update: `isTyping = false`
10. TTS: `useTextToSpeech.speak(botText)`

### Sending a Voice Message
1. User holds Record -> `useAudioRecorder.startRecording()`
2. State update: `isRecording = true`
3. User releases Record -> `useAudioRecorder.stopRecording()` -> returns `audioPath`
4. State update: `isRecording = false`
5. State update: `isTranscribing = true`
6. Whisper: `useWhisperTranscriber.transcribe(audioPath)` -> returns `text`
7. State update: `isTranscribing = false`
8. Proceed to "Sending a Text Message" step 3 (using transcribed text)
