import { api } from "./api";
import type { Pedido } from "../types";

export const listarPedidosRecebidos = async () =>
  (await api.get<Pedido[]>("/agente/pedidos")).data;