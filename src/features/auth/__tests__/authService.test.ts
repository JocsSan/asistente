import { authService } from '../api/authService';
import * as Keychain from 'react-native-keychain';

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicio de sesión exitoso', async () => {
    const result = await authService.login({ email: 'test@test.com', password: '123456' });
    expect(result.token).toBe('mock-jwt-token-123456');
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith('auth_token', 'mock-jwt-token-123456');
  });

  it('fallo en inicio de sesión', async () => {
    await expect(authService.login({ email: 'wrong', password: 'wrong' }))
      .rejects.toThrow('Credenciales inválidas');
  });

  it('cerrar sesión', async () => {
    await authService.logout();
    expect(Keychain.resetGenericPassword).toHaveBeenCalled();
  });

  it('checkSession devuelve usuario si existe token', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({ password: 'token' });
    const result = await authService.checkSession();
    expect(result).not.toBeNull();
    expect(result?.token).toBe('token');
  });

  it('checkSession devuelve null si no hay token', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
    const result = await authService.checkSession();
    expect(result).toBeNull();
  });
});
