"use client";

import type { UserRepository } from "@/repositories/interfaces/user.repository";
import type { RegisterRequest, RegisterResponse } from "@/types/auth";
import { ApiError, InternalError } from "@/lib/errors";
import { isEmailValid } from "@/utils/email";

export class UserService {
  constructor(private repository: UserRepository) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    if (!request.name || !request.email || !request.password) {
      throw new ApiError("Nome, email e senha são obrigatórios");
    }

    if (request.name.trim().length < 2) {
      throw new ApiError("Nome deve ter pelo menos 2 caracteres");
    }

    if (!isEmailValid(request.email)) {
      throw new ApiError("Email inválido");
    }

    if (request.password.length < 6) {
      throw new ApiError("Senha deve ter pelo menos 6 caracteres");
    }

    // Simula latência de rede
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simula erro de servidor (regra de negócio para demonstração)
    if (request.email === "server@error.com") {
      throw new InternalError("Erro interno do servidor. Tente novamente.");
    }

    // Service faz as validações de negócio
    const existingUser = await this.repository.findByEmail(request.email);
    if (existingUser) {
      throw new ApiError("Email já está em uso");
    }

    // Repository apenas persiste
    const user = await this.repository.register(request);
    return {
      success: true,
      message: "Usuário registrado com sucesso",
      user: {
        email: user.email,
        password: user.password,
      },
    };
  }
}

// Factory function para criar instância com repositório
export function createUserService(repository: UserRepository): UserService {
  return new UserService(repository);
}
