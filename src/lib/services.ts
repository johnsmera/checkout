// Centralizando instâncias dos serviços com inversão de dependência

import { createAuthService } from "@/services/auth.service";
import { createUserService } from "@/services/user.service";
import { LocalStorageAuthRepository } from "@/repositories/implementations/local-storage-auth.repository";
import { LocalStorageUserRepository } from "@/repositories/implementations/local-storage-user.repository";

// Criando repositórios
const authRepository = new LocalStorageAuthRepository();
const userRepository = new LocalStorageUserRepository();

// Criando instâncias dos serviços
export const authService = createAuthService(authRepository);
export const userService = createUserService(userRepository);
