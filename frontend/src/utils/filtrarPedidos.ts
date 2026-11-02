import type { Pedido, StatusPedido } from "../types/types";

// Remove espaços e hífens e deixa minúsculo, para "ABC-1D23" bater com "abc1d23"
function normalizar(texto: string) {
  return texto.toLowerCase().replace(/[\s-]/g, "");
}

export function filtrarPedidos(
  pedidos: Pedido[],
  busca: string,
  status: StatusPedido | ""
) {
  const termo = normalizar(busca);

  return pedidos.filter((p) => {
    if (status && p.status !== status) return false;
    if (!termo) return true;

    const placa = normalizar(p.automovel.placa ?? "");
    const matricula = normalizar(p.automovel.matricula ?? "");

    return placa.includes(termo) || matricula.includes(termo);
  });
}