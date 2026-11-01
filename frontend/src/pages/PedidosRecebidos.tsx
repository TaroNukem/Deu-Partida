import { useEffect, useState } from "react";
import {
  listarPedidosRecebidos,
  avaliar,
  type Parecer,
} from "../services/agentePedidoService";
import type { Pedido } from "../types";
import StatusBadge from "../components/StatusBadge";

export default function PedidosRecebidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [selecionado, setSelecionado] = useState<Pedido | null>(null);
  const [observacao, setObservacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  function carregar() {
    setCarregando(true);
    return listarPedidosRecebidos()
      .then((dados) => setPedidos(dados))
      .catch(() => setErro("Erro ao carregar pedidos recebidos"))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function selecionar(pedido: Pedido) {
    setSelecionado(pedido);
    setObservacao("");
    setMensagem(null);
  }

  async function handleAvaliar(parecer: Parecer) {
    if (!selecionado?.id) return;

    if (!observacao.trim()) {
      setMensagem("Escreva uma observação antes de avaliar");
      return;
    }

    setEnviando(true);
    setMensagem(null);

    try {
      await avaliar(selecionado.id, observacao, parecer);
      setMensagem("Avaliação registrada");
      setSelecionado(null);
      setObservacao("");
      await carregar();
    } catch (err: any) {
      setMensagem(err.response?.data?.mensagem ?? "Erro ao registrar avaliação");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando && pedidos.length === 0) return <p>Carregando...</p>;
  if (erro) return <p role="alert">{erro}</p>;

  return (
    <main>
      <h1>Pedidos recebidos</h1>

      {mensagem && <p role="status">{mensagem}</p>}

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
                  <button type="button" onClick={() => selecionar(pedido)}>
                    Avaliar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selecionado && (
        <section>
          <h2>Avaliar pedido #{selecionado.id}</h2>
          <p>
            {selecionado.clienteNome} — {selecionado.automovel.marca}{" "}
            {selecionado.automovel.modelo} ({selecionado.automovel.placa})
          </p>

          <label htmlFor="observacao">Observação</label>
          <textarea
            id="observacao"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={4}
          />

          <div>
            <button
              type="button"
              disabled={enviando}
              onClick={() => handleAvaliar("POSITIVO")}
            >
              Parecer positivo
            </button>
            <button
              type="button"
              disabled={enviando}
              onClick={() => handleAvaliar("NEGATIVO")}
            >
              Parecer negativo
            </button>
            <button type="button" onClick={() => setSelecionado(null)}>
              Fechar
            </button>
          </div>
        </section>
      )}
    </main>
  );
}