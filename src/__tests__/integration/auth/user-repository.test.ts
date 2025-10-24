import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageUserRepository } from "@/repositories/implementations/local-storage-user.repository";

describe("LocalStorageUserRepository - Pontos Críticos", () => {
  let repository: LocalStorageUserRepository;

  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    repository = new LocalStorageUserRepository();
  });

  describe("Registro de Usuário - Persistência", () => {
    it("deve registrar usuário com sucesso", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      const user = await repository.register(userData);

      expect(user).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
    });

    it("deve permitir registro de múltiplos usuários", async () => {
      const user1 = await repository.register({
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      });

      const user2 = await repository.register({
        name: "Maria Santos",
        email: "maria@test.com",
        password: "654321",
      });

      expect(user1.email).toBe("joao@test.com");
      expect(user2.email).toBe("maria@test.com");
      expect(user1.id).not.toBe(user2.id);
    });

    it("deve permitir registro com email duplicado (validação é responsabilidade do Service)", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      // Primeiro registro
      const user1 = await repository.register(userData);

      // Segundo registro com mesmo email (Repository não valida)
      const user2 = await repository.register({
        name: "João Santos",
        email: "joao@test.com",
        password: "654321",
      });

      expect(user1.email).toBe("joao@test.com");
      expect(user2.email).toBe("joao@test.com");
      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe("Busca de Usuário - Pontos Críticos", () => {
    it("deve encontrar usuário por email", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      await repository.register(userData);
      const foundUser = await repository.findByEmail("joao@test.com");

      expect(foundUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });

    it("deve retornar null para email não encontrado", async () => {
      const foundUser = await repository.findByEmail("naoexiste@test.com");
      expect(foundUser).toBeNull();
    });

    it("deve encontrar usuário por ID", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      const user = await repository.register(userData);
      const foundUser = await repository.findById(user.id);

      expect(foundUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });
  });


  describe("Persistência - Gargalo Crítico", () => {
    it("deve persistir dados entre instâncias do repositório", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      // Registra com primeira instância
      await repository.register(userData);

      // Cria nova instância (simula reload da página)
      const newRepository = new LocalStorageUserRepository();
      const foundUser = await newRepository.findByEmail("joao@test.com");

      expect(foundUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });

    it("deve lidar com localStorage indisponível", async () => {
      // Mock localStorage indisponível
      const originalLocalStorage = window.localStorage;
      // @ts-ignore
      delete window.localStorage;

      const userData = {
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
      };

      // Deve funcionar sem erro (fallback silencioso)
      await expect(repository.register(userData)).resolves.toBeDefined();

      // Restaura localStorage
      window.localStorage = originalLocalStorage;
    });
  });
});
