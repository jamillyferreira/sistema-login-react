# Sistema de Login — Frontend

Interface web do [Sistema de Login](https://github.com/jamillyferreira/sistema-login), construída com **React 19**, **TypeScript** e **Vite**.

Consome a API de autenticação via **access token em memória** + **refresh token em cookie HttpOnly**, com renovação automática de sessão e proteção contra condições de corrida.

## Funcionalidades

- Cadastro de usuário com **login automático** após o registro
- Login com access token em memória (nunca em `localStorage` / `sessionStorage`)
- **Renovação automática de sessão** via refresh token em cookie HttpOnly
- **Fila de refresh** para evitar múltiplas chamadas simultâneas (race condition)
- Rotas protegidas com estado de carregamento (sem "flash" para o login)
- Logout que revoga o token no backend e limpa o estado local
- Recuperação de senha por código enviado por e-mail
- Validação de formulários com **Zod** (mensagens em português)
- Feedback de erro padronizado (validação + erros da API)

## Tecnologias

| Área             | Tecnologia                                  |
|------------------|---------------------------------------------|
| Linguagem        | TypeScript                                  |
| Framework        | React 19                                    |
| Build            | Vite                                        |
| Roteamento       | React Router                                |
| HTTP             | Axios (com interceptors)                    |
| Validação        | Zod                                         |
| Estilização      | Tailwind CSS                                |
| Ícones           | Phosphor Icons                              |

## Como executar

### Pré-requisitos

- Node.js 20+ (recomendado: 22 LTS)
- npm ou pnpm
- O [backend](https://github.com/jamillyferreira/sistema-login) rodando em `http://localhost:8080`

### Passo a passo

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/jamillyferreira/sistema-login-react.git
   cd sistema-login-react
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

   O conteúdo padrão é:

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. Suba o backend (em outro terminal):

   ```bash
   cd ../sistema-login
   docker compose up -d
   ```

5. Suba o frontend em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   A aplicação estará em `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

O build final fica em `dist/`.

## Variáveis de ambiente

| Variável       | Descrição                                    | Exemplo                       |
|----------------|----------------------------------------------|-------------------------------|
| `VITE_API_URL` | URL base da API de autenticação (com `/api`) | `http://localhost:8080/api`   |

O arquivo `.env` está no `.gitignore` e não é versionado. Use o `.env.example` como referência.

## Fluxo de autenticação

O frontend foi desenhado para nunca guardar o refresh token em local acessível a JavaScript. O ciclo é:

1. **Login/Registro** → a API devolve `access_token` no corpo e seta `refresh_token` em **cookie HttpOnly**.
2. **Requisições autenticadas** → o Axios anexa `Authorization: Bearer <access_token>` a partir do `tokenStore` (memória).
3. **Sessão expirada** → quando o backend responde `401`, o interceptor do Axios:
   - Pausa as requisições que chegarem nesse meio tempo em uma **fila**;
   - Faz **uma única** chamada a `POST /auth/refresh` usando o cookie;
   - Reexecuta as requisições pendentes com o novo token;
   - Se o refresh falhar com `401/403`, chama `onUnauthorized()` e o usuário é redirecionado ao login.
4. **F5 (reload)** → o access token em memória é perdido, mas o cookie permanece. O `AuthContext` dispara um `GET /users/me`; se ele receber `401`, o interceptor renova via cookie e a sessão continua.

### Por que a fila de refresh importa

Sem a fila, um F5 dispararia duas chamadas simultâneas a `/users/me` (por causa do `StrictMode` em dev) e, por consequência, dois refreshes concorrentes. Como o backend **rotaciona** o refresh token a cada uso, o segundo refresh falharia (token já revogado) e o usuário seria deslogado indevidamente.

A fila garante que apenas **uma** requisição de refresh aconteça por vez; as demais aguardam o resultado e são reprocessadas com o novo token.

## Decisões de segurança

- **Access token apenas em memória** (variável de módulo em `tokenStore`). Um ataque XSS não consegue lê-lo de `localStorage`.
- **Refresh token em cookie HttpOnly** — não acessível a JavaScript, mitigando roubo por XSS.
- **Fila de refresh** para evitar race conditions e logouts falsos.
- **`ProtectedRoute` com estado `loading`** para não redirecionar antes do `GET /users/me` terminar.
- **Separação Context → Service → API**: os componentes não conhecem Axios; os services não conhecem React.
- **Tratamento diferenciado de 401 vs erro de rede**: um backend temporariamente offline não desloga o usuário, só um `401/403` do refresh faz isso.

## Endpoints consumidos

| Método | Rota                        | Serviço                     |
|--------|-----------------------------|-----------------------------|
| `POST` | `/auth/register`            | `authService.register`      |
| `POST` | `/auth/login`               | `authService.login`         |
| `POST` | `/auth/refresh`             | interceptor do `api.ts`     |
| `POST` | `/auth/logout`              | `authService.logout`        |
| `POST` | `/auth/forgot-password`     | `authService.forgotPassword`|
| `POST` | `/auth/reset-password`      | `authService.resetPassword` |
| `GET`  | `/users/me`                 | `userService.getMe`         |

A documentação interativa da API fica em `http://localhost:8080/scalar` com o backend rodando.

## Próximos passos

- Login com Google (OAuth2)
- Deploy do frontend (Vercel) + backend (Railway/Render)

## Backend

Este frontend depende da API de autenticação em [sistema-login](https://github.com/jamillyferreira/sistema-login).

## Autora

Jamilly Ferreira | [LinkedIn](https://www.linkedin.com/in/jamillyferreira/)