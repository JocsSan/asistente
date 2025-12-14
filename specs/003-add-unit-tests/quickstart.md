# Quickstart: Running Unit Tests

## Prerequisites
- Ensure dependencies are installed: `npm install`

## Running Tests
- **Run all tests**: `npm test`
- **Run specific test file**: `npm test -- LoginScreen`
- **Run with coverage**: `npm test -- --coverage`

## Troubleshooting
- **"Jest encountered an unexpected token"**: Ensure `jest.config.js` has the correct transformIgnorePatterns.
- **"Native module not found"**: Check `jest.setup.js` for missing mocks.
