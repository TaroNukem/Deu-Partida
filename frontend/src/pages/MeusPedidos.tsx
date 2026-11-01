import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPedidos } from "../services/pedidoService";
import type { Pedido, StatusPedido } from "../types";
import StatusBadge from "../components/StatusBadge";

const rotulosStatus: Record<StatusPedido, string> = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CANCELADO: "Cancelado",
  CONTRATADO: "Contratado",
};

const STATUS_OPCOES = Object.keys(rotulosStatus) as StatusPedido[];

export default function MeusPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<StatusPedido | "">("");

  useEffect(() => {
    let ativo = true;
    setCarregando(true);

    listarPedidos(filtro || undefined)
      .then((dados) => {
        if (ativo) setPedidos(dados);
      })
      .catch(() => {
        if (ativo) setErro("Erro ao carregar pedidos");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [filtro]);

  return (
    <main>
      <h1>Meus pedidos</h1>

      <label htmlFor="filtro-status">Status</label>
      <select
        id="filtro-status"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value as StatusPedido | "")}
      >
        <option value="">Todos</option>
        {STATUS_OPCOES.map((s) => (
          <option key={s} value={s}>
            {rotulosStatus[s]}
          </option>
        ))}
      </select>

      {carregando ? (
        <p>Carregando...</p>
      ) : erro ? (
        <p role="alert">{erro}</p>
      ) : pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Carro</th>
              <th>Placa</th>
              <th>Período</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>
                  {pedido.automovel.marca} {pedido.automovel.modelo}
                </td>
                <td>{pedido.automovel.placa}</td>
                <td>
                  {pedido.dataInicio} a {pedido.dataFim}
                </td>
                <td>
                  <StatusBadge status={pedido.status} />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/pedidos/${pedido.id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}