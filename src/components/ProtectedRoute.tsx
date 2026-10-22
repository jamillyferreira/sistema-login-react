import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/useAuth";

export function ProtectedRoute() {
  const { status } = useAuth();
  if (status === "loading") return <div>Carregando...</div>;
  if (status === "unauthenticated") return <Navigate to="/login" replace />;
  return <Outlet />;
}
