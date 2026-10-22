// objeto de requisicao/request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: string;
  new_password: string;
}

// objeto de resposta/response
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface MessageResponse {
  message: string;
}
export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: string[];
  path: string;
  timestamp: string;
}
