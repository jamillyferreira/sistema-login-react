// authService.ts
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  MessageResponse,
  ResetPasswordRequest,
} from "../interfaces/auth";
import { api } from "./api";

export async function register(request: RegisterRequest) {
  const response = await api.post<AuthResponse>("/auth/register", request);
  return response.data;
}

export async function login(request: LoginRequest) {
  const response = await api.post<AuthResponse>("/auth/login", request);
  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function refresh() {
  const { data } = await api.post<AuthResponse>("/auth/refresh");
  return data;
}

export async function forgotPassword(request: ForgotPasswordRequest) {
  const { data } = await api.post<MessageResponse>(
    "/auth/forgot-password",
    request,
  );
  return data;
}

export async function resetPassword(request: ResetPasswordRequest) {
  const { data } = await api.post<MessageResponse>(
    "/auth/reset-password",
    request,
  );
  return data;
}
