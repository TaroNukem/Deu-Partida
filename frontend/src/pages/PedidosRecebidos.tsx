import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPedidosRecebidos } from "../services/agentePedidoService";
import type { Pedido } from "../types";
import StatusBadge from "../components/StatusBadge";

export default function PedidosRecebidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    listarPedidosRecebidos()
      .then((dados) => {
        if (ativo) setPedidos(dados);
      })
      .catch(() => {
        if (ativo) setErro("Erro ao carregar pedidos recebidos");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p role="alert">{erro}</p>;

  return (
    <main>
      <h1>Pedidos recebidos</h1>

      {pedidos.length === 0 ? (
        <p>Nenhum pedido recebido.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Carro</th>
              <th>Período</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.clienteNome}</td>
                <td>
                  {pedido.automovel.marca} {pedido.automovel.modelo}
                </td>
                <td>
                  {pedido.dataInicio} a {pedido.dataFim}
                </td>
                <td>
                  <StatusBadge status={pedido.status} />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => navigate(`/agente/pedidos/${pedido.id}`)}
                  >
                    Avaliar
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