# Feature Specification: Integraci�n de Login y Sesiones JWT

**Feature Branch**: `002-user-auth-jwt`
**Created**: 2025-12-13
**Status**: Draft
**Input**: User description: "integrar pantalla de login y manejo de sesiones con jwt"

## Clarifications

### Session 2025-12-13
- Q: Qué librería de almacenamiento seguro usaremos?  A: `react-native-keychain` (Opción A).
- Q: ¿Qué librería de navegación usaremos? A: `react-navigation` (Opción A).
- Q: ¿Qué estrategia de estado global usaremos? A: `React Context + useState` (Opción A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar Sesi�n (Priority: P1)

Como usuario, quiero poder ingresar mis credenciales para acceder a la aplicaci�n y sus funciones protegidas.

**Why this priority**: Es la puerta de entrada a la aplicaci�n. Sin esto, no hay acceso seguro.

**Independent Test**: Ingresar credenciales v�lidas (ej: "test@test.com" / "123456") y verificar que la pantalla cambia al Chat.

**Acceptance Scenarios**:

1. **Given** el usuario est� en la pantalla de Login, **When** ingresa email y password v�lidos y presiona "Ingresar", **Then** recibe un token, se guarda la sesi�n y navega a la pantalla principal (Chat).
2. **Given** el usuario est� en la pantalla de Login, **When** ingresa credenciales inv�lidas, **Then** ve un mensaje de error claro y permanece en la pantalla de Login.

---

### User Story 2 - Persistencia de Sesi�n (Priority: P1)

Como usuario, quiero que mi sesi�n se mantenga activa si cierro y abro la aplicaci�n, para no tener que loguearme cada vez.

**Why this priority**: Mejora significativamente la experiencia de usuario (UX) evitando fricci�n innecesaria.

**Independent Test**: Loguearse, cerrar la app completamente (kill), volver a abrirla y verificar que entra directo al Chat sin pasar por Login.

**Acceptance Scenarios**:

1. **Given** un usuario con sesi�n activa (token guardado), **When** abre la aplicaci�n, **Then** es redirigido autom�ticamente a la pantalla principal.
2. **Given** un usuario sin sesi�n o con token expirado, **When** abre la aplicaci�n, **Then** es redirigido a la pantalla de Login.

---

### User Story 3 - Cerrar Sesi�n (Priority: P2)

Como usuario, quiero poder cerrar mi sesi�n para proteger mi cuenta cuando no uso la aplicaci�n.

**Why this priority**: Seguridad b�sica y control del usuario sobre su cuenta.

**Independent Test**: Presionar bot�n "Logout" y verificar que lleva al Login y que al reiniciar la app sigue en Login.

**Acceptance Scenarios**:

1. **Given** un usuario logueado, **When** presiona el bot�n de "Cerrar Sesi�n", **Then** el token se elimina del almacenamiento seguro y es redirigido a la pantalla de Login.

### Edge Cases

- **Sin Conexi�n**: Si el usuario intenta loguearse sin internet, debe ver un mensaje de error de red.
- **Token Expirado**: Si el token guardado ha expirado al abrir la app, debe redirigir al Login silenciosamente (o con mensaje "Sesi�n expirada").
- **Servicio Ca�do**: Si el backend retorna error 500, mostrar mensaje "Servicio no disponible, intente m�s tarde".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE presentar una pantalla de Login con campos para Email y Contrase�a.
- **FR-002**: El sistema DEBE validar que el email tenga un formato correcto antes de enviar la solicitud.
- **FR-003**: El sistema DEBE simular un servicio de autenticaci�n (Mock) que retorne un JWT v�lido ante credenciales correctas y error ante incorrectas.
- **FR-004**: El sistema DEBE almacenar el token JWT de forma segura en el dispositivo usando `react-native-keychain`.
- **FR-005**: El sistema DEBE gestionar el estado de autenticaci�n globalmente para controlar el acceso a las rutas protegidas.
- **FR-006**: El sistema DEBE implementar navegaci�n condicional: Flujo de Autenticaci�n (Login) vs Flujo de Aplicaci�n (Chat) basado en el estado de la sesi�n.

### Key Entities *(include if feature involves data)*

- **UserSession**: Objeto que representa la sesi�n actual (token, info b�sica del usuario).
- **AuthCredentials**: Par email/password ingresado por el usuario.

## Success Criteria *(mandatory)*

1. **Login Exitoso**: El usuario puede ingresar y acceder al chat en menos de 2 segundos (simulado).
2. **Persistencia**: Al reiniciar la app, el usuario logueado no ve la pantalla de login.
3. **Seguridad de Token**: El token no se guarda en texto plano en el almacenamiento local est�ndar (se usa `react-native-keychain`).
4. **Logout**: El cierre de sesi�n limpia efectivamente el estado y el almacenamiento.

## Assumptions

- Se utilizar� un servicio Mock para simular el backend y la generaci�n del JWT.
- No se implementar� pantalla de "Registro" ni "Recuperar Contrase�a" en esta iteraci�n (fuera de alcance).
- Se usar� `react-native-keychain` para el almacenamiento seguro.

