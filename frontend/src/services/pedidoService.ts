import { api } from "./api";
import type { Pedido, StatusPedido } from "../types/types";

export const listarPedidos = async (status?: StatusPedido) =>(await api.get<Pedido[]>("/pedidos", { params:status ? { status } :{} })).data

export const buscarPedido = async (id: number) => (await api.get<Pedido>(`/pedidos/${id}`)).data

export const criarPedido = async (dados: unknown) => (await api.post<Pedido>("/pedidos", dados)).data

export const modificarPedido = async (id:number, dados:unknown) => (await api.put<Pedido>(`/pedidos/${id}`, dados)).data

export const cancelarPedido = async (id:number) => (await api.patch<Pedido>(`/pedidos/${id}/cancelar`)).data