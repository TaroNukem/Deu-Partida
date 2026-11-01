import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarPedido, cancelarPedido, modificarPedido } from "../services/pedidoService";
import type { Pedido, StatusPedido } from "../types";
import StatusBadge from "../components/StatusBadge";
import PedidoForm, { type DadosPedido } from "../components/PedidoForm";

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
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    let ativo = true;

    buscarPedido(pedidoId)
      .then((dados) => {
        if (ativo) setPedido(dados);
      })
      .catch(() => {
        if (ativo) setErro("Pedido não encontrado");
      });

    return () => {
      ativo = false;
    };
  }, [pedidoId]);

  if (erro) return <p role="alert">{erro}</p>;
  if (!pedido) return <p>Carregando...</p>;

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
    <main>
      <Link to="/pedidos">← Voltar</Link>

      <h1>Pedido #{pedido.id}</h1>
      <StatusBadge status={pedido.status} />

      {mensagem && <p role="status">{mensagem}</p>}

      {editando ? (
        <>
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
        </>
      ) : (
        <>
          <h2>Automóvel</h2>
          <p>Matrícula: {pedido.automovel.matricula}</p>
          <p>Marca: {pedido.automovel.marca}</p>
          <p>Modelo: {pedido.automovel.modelo}</p>
          <p>Ano: {pedido.automovel.ano}</p>
          <p>Placa: {pedido.automovel.placa}</p>

          <h2>Período</h2>
          <p>
            {pedido.dataInicio} a {pedido.dataFim}
          </p>

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

          <div>
            {podeModificar && (
              <button type="button" onClick={() => setEditando(true)}>
                Modificar
              </button>
            )}
            {podeCancelar && (
              <button type="button" onClick={handleCancelar}>
                Cancelar pedido
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}