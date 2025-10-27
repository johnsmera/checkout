# 🍯 Colmeia Checkout

Demo: https://checkout-ex.vercel.app/

Sistema de checkout e-commerce desenvolvido com Next.js 15, React 19 e TypeScript, seguindo princípios enterprise de arquitetura limpa e padrões de desenvolvimento.

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Git

### Instalação e Execução

1. **Clone o repositório**
```bash
git clone https://github.com/johnsmera/checkout
cd colmeia
```

2. **Instale as dependências**
```bash
# Usando npm
npm install

# Usando yarn
yarn install

# Usando pnpm
pnpm install

# Usando bun
bun install
```

3. **Execute o projeto em desenvolvimento**
```bash
# Usando npm
npm run dev

# Usando yarn
yarn dev

# Usando pnpm
pnpm dev

# Usando bun
bun dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting com Biome
npm run lint

# Formatação de código
npm run format

# Executar testes
npm run test

# Executar testes de acessibilidade
npm run test:a11y

# Interface de testes
npm run test:ui
```

## 🏗️ Arquitetura do Projeto

### Princípios Seguidos

- **SRP (Single Responsibility Principle)**: Cada classe/função tem uma única responsabilidade
- **YAGNI (You Aren't Gonna Need It)**: Não implementamos funcionalidades desnecessárias
- **KISS (Keep It Simple, Stupid)**: Soluções simples e diretas
- **Composite Pattern**: Para componentes de UI reutilizáveis
- **Inversão de Dependência**: Services dependem de abstrações, não implementações

### Estrutura de Pastas

```
src/
├── app/                    # App Router do Next.js
│   ├── (protected)/       # Rotas protegidas
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── checkout/          # Componentes específicos do checkout
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── ...
├── contexts/             # Contextos React (Cart, Order, Auth)
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── repositories/        # Camada de persistência
│   ├── implementations/ # Implementações concretas
│   └── interfaces/      # Contratos/abstrações
├── services/            # Lógica de negócio
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
```

## 🔐 Sistema de Autenticação e Armazenamento

### Como Funciona

O sistema de autenticação utiliza uma arquitetura em camadas:

1. **Repository Layer**: Persistência de dados
2. **Service Layer**: Lógica de negócio e validações
3. **Hook Layer**: Interface com componentes React

### Armazenamento de Usuários

```typescript
// LocalStorage para persistência local
class LocalStorageUserRepository implements UserRepository {
  private readonly USERS_KEY = "colmeia_users";
  
  async register(request: RegisterRequest): Promise<User> {
    // Persiste usuário no localStorage
  }
  
  async findByEmail(email: string): Promise<User | null> {
    // Busca usuário por email
  }
}
```

### Armazenamento de Sessão

```typescript
// Sessão atual do usuário
class LocalStorageAuthRepository implements AuthRepository {
  private readonly CURRENT_USER_KEY = "colmeia_current_user";
  
  async saveCurrentUser(user: User): Promise<void> {
    // Salva usuário logado na sessão
  }
  
  async getCurrentUser(): Promise<User | null> {
    // Recupera usuário da sessão
  }
}
```

### Fluxo de Autenticação

1. **Registro**: Validação → Persistência → Resposta
2. **Login**: Validação → Verificação → Sessão → Resposta
3. **Logout**: Limpeza da sessão → Redirecionamento

### Validações Implementadas

- Email válido (formato e unicidade)
- Senha mínima de 6 caracteres
- Nome mínimo de 2 caracteres
- Simulação de latência de rede (1-1.5s)

## 🛒 Sistema de Carrinho e Armazenamento

### Arquitetura do Carrinho

O carrinho utiliza um repositório em memória com Context API para gerenciamento de estado:

```typescript
interface CartContextType {
  cart: Cart;
  loading: boolean;
  error: string | null;
  addItem: (request: AddToCartRequest) => Promise<void>;
  updateItem: (request: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}
```

### Estrutura de Dados

```typescript
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  total: number;
}
```

### Operações Disponíveis

- **Adicionar Item**: Incrementa quantidade se existir, senão cria novo item
- **Atualizar Quantidade**: Modifica quantidade de item específico
- **Remover Item**: Remove item completamente do carrinho
- **Limpar Carrinho**: Remove todos os itens
- **Calcular Total**: Soma automática dos preços × quantidades

### Persistência

- **Tipo**: Em memória e Local Storage
- **Duração**: Durante a sessão do usuário
- **Sincronização**: Automática via Context API
- **Limpeza**: Automática após checkout bem-sucedido

## 💳 Processo de Checkout

### Fluxo Completo

O checkout segue um processo estruturado em etapas:

1. **Dados do Comprador** (`BuyerDataStep`)
2. **Método de Pagamento** (`PaymentMethodStep`)
3. **Revisão do Pedido** (`OrderReview`)
4. **Processamento** (`OrderProcessing`)
5. **Resultado** (`OrderSuccess`/`OrderFailed`)

### Componentes Principais

```typescript
// Stepper de navegação
<CheckoutStepper currentStep={currentStep} />

// Etapas do checkout
<BuyerDataStep />
<PaymentMethodStep />
<OrderReview />
```

### Métodos de Pagamento Suportados

- **PIX**: Pagamento instantâneo
- **Boleto**: Pagamento bancário
- **Cartão de Crédito**: Com validação completa

### Validações de Cartão

```typescript
interface CreditCardData {
  number: string;      // Validação de número
  expiry: string;      // Formato MM/YY
  cvv: string;         // 3-4 dígitos
  name: string;       // Nome do portador
}
```

### Processamento de Pedidos

```typescript
// Service responsável pelo processamento
class OrderService {
  async createOrder(request: CreateOrderRequest, userId: string): Promise<Order> {
    // Validações → Criação → Persistência
  }
  
  async processPayment(orderId: string): Promise<Order> {
    // Simulação de processamento (2s)
    // 20% chance de falha para demonstração
  }
}
```

## 🎭 Sistemas de Simulação e Tratamento de Erros

### Simulações Implementadas

#### 1. Latência de Rede
```typescript
// Simula tempo de resposta de API
await new Promise((resolve) => setTimeout(resolve, 1000));
```

#### 2. Falhas de Pagamento
```typescript
// 20% de chance de falha no processamento
const shouldFail = Math.random() < 0.2;
if (shouldFail) {
  return await this.orderRepository.updateOrderStatus(orderId, "failed");
}
```

#### 3. Erro de Servidor
```typescript
// Email específico para simular erro interno
if (request.email === "server@error.com") {
  throw new InternalError("Erro interno do servidor. Tente novamente.");
}
```

### Sistema de Erros

#### Tipos de Erro
```typescript
// Erro de API/validação
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Erro interno do sistema
export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}
```

#### Tratamento Global
```typescript
// ErrorBoundary para capturar erros React
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <h2>Oops! Algo deu errado</h2>
      <p>Ocorreu um erro inesperado. Tente novamente ou volte ao início.</p>
      {/* Botões de ação */}
    </div>
  );
}
```

#### Extração Segura de Erros
```typescript
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Ocorreu um erro inesperado";
}
```

### Estados de Pedido

- **pending**: Aguardando processamento
- **processing**: Em processamento
- **paid**: Pagamento aprovado
- **failed**: Pagamento rejeitado
- **expired**: Pedido expirado

## 🧪 Estratégia de Testes

### Estrutura de Testes

```
src/__tests__/
├── a11y/                    # Testes de acessibilidade
│   ├── CartIcon.test.tsx
│   ├── LoginForm.test.tsx
│   ├── Navbar.test.tsx
│   └── test-utils.tsx
└── integration/             # Testes de integração
    └── auth/
        ├── auth-repository.test.ts
        ├── auth-service.test.ts
        ├── user-repository.test.ts
        └── user-service.test.ts
```

### Ferramentas Utilizadas

- **Vitest**: Framework de testes principal
- **Testing Library**: Utilitários para testes de componentes
- **Jest-Axe**: Testes de acessibilidade
- **JSDOM**: Ambiente de testes

### Tipos de Teste

#### 1. Testes de Acessibilidade (A11y)
```typescript
describe("LoginForm - Acessibilidade", () => {
  it("deve passar nos testes de acessibilidade", async () => {
    const { container } = renderWithA11y(<LoginForm />);
    await testA11y(container);
  });
  
  it("deve ter campos de input com labels apropriados", () => {
    renderWithA11y(<LoginForm />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });
});
```

#### 2. Testes de Integração
```typescript
describe("UserService", () => {
  it("deve registrar usuário com dados válidos", async () => {
    const userService = new UserService(mockRepository);
    const result = await userService.register(validUserData);
    expect(result.success).toBe(true);
  });
});
```

### Configuração de Testes

```typescript
// vitest.config.mts
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-utils/setup.ts"],
    globals: true,
    css: true,
  },
});
```

### Utilitários de Teste

```typescript
// renderWithA11y - Wrapper para testes de acessibilidade
export const renderWithA11y = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: A11yTestWrapper, ...options });

// testA11y - Executa verificações de acessibilidade
export const testA11y = async (container: HTMLElement) => {
  return checkA11y(container, a11yConfig);
};
```

## ♿ Acessibilidade (A11y)

### Implementações de Acessibilidade

#### 1. Testes Automatizados
- **Jest-Axe**: Verificação automática de violações WCAG
- **Configuração WCAG**: 2A, 2AA, 2.1AA
- **Cobertura**: Todos os componentes principais

#### 2. Padrões Seguidos

##### Semântica HTML
```typescript
// Navegação com role correto
<nav role="navigation">
  <button aria-label="Sair">Sair</button>
</nav>

// Formulários com labels apropriados
<label htmlFor="email">E-mail</label>
<input id="email" type="email" required />
```

##### Navegação por Teclado
- Todos os elementos interativos são focáveis
- Tab order lógico
- Atalhos de teclado apropriados

##### Contraste e Visibilidade
- Contraste mínimo WCAG AA
- Estados visuais claros (hover, focus, disabled)
- Indicadores de loading e erro

##### Screen Readers
- Textos alternativos para ícones
- ARIA labels quando necessário
- Estrutura semântica clara

### Componentes Testados

- **CartIcon**: Botão de carrinho com contador
- **LoginForm**: Formulário com validações
- **Navbar**: Navegação principal
- **ProductCard**: Cards de produtos

### Configuração A11y

```typescript
export const a11yConfig = {
  rules: {
    "color-contrast": { enabled: true },
  },
  tags: ["wcag2a", "wcag2aa", "wcag21aa"],
};
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15**: Framework React com App Router
- **React 19**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **shadcn/ui**: Componentes base

### Desenvolvimento
- **Biome**: Linting e formatação
- **Vitest**: Framework de testes
- **Testing Library**: Utilitários de teste
- **Jest-Axe**: Testes de acessibilidade

## 📝 Scripts de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento com Turbopack
npm run build        # Build de produção
npm run start        # Servidor de produção

# Qualidade de Código
npm run lint         # Verificação de código
npm run format       # Formatação automática

# Testes
npm run test         # Executar todos os testes
npm run test:a11y    # Testes de acessibilidade
npm run test:ui      # Interface visual de testes
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 🤝 Contribuição

### Padrões de Commit
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **test**: Testes
- **refactor**: Refatoração
- **style**: Formatação

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ seguindo princípios enterprise e boas práticas de desenvolvimento.**
