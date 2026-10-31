import { api } from "./api"
import type { AuthResponse } from "../types"

export async function login(login: string, senha: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", { login, senha });
    return data;
}

export async function registrar(dados: Record<string, unknown>):Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", dados)
    return data
}

