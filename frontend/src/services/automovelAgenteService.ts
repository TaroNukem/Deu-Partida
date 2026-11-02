import { api } from "./api";
import type { Automovel } from "../types/types";

export const listarMeusAutomoveis = async () =>
  (await api.get<Automovel[]>("/agente/automoveis")).data;

export const cadastrarAutomovel = async (dados: Omit<Automovel, "id">) =>
  (await api.post<Automovel>("/agente/automoveis", dados)).data;