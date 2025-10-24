import type { UserRepository } from "../interfaces/user.repository";
import type { RegisterRequest, User } from "@/types/auth";

export class LocalStorageUserRepository implements UserRepository {
  private readonly USERS_KEY = "colmeia_users";

  private getUsers(): User[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }

    try {
      const usersData = window.localStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  async register(request: RegisterRequest): Promise<User> {
    const users = this.getUsers();
    
    // Repository APENAS persiste - não faz validações de negócio
    const newUser: User = {
      id: crypto.randomUUID(),
      name: request.name,
      email: request.email,
      password: request.password, // Em produção, isso seria hash
      createdAt: new Date().toISOString(),
    };

    // Adiciona usuário à lista
    users.push(newUser);
    this.saveUsers(users);

    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.getUsers();
  }

}
