import { ApiError, InternalError } from '@/lib/errors';

export interface User {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export class AuthService {
  async signIn({ email, password }: User): Promise<AuthResponse> {
    // Validação básica
    if (!email || !password) {
      throw new InternalError('Email e senha são obrigatórios');
    }

    if (!email.includes('@')) {
      throw new InternalError('Email inválido');
    }

    if (password.length < 6) {
      throw new InternalError('Senha deve ter pelo menos 6 caracteres');
    }

    // Simula latência de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simula erro da API (para demonstração)
    if (email === 'error@test.com') {
      throw new ApiError('Credenciais inválidas');
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem("user", JSON.stringify({ email, password }));
    }

    return {
      success: true,
      message: "Login realizado com sucesso",
      user: { email, password }
    };
  }

  async logout(): Promise<AuthResponse> {
    // Simula latência de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem("user");
    }

    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const userData = window.localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
}

export const authSingleton = new AuthService();
