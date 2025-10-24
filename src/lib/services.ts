// Centralizando instâncias dos serviços com inversão de dependência

import { createAuthService } from "@/services/auth.service";
import { createUserService } from "@/services/user.service";
import { LocalStorageUserRepository } from "@/repositories/implementations/local-storage-user.repository";
import { LocalStorageAuthRepository } from "@/repositories/implementations/local-storage-auth.repository";

// Criando repositórios
const userRepository = new LocalStorageUserRepository();
const authRepository = new LocalStorageAuthRepository();

// Criando instâncias dos serviços
export const authService = createAuthService(userRepository, authRepository);
export const userService = createUserService(userRepository);
