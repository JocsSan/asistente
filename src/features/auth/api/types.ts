export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  expiresIn: number; // seconds
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface IAuthService {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  checkSession(): Promise<AuthResponse | null>;
}
