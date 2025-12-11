# Quickstart: Chat Assistant

## Prerequisites
1. **Node.js** & **Yarn** installed.
2. **CocoaPods** (for iOS).
3. **Android Studio** / **Xcode** setup.

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Install Pods (iOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

3. Download Whisper Model:
   - The app is configured to download `ggml-small-q5_1.bin` automatically on first use, or you can place it manually in the assets folder if configured.
   - Ensure you have ~200MB free space on the device/emulator.

## Running the Feature

1. Start Metro Bundler:
   ```bash
   yarn start
   ```

2. Run on Android:
   ```bash
   yarn android
   ```

3. Run on iOS:
   ```bash
   yarn ios
   ```

## Usage
1. Navigate to the "Chat" tab/screen.
2. **Text**: Type in the input box and press the send icon.
3. **Voice**: Hold the microphone button to record. Release to transcribe and send.
   - *Note*: First time usage will trigger model download (may take a minute).

## Troubleshooting
- **Permission Denied**: Ensure Microphone permissions are granted in Settings.
- **Model Load Error**: Check internet connection for initial model download.
