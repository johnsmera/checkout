import type { RegisterRequest, User } from "@/types/auth";

export interface UserRepository {
  // Responsabilidade: Gerenciar dados de usuários
  register(request: RegisterRequest): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}
