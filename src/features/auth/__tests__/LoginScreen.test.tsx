import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuth } from '../hooks/useAuth';

// Mock useAuth
jest.mock('../hooks/useAuth');

describe('LoginScreen', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  // T012: Render test
  it('renderiza correctamente', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  // T013: Interaction test
  it('llama a login con credenciales correctas', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('no llama a login si los campos están vacíos', async () => {
    const { getByText } = render(<LoginScreen />);
    
    fireEvent.press(getByText('Sign In'));

    expect(mockLogin).not.toHaveBeenCalled();
  });

  // T014: Error display test
  it('muestra mensaje de error cuando falla el login', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: { message: 'Invalid credentials' },
    });

    const { getByText } = render(<LoginScreen />);
    
    expect(getByText('Invalid credentials')).toBeTruthy();
  });

  it('muestra indicador de carga cuando está cargando', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    });

    const { queryByText } = render(<LoginScreen />);
    
    expect(queryByText('Sign In')).toBeNull();
  });
});
