# Implementation Plan: Integración de Login y Sesiones JWT

**Branch**: `002-user-auth-jwt` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-user-auth-jwt/spec.md`

## Summary

Implement a secure Login flow using JWT. Includes a Login Screen, a Mock Authentication Service, Secure Storage using `react-native-keychain`, and a Global Auth Context to manage session state and drive Conditional Navigation (`react-navigation`) between Auth and App stacks.

## Technical Context

**Language/Version**: TypeScript 5.x (React Native 0.82.1)
**Primary Dependencies**: 
- `react-native-keychain` (Secure Storage)
- `@react-navigation/native`, `@react-navigation/stack` (Navigation)
- `react-native-screens`, `react-native-safe-area-context` (Nav dependencies)
**Storage**: `react-native-keychain` (Device Secure Store)
**Testing**: Jest (Unit), Manual (Flow)
**Target Platform**: iOS & Android
**Project Type**: Mobile (React Native)
**Performance Goals**: Login transition < 200ms, App launch check < 500ms.
**Constraints**: Offline handling (graceful failure), Secure token storage (no plain text).
**Scale/Scope**: Single feature, affects global app entry point.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Feature-Based Architecture**: Code organized in `src/features/auth`.
- [x] **II. Logic vs UI**: Logic in `hooks/useAuth.ts`, `hooks/useLogin.ts`. UI in `components/` and `screens/`.
- [x] **III. Clean Code**: Clear naming, single responsibility.
- [x] **IV. Native Styling**: Using `StyleSheet` and `shared/theme`.
- [x] **V. Git Workflow**: Will follow Conventional Commits.

## Project Structure

### Documentation (this feature)

```text
specs/002-user-auth-jwt/
├── plan.md              # This file
├── research.md          # Technical decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Run instructions
├── contracts/           # API Interfaces
│   └── auth-api.ts
└── tasks.md             # To be generated
```

### Source Code (repository root)

```text
src/
├── features/
│   └── auth/
│       ├── api/
│       │   └── authService.ts       # Mock implementation of IAuthService
│       ├── components/
│       │   ├── LoginForm.tsx        # UI for email/pass inputs
│       │   └── LoginLayout.tsx      # Layout wrapper
│       ├── context/
│       │   └── AuthContext.tsx      # Global Provider & State
│       ├── hooks/
│       │   ├── useAuth.ts           # Consumer hook for Context
│       │   └── useLogin.ts          # Form logic hook
│       └── screens/
│           └── LoginScreen.tsx      # Screen component
├── navigation/
│   ├── AppNavigator.tsx             # Main Navigator (Switch logic)
│   ├── AuthStack.tsx                # Login routes
│   └── MainStack.tsx                # App routes (Chat)
└── shared/
    └── theme/                       # Existing theme
```

**Structure Decision**: Adheres to Feature-Based Architecture. `AuthContext` placed within `features/auth` but exported for global usage in `AppNavigator`. Navigation logic split into Stacks for modularity.

## Complexity Tracking

N/A - No constitution violations.
