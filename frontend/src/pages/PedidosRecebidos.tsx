import { useEffect, useState } from "react";
import {
  listarPedidosRecebidos,
  avaliar,
  concederCredito,
  executarContrato,
  type Parecer,
} from "../services/agentePedidoService";
import type { Pedido } from "../types";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

export default function PedidosRecebidos() {
  const { usuario } = useAuth();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [selecionado, setSelecionado] = useState<Pedido | null>(null);
  const [observacao, setObservacao] = useState("");
  const [valorCredito, setValorCredito] = useState("");
  const [taxaCredito, setTaxaCredito] = useState("");
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
    setValorCredito("");
    setTaxaCredito("");
    setMensagem(null);
  }

  function erroDe(err: any, padrao: string) {
    return err.response?.data?.mensagem ?? padrao;
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
      await carregar();
    } catch (err: any) {
      setMensagem(erroDe(err, "Erro ao registrar avaliação"));
    } finally {
      setEnviando(false);
    }
  }

  async function handleConcederCredito() {
    if (!selecionado?.id) return;

    const valor = Number(valorCredito);
    const taxa = Number(taxaCredito);

    if (!valor || !taxa) {
      setMensagem("Informe o valor e a taxa do crédito");
      return;
    }

    setEnviando(true);
    setMensagem(null);

    try {
      await concederCredito(selecionado.id, valor, taxa);
      setMensagem("Crédito concedido");
      setSelecionado(null);
      await carregar();
    } catch (err: any) {
      setMensagem(erroDe(err, "Erro ao conceder crédito"));
    } finally {
      setEnviando(false);
    }
  }

  async function handleExecutarContrato() {
    if (!selecionado?.id) return;
    if (!window.confirm("Confirma a execução do contrato?")) return;

    setEnviando(true);
    setMensagem(null);

    try {
      await executarContrato(selecionado.id);
      setMensagem("Contrato executado");
      setSelecionado(null);
      await carregar();
    } catch (err: any) {
      setMensagem(erroDe(err, "Erro ao executar contrato"));
    } finally {
      setEnviando(false);
    }
  }

  if (carregando && pedidos.length === 0) return <p>Carregando...</p>;
  if (erro) return <p role="alert">{erro}</p>;

  const podeConcederCredito = usuario?.perfil === "AGENTE";

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
          <h2>Pedido #{selecionado.id}</h2>
          <p>
            {selecionado.clienteNome} — {selecionado.automovel.marca}{" "}
            {selecionado.automovel.modelo} ({selecionado.automovel.placa})
          </p>

          {selecionado.status === "EM_ANALISE" && (
            <>
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
              </div>
            </>
          )}

          {podeConcederCredito && selecionado.status === "APROVADO" && (
            <>
              <h3>Conceder crédito</h3>

              <label htmlFor="valorCredito">Valor</label>
              <input
                id="valorCredito"
                type="number"
                value={valorCredito}
                onChange={(e) => setValorCredito(e.target.value)}
              />

              <label htmlFor="taxaCredito">Taxa (%)</label>
              <input
                id="taxaCredito"
                type="number"
                value={taxaCredito}
                onChange={(e) => setTaxaCredito(e.target.value)}
              />

              <div>
                <button
                  type="button"
                  disabled={enviando}
                  onClick={handleConcederCredito}
                >
                  Conceder crédito
                </button>
              </div>
            </>
          )}

          {selecionado.status === "APROVADO" && (
            <div>
              <button
                type="button"
                disabled={enviando}
                onClick={handleExecutarContrato}
              >
                Executar contrato
              </button>
            </div>
          )}

          <button type="button" onClick={() => setSelecionado(null)}>
            Fechar
          </button>
        </section>
      )}
    </main>
  );
}