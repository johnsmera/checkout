"use client";

import type { AuthRepository } from "@/repositories/interfaces/auth.repository";
import type { User, LoginRequest, AuthResponse } from "@/types/auth";
import { ApiError } from "@/lib/errors";

export class AuthService {
  constructor(private repository: AuthRepository) {}

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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simula erro da API (regra de negócio para demonstração)
    if (credentials.email === "error@test.com") {
      throw new ApiError("Credenciais inválidas");
    }

    // Delega apenas a persistência para o repository
    const user = await this.repository.login(credentials);

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
    await this.repository.logout();

    // Service cria a resposta formatada
    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  }

  async getCurrentUser(): Promise<User | null> {
    return this.repository.getCurrentUser();
  }
}

// Factory function para criar instância com repositório
export function createAuthService(repository: AuthRepository): AuthService {
  return new AuthService(repository);
}
