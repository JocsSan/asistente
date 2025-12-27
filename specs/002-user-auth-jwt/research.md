# Research & Decisions: Login & JWT

**Feature**: `002-user-auth-jwt`
**Date**: 2025-12-13

## Decisions

### 1. Secure Storage
- **Decision**: Use `react-native-keychain`.
- **Rationale**: Standard library for secure storage in React Native (Keychain on iOS, Keystore on Android). Prevents storing sensitive tokens in plain text (AsyncStorage).
- **Alternatives**: `expo-secure-store` (not using Expo), `react-native-encrypted-storage`.

### 2. Navigation
- **Decision**: Use `react-navigation` (Stack Navigator).
- **Rationale**: Industry standard, robust, and flexible for handling conditional navigation (Auth vs App flows).
- **Alternatives**: `react-native-navigation` (Wix), `expo-router`.

### 3. State Management
- **Decision**: React Context + `useState`.
- **Rationale**: Sufficient for the current scope (Auth state is global but simple: user + token). Avoids overhead of Redux or boilerplate of external libraries for this specific feature.
- **Alternatives**: `Zustand`, `Redux`, `@tanstack/react-query`.

## Unknowns Resolved
- All technical choices (Storage, Navigation, State) were clarified during the specification phase.
