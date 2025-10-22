import type { UserRepository } from '../interfaces/user.repository';
import type { RegisterRequest } from '@/types/auth';

export class LocalStorageUserRepository implements UserRepository {
  async register(request: RegisterRequest): Promise<{ email: string; password: string }> {
    // Repository só persiste - retorna apenas a entidade criada
    const user = {
      email: request.email,
      password: request.password
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem("user", JSON.stringify(user));
    }

    return user;
  }
}