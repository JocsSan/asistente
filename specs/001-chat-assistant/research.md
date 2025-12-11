# Research & Technical Decisions: Asistente de Chat

**Feature**: Chat Assistant (001)
**Status**: Complete

## 1. Technology Stack Decisions

### Speech-to-Text (STT)
- **Decision**: `whisper.rn` with model `small-q5_1`.
- **Rationale**: 
  - Requirement for offline/local transcription to ensure privacy and speed.
  - `small-q5_1` (~181MB) offers the best balance between accuracy (multi-language support) and performance on mobile devices.
  - `whisper.rn` is already integrated into the project.

### Text-to-Speech (TTS)
- **Decision**: `@chuvincent/react-native-tts`.
- **Rationale**:
  - Standard library for native TTS on React Native.
  - Supports Spanish locale (`es-ES`).
  - Already installed in the project.

### Audio Recording & File Management
- **Decision**: `react-native-audio-recorder-player` (or native via `whisper.rn` if supported, but usually requires a separate recorder) + `react-native-fs`.
- **Correction**: The user mentioned `useAudioRecorder` logic. `whisper.rn` has a realtime transcriber, but for the "record then transcribe" flow described (User Story 2), we might need to record to a file first.
- **Refinement**: `whisper.rn` context often handles audio session, but for explicit file control, we will use `react-native-permissions` for mic access and standard recording logic (likely `react-native-audio-recorder-player` or similar if not present, BUT `whisper.rn` might have a recorder helper or we use the one from the `App.tsx` example which seemed to use `whisperContext.transcribeRealtime` for recording or just `transcribe` on a file).
- **Observation from App.tsx**: The user's `App.tsx` uses `whisperContext.transcribeRealtime` with `audioOutputPath` to record. We can reuse this pattern or use a dedicated recorder. The user's plan mentions `useAudioRecorder.ts` managing "logic of recording and file handling". We will stick to the pattern that works with `whisper.rn`.

## 2. Architecture Alignment (Constitution Check)

### Feature-Based Architecture
- **Structure**: `src/features/chat/`
- **Separation**:
  - `api/`: `chatService.ts` (Mock)
  - `components/`: `ChatLayout`, `MessageList`, `MessageBubble`, `InputToolbar`, `AudioRecorderButton`.
  - `hooks/`: `useChatSession`, `useAudioRecorder`, `useWhisperTranscriber`, `useTextToSpeech`.
  - `screens/`: `ChatScreen`.

### Clean Code & Native Styling
- **Styling**: `StyleSheet.create` using `src/shared/theme`.
- **Logic**: Encapsulated in hooks.

## 3. Unknowns & Risks
- **Model Download**: 181MB is significant. Need to handle "downloading" state gracefully in UI.
- **Permissions**: iOS/Android permission handling flow needs to be robust.
