// api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AuthResponse, ErrorResponse } from "../interfaces/auth";

// excecao personalizada
export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // o navegador envia e aceita cookies da API
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//cria access token em memoria, iniciando como null
let accessToken: string | null = null;

export const tokenStore = {
  set(token: string | null): void {
    accessToken = token;
  },

  get(): string | null {
    return accessToken;
  },

  clear(): void {
    accessToken = null;
  },
};

let onUnauthorized: (() => void) | null = null;

export function setUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

// Retorna true se o erro do refresh for de expirou/revogado (401 | 403)
// Erro de rede, backend off, timeout NAO devem deslogar pq cookie continua valido
function isRefreshTokenRejected(error: unknown): boolean {
  const status = (error as AxiosError)?.response?.status;
  return status === 401 || status === 403;
}

// Anexa o access token em toda requisição
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fila de refresh, evita múltiplas chamadas simultâneas

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }; // tenta novamente se houver 401 UMA vez

let isRefreshing: boolean = false; // estado global do refresh

// Fila de requisições que estão esperando o refresh terminar
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((item) => {
    if (error) item.reject(error);
    else item.resolve(token!);
  });
  failedQueue = [];
}

// Converte qualquer error do axios no ApiError
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const isAuthRoute = originalRequest?.url?.startsWith("/auth/");
    const status = error.response?.status;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // refaz a requisicao original
        });
      }

      originalRequest._retry = true; // marca que ja tentou renovar
      isRefreshing = true;

      // Tenta pegar o novo token usando o cookie HttpOnly
      try {
        const refreshResponse =
          await refreshClient.post<AuthResponse>("/auth/refresh");
        const newToken = refreshResponse.data.access_token;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // refaz a original
      } catch (err) {
        processQueue(err, null); // libera a fila com erro
        tokenStore.clear(); // limpa o token
        if (isRefreshTokenRejected(err)) onUnauthorized?.(); // avisa o React para deslogar
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    const body = error.response?.data;
    return Promise.reject(
      new ApiError(
        body?.detail ?? "Erro de conexão",
        error.response?.status ?? 0,
        body?.errors ?? [],
      ),
    );
  },
);
