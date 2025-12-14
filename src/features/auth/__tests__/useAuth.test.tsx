import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../api/authService';

// Mock authService
jest.mock('../api/authService', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    checkSession: jest.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería lanzar error si se usa fuera de AuthProvider', () => {
    // Suppress console.error for this test as React logs the error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
    consoleSpy.mockRestore();
  });

  it('debería inicializar con estado de carga y verificar sesión', async () => {
    (authService.checkSession as jest.Mock).mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe('unauthenticated');
    expect(authService.checkSession).toHaveBeenCalled();
  });

  // T010b: Session restoration
  it('debería restaurar sesión si checkSession devuelve usuario', async () => {
    const mockSession = { user: { id: '1', name: 'User' }, token: 'token' };
    (authService.checkSession as jest.Mock).mockResolvedValue(mockSession);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(mockSession.user);
  });

  // T008: Login success
  it('debería iniciar sesión exitosamente', async () => {
    (authService.checkSession as jest.Mock).mockResolvedValue(null);
    const mockResponse = { user: { id: '1', name: 'User' }, token: 'token' };
    (authService.login as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' });
    });

    expect(result.current.status).toBe('authenticated');
    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.error).toBeNull();
  });

  // T009: Login failure
  it('debería manejar fallo de inicio de sesión', async () => {
    (authService.checkSession as jest.Mock).mockResolvedValue(null);
    const mockError = new Error('Invalid credentials');
    (authService.login as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      try {
        await result.current.login({ email: 'test@test.com', password: 'wrong' });
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.error).toEqual(mockError);
  });

  // T010: Logout
  it('debería cerrar sesión exitosamente', async () => {
    const mockSession = { user: { id: '1', name: 'User' }, token: 'token' };
    (authService.checkSession as jest.Mock).mockResolvedValue(mockSession);
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await waitFor(() => expect(result.current.status).toBe('authenticated'));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.status).toBe('unauthenticated');
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});
