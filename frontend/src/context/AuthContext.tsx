import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthResponse } from "../types";
import * as authService from "../services/authService";

interface AuthContextData {
  usuario: AuthResponse | null;
  login: (login: string, senha: string) => Promise<AuthResponse>;
  registrar: (dados: Record<string, unknown>) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthResponse | null>(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });

  function guardar(dados: AuthResponse) {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuario", JSON.stringify(dados));
    setUsuario(dados);
  }

  async function login(l: string, s: string) {
    const dados = await authService.login(l, s);
    guardar(dados);
    return dados;
  }

  async function registrar(d: Record<string, unknown>) {
    const dados = await authService.registrar(d);
    guardar(dados);
    return dados;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)