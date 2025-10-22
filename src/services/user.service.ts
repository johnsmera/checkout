"use client";

import type { UserRepository } from '@/repositories/interfaces/user.repository';
import type { RegisterRequest, RegisterResponse } from '@/types/auth';
import { ApiError, InternalError } from '@/lib/errors';
import { isEmailValid } from '@/utils/email';

export class UserService {
  constructor(private repository: UserRepository) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    // Validações - responsabilidade do Service
    if (!request.name || !request.email || !request.password) {
      throw new ApiError('Nome, email e senha são obrigatórios');
    }

    if (request.name.trim().length < 2) {
      throw new ApiError('Nome deve ter pelo menos 2 caracteres');
    }

    if (!isEmailValid(request.email)) {
      throw new ApiError('Email inválido');
    }

    if (request.password.length < 6) {
      throw new ApiError('Senha deve ter pelo menos 6 caracteres');
    }

    // Simula latência de rede (lógica de negócio)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simula erro da API (regra de negócio para demonstração)
    if (request.email === 'error@test.com') {
      throw new ApiError('Email já está em uso');
    }

    // Simula erro de servidor (regra de negócio para demonstração)
    if (request.email === 'server@error.com') {
      throw new InternalError('Erro interno do servidor. Tente novamente.');
    }

    // Delega apenas a persistência para o repository
    const user = await this.repository.register(request);

    // Service cria a resposta formatada
    return {
      success: true,
      message: "Usuário registrado com sucesso",
      user
    };
  }
}

// Factory function para criar instância com repositório
export function createUserService(repository: UserRepository): UserService {
  return new UserService(repository);
}