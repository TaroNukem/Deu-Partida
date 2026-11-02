import { api } from "./api";
import type { Automovel, ContratoCredito, Pedido, StatusPedido } from "../types/types";

export const listarPedidos = async (status?: StatusPedido) =>
  (await api.get<Pedido[]>("/pedidos", { params: status ? { status } : {} })).data;

export const buscarPedido = async (id: number) =>
  (await api.get<Pedido>(`/pedidos/${id}`)).data;

export const criarPedido = async (dados: unknown) =>
  (await api.post<Pedido>("/pedidos", dados)).data;

export const modificarPedido = async (id: number, dados: unknown) =>
  (await api.put<Pedido>(`/pedidos/${id}`, dados)).data;

export const cancelarPedido = async (id: number) =>
  (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data;

export const buscarCredito = async (id: number) => {
  const res = await api.get<ContratoCredito | "">(`/pedidos/${id}/credito`);
  return res.status === 204 || !res.data ? null : res.data;
};

export const listarAutomoveisDisponiveis = async (inicio: string, fim: string) =>
  (
    await api.get<Automovel[]>("/pedidos/disponiveis", {
      params: { inicio, fim },
    })
  ).data;