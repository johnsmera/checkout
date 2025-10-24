"use client";

import type { UserRepository } from "@/repositories/interfaces/user.repository";
import type { AuthRepository } from "@/repositories/interfaces/auth.repository";
import type { User, LoginRequest, AuthResponse } from "@/types/auth";
import { ApiError } from "@/lib/errors";

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository
  ) {}

  async signIn(credentials: LoginRequest): Promise<AuthResponse> {
    // Validações - responsabilidade do Service
    if (!credentials.email || !credentials.password) {
      throw new ApiError("Email e senha são obrigatórios");
    }

    if (!credentials.email.includes("@")) {
      throw new ApiError("Email inválido");
    }

    if (credentials.password.length < 6) {
      throw new ApiError("Senha deve ter pelo menos 6 caracteres");
    }

    // Simula latência de rede (lógica de negócio)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Repository apenas busca dados - não faz validações
    const user = await this.userRepository.findByEmail(credentials.email);

    // Service faz as validações de negócio
    if (!user) {
      throw new ApiError("Email não cadastrado");
    }

    if (user.password !== credentials.password) {
      throw new ApiError("Senha incorreta");
    }

    // Service salva usuário na sessão após validação
    await this.authRepository.saveCurrentUser(user);

    // Service cria a resposta formatada
    return {
      success: true,
      message: "Login realizado com sucesso",
      user,
    };
  }

  async logout(): Promise<AuthResponse> {
    // Simula latência de rede (lógica de negócio)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Delega apenas a persistência para o repository
    await this.authRepository.clearCurrentUser();

    // Service cria a resposta formatada
    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}

// Factory function para criar instância com repositórios
export function createAuthService(
  userRepository: UserRepository,
  authRepository: AuthRepository
): AuthService {
  return new AuthService(userRepository, authRepository);
}
