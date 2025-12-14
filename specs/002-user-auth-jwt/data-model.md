# Data Model: Login & JWT

**Feature**: `002-user-auth-jwt`

## Entities

### UserSession
Represents the active session of a logged-in user.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `token` | `string` | JWT Access Token | Non-empty, JWT format |
| `user` | `UserInfo` | Basic user details | Required |
| `expiresAt` | `number` | Timestamp (epoch) of expiration | > Current Time |

### UserInfo
Basic user profile information embedded in the session.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique User ID |
| `email` | `string` | User Email |
| `name` | `string` | Display Name |

### AuthCredentials
Input data for the login process.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `email` | `string` | User Email | Valid email format |
| `password` | `string` | User Password | Min 6 chars (for UI validation) |

## State Transitions

### AuthState
Global state managed by `AuthContext`.

- **IDLE**: Initial state, checking storage for existing token.
- **UNAUTHENTICATED**: No valid token found, show Login.
- **AUTHENTICATED**: Valid token exists, show App (Chat).
