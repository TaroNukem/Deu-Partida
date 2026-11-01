import { api } from "./api";
import type { Pedido } from "../types/types";

export const listarRecebidos = async () =>
  (await api.get<Pedido[]>("/agente/pedidos")).data;
export const avaliar = async (
  id: number,
  parecerPositivo: boolean,
  observacao: string,
) =>
  (
    await api.post(`/agente/pedidos/${id}/avaliacao`, {
      parecerPositivo,
      observacao,
    })
  ).data;
export const concederCredito = async (
  id: number,
  valor: number,
  taxaJuros: number,
) =>
  (await api.post(`/agente/pedidos/${id}/credito`, { valor, taxaJuros })).data;
export const executarContrato = async (id: number) =>
  (await api.post(`/agente/pedidos/${id}/contrato`)).data;
