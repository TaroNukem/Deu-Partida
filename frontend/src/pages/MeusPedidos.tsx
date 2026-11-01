import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPedidos } from "../services/pedidoService";
import type { Pedido } from "../types";

export default function MeusPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    listarPedidos()
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
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p role="alert">{erro}</p>;

  return (
    <main>
      <h1>Meus pedidos</h1>

      {pedidos.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
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
      <td>{pedido.status}</td>
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