import { useEffect, useState } from "react";
import {
  listarPedidosRecebidos,
  avaliar,
  concederCredito,
  executarContrato,
  type Parecer,
} from "../services/agentePedidoService";
import type { Pedido, StatusPedido } from "../types/types";
import StatusBadge, { rotulosStatus } from "../components/StatusBadge";
import BarraBusca from "../components/BarraBusca";
import { useAuth } from "../context/AuthContext";
import { filtrarPedidos } from "../utils/filtrarPedidos";
import { formatarPeriodo } from "../utils/formatar";

const STATUS_OPCOES = Object.keys(rotulosStatus) as StatusPedido[];

// 11 dígitos sem pontuação viram 000.000.000-00; outros valores passam como estão
function formatarCpf(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PedidosRecebidos() {
  const { usuario } = useAuth();
  const ehBanco = usuario?.tipoAgente === "BANCO";

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | "">("");
  const [busca, setBusca] = useState("");

  const [selecionado, setSelecionado] = useState<Pedido | null>(null);
  const [observacao, setObservacao] = useState("");
  const [valorCredito, setValorCredito] = useState("");
  const [taxaCredito, setTaxaCredito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ texto: string; ok: boolean } | null>(null);

  const visiveis = filtrarPedidos(pedidos, busca, filtroStatus);

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
    setAviso(null);
  }

  function fechar() {
    setSelecionado(null);
    setAviso(null);
  }

  function erroDe(err: any, padrao: string) {
    return err.response?.data?.mensagem ?? padrao;
  }

  async function executar(acao: () => Promise<unknown>, sucesso: string, padrao: string) {
    setEnviando(true);
    setAviso(null);

    try {
      await acao();
      setAviso({ texto: sucesso, ok: true });
      setSelecionado(null);
      await carregar();
    } catch (err: any) {
      setAviso({ texto: erroDe(err, padrao), ok: false });
    } finally {
      setEnviando(false);
    }
  }

  function handleAvaliar(parecer: Parecer) {
    if (!selecionado?.id) return;

    if (!observacao.trim()) {
      setAviso({ texto: "Escreva uma observação antes de avaliar", ok: false });
      return;
    }

    const id = selecionado.id;
    void executar(
      () => avaliar(id, observacao, parecer),
      parecer === "POSITIVO" ? "Pedido aceito" : "Pedido recusado",
      "Erro ao registrar avaliação"
    );
  }

  function handleCredito() {
    if (!selecionado?.id) return;

    const valor = Number(valorCredito);
    const taxa = Number(taxaCredito);

    if (!valor || !taxa) {
      setAviso({ texto: "Informe o valor e a taxa do crédito", ok: false });
      return;
    }

    const id = selecionado.id;
    void executar(
      () => concederCredito(id, valor, taxa),
      "Crédito concedido",
      "Erro ao conceder crédito"
    );
  }

  function handleContrato() {
    if (!selecionado?.id) return;
    if (!window.confirm("Confirma a execução do contrato?")) return;

    const id = selecionado.id;
    void executar(
      () => executarContrato(id),
      "Contrato executado",
      "Erro ao executar contrato"
    );
  }

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">ÁREA DO AGENTE</p>
          <h1>Pedidos recebidos</h1>
          <p>Analise os pedidos, emita pareceres e acompanhe os contratos.</p>
        </div>
        <span className="role">{ehBanco ? "BANCO" : "EMPRESA"}</span>
      </section>

      {aviso && (
        <p className={aviso.ok ? "success notice" : "error notice"} role="status">
          {aviso.texto}
        </p>
      )}

      <section className="card">
        <div className="form-grid">
          <label>
            Filtrar por status
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as StatusPedido | "")}
            >
              <option value="">Todos</option>
              {STATUS_OPCOES.map((s) => (
                <option key={s} value={s}>{rotulosStatus[s]}</option>
              ))}
            </select>
          </label>

          <BarraBusca valor={busca} onChange={setBusca} />
        </div>
      </section>

      <section className="card">
        <h2>Pedidos</h2>

        {erro ? (
          <p className="error">{erro}</p>
        ) : carregando ? (
          <p>Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido recebido.</p>
        ) : visiveis.length === 0 ? (
          <p>Nenhum pedido encontrado com esses filtros.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Carro</th>
                  <th>Placa</th>
                  <th>Matrícula</th>
                  <th>Período</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className={selecionado?.id === pedido.id ? "row-selected" : undefined}
                  >
                    <td>{pedido.clienteNome}</td>
                    <td>{pedido.automovel.marca} {pedido.automovel.modelo}</td>
                    <td>{pedido.automovel.placa}</td>
                    <td>{pedido.automovel.matricula}</td>
                    <td>{formatarPeriodo(pedido.dataInicio, pedido.dataFim)}</td>
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
          </div>
        )}
      </section>

      {selecionado && (
        <section className="card">
          <div className="section-head">
            <div>
              <h2>Pedido #{selecionado.id}</h2>
              <p>
                {selecionado.clienteNome} · {selecionado.automovel.marca}{" "}
                {selecionado.automovel.modelo}
              </p>
            </div>
            <StatusBadge status={selecionado.status} />
          </div>

          <div className="details">
            <div>
              <span>Cliente</span>
              <strong>{selecionado.clienteNome}</strong>
            </div>
            <div>
              <span>Automóvel</span>
              <strong>
                {selecionado.automovel.marca} {selecionado.automovel.modelo}
              </strong>
            </div>
            <div>
              <span>Placa</span>
              <strong>{selecionado.automovel.placa}</strong>
            </div>
            <div>
              <span>Período</span>
              <strong>{formatarPeriodo(selecionado.dataInicio, selecionado.dataFim)}</strong>
            </div>
          </div>

          {selecionado.cliente && (
            <>
              <h3>Dados do cliente</h3>
              <div className="details">
                <div>
                  <span>CPF</span>
                  <strong>{formatarCpf(selecionado.cliente.cpf)}</strong>
                </div>
                <div>
                  <span>Profissão</span>
                  <strong>{selecionado.cliente.profissao || "Não informada"}</strong>
                </div>
              </div>

              <h3>Rendimentos</h3>
              {selecionado.cliente.rendimentos.length === 0 ? (
                <p className="subtext">Nenhum empregador informado.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Empregador</th>
                        <th>Rendimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selecionado.cliente.rendimentos.map((r, i) => (
                        <tr key={r.id ?? i}>
                          <td>{r.entidadeEmpregadora}</td>
                          <td>{formatarMoeda(r.valor)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {selecionado.avaliacao && (
            <p className="subtext">
              Parecer {selecionado.avaliacao.parecerPositivo ? "positivo" : "negativo"} por{" "}
              {selecionado.avaliacao.agenteNome}
              {selecionado.avaliacao.observacao && `: ${selecionado.avaliacao.observacao}`}
            </p>
          )}

          {selecionado.status === "EM_ANALISE" && (
            <>
              <div className="form-grid">
                <label className="full">
                  Observação
                  <textarea
                    rows={4}
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />
                </label>
              </div>
              <div className="actions">
                <button
                  type="button"
                  disabled={enviando}
                  onClick={() => handleAvaliar("POSITIVO")}
                >
                  Aceitar
                </button>
                <button
                  type="button"
                  className="danger"
                  disabled={enviando}
                  onClick={() => handleAvaliar("NEGATIVO")}
                >
                  Recusar
                </button>
              </div>
            </>
          )}

          {selecionado.status === "APROVADO" && ehBanco && (
            <>
              <h3>Conceder crédito</h3>
              <div className="form-grid">
                <label>
                  Valor (R$)
                  <input
                    type="number"
                    value={valorCredito}
                    onChange={(e) => setValorCredito(e.target.value)}
                  />
                </label>
                <label>
                  Taxa (%)
                  <input
                    type="number"
                    value={taxaCredito}
                    onChange={(e) => setTaxaCredito(e.target.value)}
                  />
                </label>
              </div>
              <div className="actions">
                <button type="button" disabled={enviando} onClick={handleCredito}>
                  Conceder crédito
                </button>
              </div>
            </>
          )}

          {selecionado.status === "APROVADO" && (
            <div className="actions mt-md">
              <button type="button" disabled={enviando} onClick={handleContrato}>
                Executar contrato
              </button>
            </div>
          )}

          {selecionado.status !== "EM_ANALISE" && selecionado.status !== "APROVADO" && (
            <p className="subtext">Este pedido não tem ações disponíveis no status atual.</p>
          )}

          <div className="actions mt-md">
            <button type="button" className="secondary" onClick={fechar}>
              Fechar
            </button>
          </div>
        </section>
      )}
    </>
  );
}