import type { AuthRepository } from '../interfaces/auth.repository';
import type { User, LoginRequest } from '@/types/auth';

export class LocalStorageAuthRepository implements AuthRepository {
  async login(request: LoginRequest): Promise<User> {
    // Repository só persiste - retorna apenas a entidade
    const user: User = {
      email: request.email,
      password: request.password
    };

    await this.saveUser(user);
    return user;
  }

  async logout(): Promise<void> {
    await this.removeUser();
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const userData = window.localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  }

  async removeUser(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem("user");
    }
  }
}