import type { StatusPedido } from "../types";

const rotulos: Record<StatusPedido, string> = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CANCELADO: "Cancelado",
  CONTRATADO: "Contratado",
};

const cores: Record<StatusPedido, { fundo: string; texto: string }> = {
  EM_ANALISE: { fundo: "#fef3c7", texto: "#92400e" },
  APROVADO: { fundo: "#dcfce7", texto: "#166534" },
  REPROVADO: { fundo: "#fee2e2", texto: "#991b1b" },
  CANCELADO: { fundo: "#fee2e2", texto: "#991b1b" },
  CONTRATADO: { fundo: "#dbeafe", texto: "#1e40af" },
};

export default function StatusBadge({ status }: { status: StatusPedido }) {
  const cor = cores[status];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 600,
        background: cor.fundo,
        color: cor.texto,
      }}
    >
      {rotulos[status]}
    </span>
  );
}