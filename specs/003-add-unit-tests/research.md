# Research: Unit Testing Implementation

**Feature**: `003-add-unit-tests`
**Date**: 2025-12-14

## Unknowns & Resolutions

### 1. Mocking Native Modules
**Question**: How do we mock native modules like `react-native-keychain`?
**Resolution**: Use a `jest.setup.js` file configured in `jest.config.js` to provide global mocks.
**Details**:
- `react-native-keychain`: Mock `setGenericPassword`, `getGenericPassword`, `resetGenericPassword`.
- `react-navigation`: Use `jest.mock` for `useNavigation` and `useRoute`.
- `react-native-gesture-handler`: Import the library's mock in setup.

### 2. Testing Library
**Question**: Is `@testing-library/react-native` installed?
**Resolution**: No, it is missing from `package.json`.
**Action**: Add task to install `@testing-library/react-native`.

### 3. Jest Configuration
**Question**: Is the current `jest.config.js` sufficient?
**Resolution**: It uses the default preset. We need to extend it to include `setupFilesAfterEnv` for our global mocks.

## Technology Decisions

- **Test Runner**: Jest (Standard for RN)
- **Component Testing**: React Native Testing Library (RNTL) - Standard, lightweight, encourages user-centric testing.
- **Mocking Strategy**: Global mocks in `jest.setup.js` for native dependencies; Local mocks for service logic in unit tests.
