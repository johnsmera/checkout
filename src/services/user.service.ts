"use client";

import { ApiError, InternalError } from '@/lib/errors';
import { isEmailValid } from '@/utils/email';

export interface UserRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: { email: string; password: string };
}

export class UserService {
  async register({ name, email, password }: UserRegisterInput): Promise<RegisterResponse> {
    // Validação básica
    if (!name || !email || !password) {
      throw new ApiError('Nome, email e senha são obrigatórios');
    }

    if (name.trim().length < 2) {
      throw new ApiError('Nome deve ter pelo menos 2 caracteres');
    }

    if (!isEmailValid(email)) {
      throw new ApiError('Email inválido');
    }

    if (password.length < 6) {
      throw new ApiError('Senha deve ter pelo menos 6 caracteres');
    }

    // Simula latência de rede
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simula erro da API (para demonstração)
    if (email === 'error@test.com') {
      throw new ApiError('Email já está em uso');
    }

    // Simula erro de servidor
    if (email === 'server@error.com') {
      throw new InternalError('Erro interno do servidor. Tente novamente.');
    }

    // Auto-login após registro (igual ao AuthService)
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem("user", JSON.stringify({ email, password }));
    }

    return {
      success: true,
      message: "Usuário registrado com sucesso",
      user: { email, password }
    };
  }
}

export const userSingleton = new UserService();