import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPedidos } from "../services/pedidoService";
import type { Pedido, StatusPedido } from "../types/types";
import StatusBadge, { rotulosStatus } from "../components/StatusBadge";

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
      .then((dados) => { if (ativo) setPedidos(dados); })
      .catch(() => { if (ativo) setErro("Erro ao carregar pedidos"); })
      .finally(() => { if (ativo) setCarregando(false); });

    return () => { ativo = false; };
  }, [filtro]);

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">PEDIDOS</p>
          <h1>Meus pedidos</h1>
          <p>Acompanhe a análise, a contratação e o andamento dos seus aluguéis.</p>
        </div>
      </section>

      {erro && <p className="error notice">{erro}</p>}

      <section className="card">
        <div className="form-grid" style={{ maxWidth: 360, marginBottom: 0 }}>
          <label>
            Filtrar por status
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as StatusPedido | "")}
            >
              <option value="">Todos</option>
              {STATUS_OPCOES.map((s) => (
                <option key={s} value={s}>{rotulosStatus[s]}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2>Pedidos</h2>

        {carregando ? (
          <p>Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Automóvel</th>
                  <th>Placa</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>{pedido.automovel.marca} {pedido.automovel.modelo}</td>
                    <td>{pedido.automovel.placa}</td>
                    <td>{pedido.dataInicio} até {pedido.dataFim}</td>
                    <td>
                      <StatusBadge status={pedido.status} />
                    </td>
                    <td className="actions">
                      <button type="button" onClick={() => navigate(`/pedidos/${pedido.id}`)}>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}