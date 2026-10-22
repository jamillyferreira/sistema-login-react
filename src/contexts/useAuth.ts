// useAuth.ts
import { createContext, useContext } from "react";
import type { AuthResponse, UserResponse } from "../interfaces/auth";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthContextData {
  user: UserResponse | null;
  status: AuthStatus;
  signIn: (responseData: AuthResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

// A memória do token e do usuário
export const AuthContext = createContext<AuthContextData | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
