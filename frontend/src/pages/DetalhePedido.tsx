import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  buscarPedido,
  buscarCredito,
  cancelarPedido,
  modificarPedido,
} from "../services/pedidoService";
import type { ContratoCredito, Pedido, StatusPedido } from "../types/types";
import StatusBadge from "../components/StatusBadge";
import PedidoForm, { type DadosPedido } from "../components/PedidoForm";
import { formatarData, formatarPeriodo } from "../utils/formatar";

const ETAPAS: StatusPedido[] = ["EM_ANALISE", "APROVADO", "CONTRATADO"];

const rotulosEtapa: Record<StatusPedido, string> = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CANCELADO: "Cancelado",
  CONTRATADO: "Contratado",
};

export default function DetalhePedido() {
  const { id } = useParams<{ id: string }>();
  const pedidoId = Number(id);

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [credito, setCredito] = useState<ContratoCredito | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    let ativo = true;

    buscarPedido(pedidoId)
      .then((dados) => {
        if (!ativo) return;
        setPedido(dados);

        if (dados.status === "APROVADO" || dados.status === "CONTRATADO") {
          buscarCredito(pedidoId)
            .then((c) => { if (ativo) setCredito(c); })
            .catch(() => {});
        }
      })
      .catch(() => {
        if (ativo) setErro("Pedido não encontrado");
      });

    return () => {
      ativo = false;
    };
  }, [pedidoId]);

  if (erro) return <section className="card"><p className="error">{erro}</p></section>;
  if (!pedido) return <section className="card"><p>Carregando...</p></section>;

  const indiceAtual = ETAPAS.indexOf(pedido.status);
  const encerrado = pedido.status === "REPROVADO" || pedido.status === "CANCELADO";
  const podeModificar = pedido.status === "EM_ANALISE";
  const podeCancelar = pedido.status !== "CANCELADO" && pedido.status !== "CONTRATADO";

  async function handleCancelar() {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

    try {
      const atualizado = await cancelarPedido(pedidoId);
      setPedido(atualizado);
      setMensagem("Pedido cancelado");
    } catch (err: any) {
      setMensagem(err.response?.data?.mensagem ?? "Erro ao cancelar o pedido");
    }
  }

  async function handleModificar(dados: DadosPedido) {
    const atualizado = await modificarPedido(pedidoId, dados);
    setPedido(atualizado);
    setEditando(false);
    setMensagem("Pedido atualizado");
  }

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">PEDIDO #{pedido.id}</p>
          <h1>{pedido.automovel.marca} {pedido.automovel.modelo}</h1>
          <p>{formatarPeriodo(pedido.dataInicio, pedido.dataFim)}</p>
        </div>
        <StatusBadge status={pedido.status} />
      </section>

      <Link to="/pedidos" className="secondary-link">← Voltar</Link>

      {mensagem && <p className="success notice" role="status">{mensagem}</p>}

      {editando ? (
        <section className="card">
          <h2>Modificar pedido</h2>
          <PedidoForm
            inicial={{
              automovel: pedido.automovel,
              dataInicio: pedido.dataInicio,
              dataFim: pedido.dataFim,
            }}
            textoBotao="Salvar alterações"
            onSubmit={handleModificar}
            onCancelar={() => setEditando(false)}
          />
        </section>
      ) : (
        <>
          <section className="card">
            <h2>Automóvel</h2>
            <div className="details">
              <div><span>Marca</span><strong>{pedido.automovel.marca}</strong></div>
              <div><span>Modelo</span><strong>{pedido.automovel.modelo}</strong></div>
              <div><span>Ano</span><strong>{pedido.automovel.ano}</strong></div>
              <div><span>Placa</span><strong>{pedido.automovel.placa}</strong></div>
              <div><span>Matrícula</span><strong>{pedido.automovel.matricula}</strong></div>
            </div>
          </section>

          <section className="card">
            <h2>Período</h2>
            <div className="details">
              <div><span>Início</span><strong>{formatarData(pedido.dataInicio)}</strong></div>
              <div><span>Fim</span><strong>{formatarData(pedido.dataFim)}</strong></div>
            </div>
          </section>

          <section className="card">
            <h2>Andamento</h2>
            {encerrado ? (
              <p>Este pedido foi {rotulosEtapa[pedido.status].toLowerCase()}.</p>
            ) : (
              <ol>
                {ETAPAS.map((etapa, index) => {
                  const concluida = index < indiceAtual;
                  const atual = index === indiceAtual;

                  return (
                    <li
                      key={etapa}
                      style={{
                        fontWeight: atual ? 700 : 400,
                        opacity: index > indiceAtual ? 0.5 : 1,
                      }}
                    >
                      {concluida ? "✓ " : atual ? "● " : "○ "}
                      {rotulosEtapa[etapa]}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          {pedido.avaliacao && (
            <section className="card">
              <h2>Avaliação financeira</h2>
              <div className="details">
                <div>
                  <span>Parecer</span>
                  <strong>{pedido.avaliacao.parecerPositivo ? "Positivo" : "Negativo"}</strong>
                </div>
                <div>
                  <span>Avaliado por</span>
                  <strong>{pedido.avaliacao.agenteNome}</strong>
                </div>
                <div>
                  <span>Data</span>
                  <strong>{formatarData(pedido.avaliacao.data)}</strong>
                </div>
              </div>
              {pedido.avaliacao.observacao && (
                <p className="subtext">Observação: {pedido.avaliacao.observacao}</p>
              )}
            </section>
          )}

          {credito && (
            <section className="card">
              <h2>Crédito concedido</h2>
              <div className="details">
                <div>
                  <span>Banco</span>
                  <strong>{credito.bancoNome}</strong>
                </div>
                <div>
                  <span>Valor</span>
                  <strong>
                    {credito.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </strong>
                </div>
                <div>
                  <span>Taxa de juros</span>
                  <strong>{credito.taxaJuros}%</strong>
                </div>
                <div>
                  <span>Data</span>
                  <strong>{formatarData(credito.data)}</strong>
                </div>
              </div>
            </section>
          )}

          {(podeModificar || podeCancelar) && (
            <section className="card">
              <div className="actions">
                {podeModificar && (
                  <button type="button" onClick={() => setEditando(true)}>
                    Modificar
                  </button>
                )}
                {podeCancelar && (
                  <button type="button" className="danger" onClick={handleCancelar}>
                    Cancelar pedido
                  </button>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}