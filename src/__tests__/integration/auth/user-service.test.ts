import { describe, it, expect, beforeEach } from "vitest";
import { UserService } from "@/services/user.service";
import { LocalStorageUserRepository } from "@/repositories/implementations/local-storage-user.repository";
import { ApiError, InternalError } from "@/lib/errors";

describe("UserService - Validação de Email Único", () => {
  let userService: UserService;
  let userRepository: LocalStorageUserRepository;

  beforeEach(() => {
    localStorage.clear();
    userRepository = new LocalStorageUserRepository();
    userService = new UserService(userRepository);
  });

  describe("Registro - Validação de Email Único", () => {
    it("deve permitir registro com email único", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      const response = await userService.register(userData);

      expect(response.success).toBe(true);
      expect(response.message).toBe("Usuário registrado com sucesso");
      expect(response.user).toMatchObject({
        email: "joao@test.com",
        password: "123456",
      });
    });

    it("deve rejeitar registro com email duplicado", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      // Primeiro registro deve funcionar
      await userService.register(userData);

      // Segundo registro com mesmo email deve falhar
      await expect(
        userService.register({
          name: "João Santos",
          email: "joao@test.com",
          password: "654321",
        })
      ).rejects.toThrow(ApiError);
    });

    it("deve permitir registro de usuários com emails diferentes", async () => {
      const user1 = await userService.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      const user2 = await userService.register({
        name: "Maria Santos",
        email: "maria@test.com",
        password: "654321",
      });

      expect(user1.success).toBe(true);
      expect(user2.success).toBe(true);
      expect(user1.user?.email).toBe("joao@test.com");
      expect(user2.user?.email).toBe("maria@test.com");
    });
  });

  describe("Validações de Negócio - Pontos Críticos", () => {
    it("deve rejeitar registro com campos obrigatórios vazios", async () => {
      await expect(
        userService.register({
          name: "",
          email: "joao@test.com",
          password: "123456",
        })
      ).rejects.toThrow("Nome, email e senha são obrigatórios");

      await expect(
        userService.register({
          name: "João Silva",
          email: "",
          password: "123456",
        })
      ).rejects.toThrow("Nome, email e senha são obrigatórios");

      await expect(
        userService.register({
          name: "João Silva",
          email: "joao@test.com",
          password: "",
        })
      ).rejects.toThrow("Nome, email e senha são obrigatórios");
    });

    it("deve rejeitar registro com nome muito curto", async () => {
      await expect(
        userService.register({
          name: "J",
          email: "joao@test.com",
          password: "123456",
        })
      ).rejects.toThrow("Nome deve ter pelo menos 2 caracteres");
    });

    it("deve rejeitar registro com email inválido", async () => {
      await expect(
        userService.register({
          name: "João Silva",
          email: "email-invalido",
          password: "123456",
        })
      ).rejects.toThrow("Email inválido");
    });

    it("deve rejeitar registro com senha muito curta", async () => {
      await expect(
        userService.register({
          name: "João Silva",
          email: "joao@test.com",
          password: "123",
        })
      ).rejects.toThrow("Senha deve ter pelo menos 6 caracteres");
    });
  });

  describe("Erros de Servidor - Simulação", () => {
    it("deve simular erro de servidor com email específico", async () => {
      await expect(
        userService.register({
          name: "João Silva",
          email: "server@error.com",
          password: "123456",
        })
      ).rejects.toThrow(InternalError);
    });

    it("deve simular latência de rede", async () => {
      const startTime = Date.now();
      
      await userService.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Deve ter pelo menos 1500ms de latência (conforme implementado)
      expect(duration).toBeGreaterThanOrEqual(1500);
    });
  });

  describe("Persistência - Gargalo Crítico", () => {
    it("deve persistir dados entre instâncias do serviço", async () => {
      // Registra com primeira instância
      await userService.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      // Cria nova instância (simula reload da página)
      const newUserRepository = new LocalStorageUserRepository();
      const newUserService = new UserService(newUserRepository);

      // Verifica se usuário foi persistido
      const foundUser = await newUserRepository.findByEmail("joao@test.com");
      expect(foundUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });

    it("deve lidar com localStorage indisponível", async () => {
      const originalLocalStorage = window.localStorage;
      // @ts-ignore
      delete window.localStorage;

      // Deve funcionar sem erro (fallback silencioso)
      await expect(
        userService.register({
          name: "João Silva",
          email: "joao@test.com",
          password: "123456",
        })
      ).resolves.toBeDefined();

      // Restaura localStorage
      window.localStorage = originalLocalStorage;
    });
  });
});
