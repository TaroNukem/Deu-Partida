import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import type { Perfil } from "../types";

export default function PrivateRoute({
  children,
  perfil,
}: {
  children: ReactNode;
  perfil?: Perfil;
}) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (perfil && usuario.perfil !== perfil) return <Navigate to="/" replace />;
  return <>{children}</>;
}
