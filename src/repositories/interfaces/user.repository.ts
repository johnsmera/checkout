import type { RegisterRequest } from '@/types/auth';

export interface UserRepository {
  register(request: RegisterRequest): Promise<{ email: string; password: string }>;
}