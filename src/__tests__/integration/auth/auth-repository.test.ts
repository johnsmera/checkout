import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageAuthRepository } from "@/repositories/implementations/local-storage-auth.repository";

describe("LocalStorageAuthRepository - Gerenciamento de Sessão", () => {
  let repository: LocalStorageAuthRepository;

  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    repository = new LocalStorageAuthRepository();
  });

  describe("Sessão - Responsabilidade do AuthRepository", () => {
    it("deve salvar usuário atual na sessão", async () => {
      const user = {
        id: "1",
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
        createdAt: new Date().toISOString(),
      };

      await repository.saveCurrentUser(user);

      const currentUser = await repository.getCurrentUser();
      expect(currentUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });

    it("deve limpar sessão atual", async () => {
      const user = {
        id: "1",
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
        createdAt: new Date().toISOString(),
      };

      await repository.saveCurrentUser(user);

      // Verifica se usuário está na sessão
      let currentUser = await repository.getCurrentUser();
      expect(currentUser).not.toBeNull();

      // Limpa sessão
      await repository.clearCurrentUser();

      // Verifica se sessão foi limpa
      currentUser = await repository.getCurrentUser();
      expect(currentUser).toBeNull();
    });

    it("deve manter sessão entre instâncias do repositório", async () => {
      const user = {
        id: "1",
        name: "João Silva",
        email: "joao@test.com",
        password: "123456",
        createdAt: new Date().toISOString(),
      };

      // Salva com primeira instância
      await repository.saveCurrentUser(user);

      // Cria nova instância (simula reload da página)
      const newRepository = new LocalStorageAuthRepository();
      const currentUser = await newRepository.getCurrentUser();

      expect(currentUser).toMatchObject({
        name: "João Silva",
        email: "joao@test.com",
      });
    });
  });

  describe("Tratamento de Erros - Pontos Críticos", () => {
    it("deve lidar com localStorage corrompido", async () => {
      // Simula localStorage corrompido
      localStorage.setItem("colmeia_current_user", "dados-corrompidos");

      // Repository deve retornar null em caso de erro (não lançar exceção)
      const user = await repository.getCurrentUser();

      expect(user).toBeNull();
    });

    it("deve lidar com localStorage indisponível", async () => {
      const originalLocalStorage = window.localStorage;
      // @ts-ignore
      delete window.localStorage;

      // Repository deve retornar null em caso de erro (não lançar exceção)
      const user = await repository.getCurrentUser();

      expect(user).toBeNull();

      // Restaura localStorage
      window.localStorage = originalLocalStorage;
    });
  });
});
