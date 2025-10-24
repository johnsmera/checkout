import type { User, LoginRequest } from "@/types/auth";

export interface AuthRepository {
  login(request: LoginRequest): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  saveUser(user: User): Promise<void>;
  removeUser(): Promise<void>;
}
