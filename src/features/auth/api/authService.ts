import * as Keychain from 'react-native-keychain';
import { AuthResponse, IAuthService, LoginRequest } from './types';

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService implements IAuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay

    if (credentials.email === 'test@test.com' && credentials.password === '123456') {
      const response: AuthResponse = {
        token: 'mock-jwt-token-123456',
        user: {
          id: 'user-1',
          email: 'test@test.com',
          name: 'Test User',
        },
        expiresIn: 3600,
      };

      // Persist token
      await this.saveToken(response.token);
      
      return response;
    }

    throw new Error('Credenciales inválidas');
  }

  async logout(): Promise<void> {
    await delay(500);
    await Keychain.resetGenericPassword();
  }

  async checkSession(): Promise<AuthResponse | null> {
    await delay(500);
    const token = await this.getToken();
    
    if (token) {
      // In a real app, we would validate the token with the backend here
      return {
        token,
        user: {
          id: 'user-1',
          email: 'test@test.com',
          name: 'Test User',
        },
        expiresIn: 3600,
      };
    }
    
    return null;
  }

  private async saveToken(token: string): Promise<void> {
    await Keychain.setGenericPassword('auth_token', token);
  }

  private async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Keychain access failed', error);
      return null;
    }
  }
}

export const authService = new AuthService();
