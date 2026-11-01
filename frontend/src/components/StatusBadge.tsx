import type { StatusPedido } from "../types/types";

export const rotulosStatus: Record<StatusPedido, string> = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CANCELADO: "Cancelado",
  CONTRATADO: "Contratado",
};

const classes: Record<StatusPedido, string> = {
  EM_ANALISE: "in_review",
  APROVADO: "approved",
  REPROVADO: "rejected",
  CANCELADO: "cancelled",
  CONTRATADO: "contracted",
};

export default function StatusBadge({ status }: { status: StatusPedido }) {
  return <span className={`status ${classes[status]}`}>{rotulosStatus[status]}</span>;
}