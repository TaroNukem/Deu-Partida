import { api } from "./api";
import type { Pedido } from "../types";

export const listarPedidosRecebidos = async () =>
  (await api.get<Pedido[]>("/agente/pedidos")).data;

export type Parecer = "POSITIVO" | "NEGATIVO";

export const avaliar = async (
  id: number,
  observacao: string,
  parecer: Parecer,
) =>
  (
    await api.post<Pedido>(`/agente/pedidos/${id}/avaliacao`, {
      observacao,
      parecer,
    })
  ).data;

export const concederCredito = async (
  id: number,
  valor: number,
  taxa: number,
) =>
  (await api.post<Pedido>(`/agente/pedidos/${id}/credito`, { valor, taxa }))
    .data;

export const executarContrato = async (id: number) =>
  (await api.post<Pedido>(`/agente/pedidos/${id}/contrato`)).data;
