// AuthContext.tsx

import { type ReactNode, useEffect, useState, useRef } from "react";
import type { AuthResponse, UserResponse } from "../interfaces/auth";
import { setUnauthorized, tokenStore } from "../service/api";
import { AuthContext, type AuthStatus } from "./useAuth";
import getMe from "../service/userService";
import { logout } from "../service/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const didBootstrap = useRef(false);

  useEffect(() => {
    // Sessão expirada
    setUnauthorized(() => {
      setUser(null);
      setStatus("unauthenticated");
    });

    if (didBootstrap.current) return;
    didBootstrap.current = true;

    // Ao abrir o app: tenta recuperar a sessão pelo usuário logado
    async function recoverSession() {
      try {
        const userData = await getMe();
        setUser(userData);
        setStatus("authenticated"); // Conseguiu buscar, está logado
      } catch {
        setUser(null);
        setStatus("unauthenticated"); // Deu erro, não está logado
      }
    }

    recoverSession();
  }, []);

  // Entrar
  const signIn = async (responseData: AuthResponse) => {
    tokenStore.set(responseData.access_token); // salva o access token na memoria

    try {
      const userData = await getMe();
      setUser(userData);
      setStatus("authenticated");
    } catch (error) {
      setStatus("unauthenticated");
      tokenStore.clear();
      throw error;
    }
  };

  // Sair
  const signOut = async () => {
    try {
      await logout();
    } finally {
      tokenStore.clear();
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
