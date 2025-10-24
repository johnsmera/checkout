import type { User } from "@/types/auth";

export interface AuthRepository {
  // Responsabilidade: Gerenciar sessão do usuário atual
  getCurrentUser(): Promise<User | null>;
  saveCurrentUser(user: User): Promise<void>;
  clearCurrentUser(): Promise<void>;
}
