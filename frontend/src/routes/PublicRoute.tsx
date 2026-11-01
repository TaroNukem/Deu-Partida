import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();

  if (usuario) {
    const destino = usuario.perfil === "CLIENTE" ? "/pedidos" : "/agente/pedidos";
    return <Navigate to={destino} replace />;
  }

  return <>{children}</>;
}