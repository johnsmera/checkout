// Centralizando instâncias dos serviços com inversão de dependência

import { createAuthService } from "@/services/auth.service";
import { createUserService } from "@/services/user.service";
import { createOrderService } from "@/services/order.service";
import { LocalStorageUserRepository } from "@/repositories/implementations/local-storage-user.repository";
import { LocalStorageAuthRepository } from "@/repositories/implementations/local-storage-auth.repository";
import { InMemoryCartRepository } from "@/repositories/implementations/in-memory-cart.repository";
import { InMemoryOrderRepository } from "@/repositories/implementations/in-memory-order.repository";

// Criando repositórios
const userRepository = new LocalStorageUserRepository();
const authRepository = new LocalStorageAuthRepository();
const cartRepository = new InMemoryCartRepository();
const orderRepository = new InMemoryOrderRepository();

// Criando instâncias dos serviços
export const authService = createAuthService(userRepository, authRepository);
export const userService = createUserService(userRepository);
export const orderService = createOrderService(orderRepository, cartRepository);

// Exportando repositórios para uso nos providers
export { cartRepository, orderRepository };
