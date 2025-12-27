# Tasks: Integraci�n de Login y Sesiones JWT

**Feature Branch**: `002-user-auth-jwt`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Fase 1: Configuraci�n (Setup)
*Objetivo: Inicializar dependencias y estructura del proyecto.*

- [x] T001 Instalar dependencias (`react-native-keychain`, `@react-navigation/native`, `@react-navigation/stack`, `react-native-screens`, `react-native-safe-area-context`) en `package.json`
- [x] T002 [P] Crear estructura de directorios del feature en `src/features/auth` (api, components, context, hooks, screens)

## Fase 2: Fundamentos (Foundational)
*Objetivo: Establecer la arquitectura base para Autenticaci�n y Navegaci�n.*

- [x] T003 [P] Implementar interfaz `IAuthService` y Servicio Mock en `src/features/auth/api/authService.ts`
- [x] T004 [P] Crear `AuthContext` con estado inicial (user, token, status) en `src/features/auth/context/AuthContext.tsx`
- [x] T005 [P] Crear navegador `AuthStack` en `src/navigation/AuthStack.tsx`
- [x] T006 [P] Crear navegador `MainStack` (envolviendo el Chat existente) en `src/navigation/MainStack.tsx`
- [x] T007 Implementar `AppNavigator` para alternar entre Auth y Main stacks basado en el contexto en `src/navigation/AppNavigator.tsx`
- [x] T008 Actualizar `App.tsx` para envolver la aplicación con `AuthProvider` y `NavigationContainer`

## Fase 3: Historia de Usuario 1 - Iniciar Sesi�n (P1)
*Objetivo: Permitir a los usuarios iniciar sesi�n con credenciales.*

- [x] T009 Crear componente `LoginLayout` (Logo, contenedor centrado)
- [x] T010 Crear componente `LoginForm` (Inputs, validación, botón)
- [x] T011 Integrar `LoginLayout` y `LoginForm` en `LoginScreen`
- [x] T012 [US1] Implementar hook `useLogin` para lógica del formulario e interacción con contexto en `src/features/auth/hooks/useLogin.ts`
- [x] T013 Implementar persistencia de token con `react-native-keychain`
- [x] T014 [US1] Actualizar `AuthContext` para implementar método `login` llamando a `authService` en `src/features/auth/context/AuthContext.tsx`
- [x] T015 [US2] Implementar `saveSession` y `checkSession` en `authService` usando `react-native-keychain` en `src/features/auth/api/authService.ts`
- [x] T016 [US2] Actualizar `AuthContext` para verificar sesión existente al montar en `src/features/auth/context/AuthContext.tsx`
- [x] T017 [US2] Actualizar `AppNavigator` para mostrar estado de carga mientras se verifica sesión en `src/navigation/AppNavigator.tsx`
- [x] T018 [US3] Implementar `logout` en `authService` (limpiar Keychain) en `src/features/auth/api/authService.ts`
- [x] T019 [US3] Actualizar `AuthContext` para implementar método `logout` en `src/features/auth/context/AuthContext.tsx`
- [x] T012 Añadir botón de Logout en el header de `MainStack`

## Fase 6: Pulido y Transversales (Polish)
*Objetivo: Refinar UI/UX y manejar casos borde.*

- [x] T021 Agregar visualización de errores en `LoginForm` (texto inline para credenciales inválidas) en `src/features/auth/components/LoginForm.tsx`
- [x] T022 Agregar indicadores de carga (ActivityIndicator) durante Login y Verificación de Sesión en `src/features/auth/screens/LoginScreen.tsx`
- [x] T013 Implementar persistencia de token con `react-native-keychain`
- [x] T014 [US1] Actualizar `AuthContext` para implementar método `login` llamando a `authService` en `src/features/auth/context/AuthContext.tsx`
- [x] T015 [US2] Implementar `saveSession` y `checkSession` en `authService` usando `react-native-keychain` en `src/features/auth/api/authService.ts`
- [x] T016 [US2] Actualizar `AuthContext` para verificar sesión existente al montar en `src/features/auth/context/AuthContext.tsx`
- [x] T017 [US2] Actualizar `AppNavigator` para mostrar estado de carga mientras se verifica sesión en `src/navigation/AppNavigator.tsx`
- [x] T018 [US3] Implementar `logout` en `authService` (limpiar Keychain) en `src/features/auth/api/authService.ts`
- [x] T019 [US3] Actualizar `AuthContext` para implementar método `logout` en `src/features/auth/context/AuthContext.tsx`

## Fase 4: Historia de Usuario 2 - Persistencia de Sesi�n (P1)
*Objetivo: Mantener la sesi�n del usuario entre reinicios de la app.*

- [ ] T015 [US2] Implementar `saveSession` y `checkSession` en `authService` usando `react-native-keychain` en `src/features/auth/api/authService.ts`
- [ ] T016 [US2] Actualizar `AuthContext` para verificar sesi�n existente al montar en `src/features/auth/context/AuthContext.tsx`
- [ ] T017 [US2] Actualizar `AppNavigator` para mostrar estado de carga mientras se verifica sesi�n en `src/navigation/AppNavigator.tsx`

## Fase 5: Historia de Usuario 3 - Cerrar Sesi�n (P2)
*Objetivo: Permitir a los usuarios cerrar sesi�n de forma segura.*

- [ ] T018 [US3] Implementar `logout` en `authService` (limpiar Keychain) en `src/features/auth/api/authService.ts`
- [ ] T019 [US3] Actualizar `AuthContext` para implementar m�todo `logout` en `src/features/auth/context/AuthContext.tsx`
- [x] T012 Añadir botón de Logout en el header de `MainStack`

## Fase 6: Pulido y Transversales (Polish)
*Objetivo: Refinar UI/UX y manejar casos borde.*

- [ ] T021 Agregar visualizaci�n de errores en `LoginForm` (texto inline para credenciales inv�lidas) en `src/features/auth/components/LoginForm.tsx`
- [ ] T022 Agregar indicadores de carga (ActivityIndicator) durante Login y Verificaci�n de Sesi�n en `src/features/auth/screens/LoginScreen.tsx`

## Dependencias
- US1 (Login) depende de Fundamentos (Context, Service).
- US2 (Persistencia) depende de US1 (necesita crear una sesi�n primero para probar persistencia).
- US3 (Logout) depende de US1 (necesita estar logueado).

## Estrategia de Implementaci�n
1. **Setup & Foundation**: Preparar navegaci�n y cableado del contexto.
2. **MVP (US1)**: Lograr que la pantalla de Login funcione con el servicio Mock.
3. **Persistencia (US2)**: Agregar la capa de Keychain.
4. **Logout (US3)**: Completar el ciclo.
