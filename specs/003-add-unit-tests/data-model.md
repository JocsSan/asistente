# Data Model & Mocks

## Auth Mocks

### User Object
```typescript
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  token: 'fake-jwt-token'
};
```

### Auth Response
```typescript
const mockAuthResponse = {
  user: mockUser,
  token: 'fake-jwt-token'
};
```

### Auth Error
```typescript
const mockAuthError = {
  message: 'Invalid credentials',
  code: 'AUTH_FAILED'
};
```

## Chat Mocks

### Message Object
```typescript
const mockMessage = {
  id: 'msg-1',
  text: 'Hello AI',
  sender: 'user', // or 'ai'
  timestamp: 1672531200000
};
```

### Chat History
```typescript
const mockChatHistory = [
  { id: 'msg-1', text: 'Hello', sender: 'user', timestamp: 1672531200000 },
  { id: 'msg-2', text: 'Hi there!', sender: 'ai', timestamp: 1672531205000 }
];
```
