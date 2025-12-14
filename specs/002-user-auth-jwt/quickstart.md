# Quickstart: Login & JWT Feature

## Prerequisites
1. Install dependencies:
   ```bash
   npm install react-native-keychain @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context
   # Pod install for iOS
   cd ios && pod install && cd ..
   ```

## Running the Feature
1. Start Metro Bundler: `npm start`
2. Run on Simulator/Emulator: `npm run android` or `npm run ios`

## Testing the Flow
1. **Initial Load**: App should show Login Screen (if no previous session).
2. **Login**:
   - Use `test@test.com` / `123456` (Mock credentials).
   - Verify transition to Chat Screen.
3. **Persistence**:
   - Kill the app.
   - Relaunch.
   - Verify app opens directly to Chat Screen.
4. **Logout**:
   - Tap "Logout" button.
   - Verify transition back to Login Screen.

## Troubleshooting
- **Keychain Errors**: Ensure you rebuilt the app (`npm run android`/`ios`) after installing `react-native-keychain`.
- **Navigation Errors**: Ensure `react-native-screens` is properly configured in `MainActivity.java` (Android) if required by the version (usually auto-linked now).
