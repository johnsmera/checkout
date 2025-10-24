import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "@/services/auth.service";
import { LocalStorageUserRepository } from "@/repositories/implementations/local-storage-user.repository";
import { LocalStorageAuthRepository } from "@/repositories/implementations/local-storage-auth.repository";
import { ApiError } from "@/lib/errors";

describe("AuthService - Integração Completa", () => {
  let authService: AuthService;
  let userRepository: LocalStorageUserRepository;
  let authRepository: LocalStorageAuthRepository;

  beforeEach(() => {
    localStorage.clear();
    userRepository = new LocalStorageUserRepository();
    authRepository = new LocalStorageAuthRepository();
    authService = new AuthService(userRepository, authRepository);
  });

  describe("Fluxo Completo - Registro + Login", () => {
    it("deve permitir registro e login subsequente", async () => {
      // 1. Registra usuário
      await userRepository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      // 2. Faz login
      const response = await authService.signIn({
        email: "joao@test.com",
        password: "123456",
      });

      expect(response.success).toBe(true);
      expect(response.user).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });

    it("deve rejeitar login com credenciais incorretas", async () => {
      await userRepository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      // Email não cadastrado
      await expect(
        authService.signIn({
          email: "naoexiste@test.com",
          password: "123456",
        })
      ).rejects.toThrow(ApiError);

      // Senha incorreta
      await expect(
        authService.signIn({
          email: "joao@test.com",
          password: "senhaerrada",
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe("Validações de Negócio - Pontos Críticos", () => {
    it("deve rejeitar login com email inválido", async () => {
      await expect(
        authService.signIn({
          email: "email-invalido",
          password: "123456",
        })
      ).rejects.toThrow("Email inválido");
    });

    it("deve rejeitar login com senha muito curta", async () => {
      await expect(
        authService.signIn({
          email: "joao@test.com",
          password: "123",
        })
      ).rejects.toThrow("Senha deve ter pelo menos 6 caracteres");
    });

    it("deve rejeitar login com campos vazios", async () => {
      await expect(
        authService.signIn({
          email: "",
          password: "123456",
        })
      ).rejects.toThrow("Email e senha são obrigatórios");

      await expect(
        authService.signIn({
          email: "joao@test.com",
          password: "",
        })
      ).rejects.toThrow("Email e senha são obrigatórios");
    });

    it("deve rejeitar login com email não cadastrado", async () => {
      await expect(
        authService.signIn({
          email: "naoexiste@test.com",
          password: "123456",
        })
      ).rejects.toThrow("Email não cadastrado");
    });

    it("deve rejeitar login com senha incorreta", async () => {
      await userRepository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      await expect(
        authService.signIn({
          email: "joao@test.com",
          password: "senhaerrada",
        })
      ).rejects.toThrow("Senha incorreta");
    });
  });

  describe("Logout - Funcionalidade Crítica", () => {
    it("deve fazer logout com sucesso", async () => {
      // Setup: usuário logado
      await userRepository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      await authService.signIn({
        email: "joao@test.com",
        password: "123456",
      });

      // Testa logout
      const response = await authService.logout();

      expect(response.success).toBe(true);
      expect(response.message).toBe("Logout realizado com sucesso");
    });

    it("deve limpar sessão após logout", async () => {
      await userRepository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      await authService.signIn({
        email: "joao@test.com",
        password: "123456",
      });

      await authService.logout();

      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe("Persistência - Gargalo Crítico", () => {
    it("deve manter sessão entre instâncias do serviço", async () => {
      await userRepository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      // Login com primeira instância
      await authService.signIn({
        email: "joao@test.com",
        password: "123456",
      });

      // Cria nova instância (simula reload da página)
      const newUserRepository = new LocalStorageUserRepository();
      const newAuthRepository = new LocalStorageAuthRepository();
      const newAuthService = new AuthService(newUserRepository, newAuthRepository);

      const currentUser = await newAuthService.getCurrentUser();
      expect(currentUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });
  });
});
