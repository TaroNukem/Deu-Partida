import { api } from "./api";
import type { Cliente } from "../types";

export const buscarMeuCadastro = async () =>
  (await api.get<Cliente>("/clientes/me")).data;
export const atualizarCadastro = async (c: Cliente) =>
  (await api.put<Cliente>("/clientes/me", c)).data;
export const excluirConta = async () => {
  await api.delete("/clientes/me");
};
