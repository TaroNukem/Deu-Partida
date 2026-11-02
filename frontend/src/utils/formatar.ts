const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function partes(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return { ano, mes, dia };
}

export function formatarData(iso: string) {
  const { ano, mes, dia } = partes(iso);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
}

export function formatarPeriodo(inicio: string, fim: string) {
  const a = partes(inicio);
  const b = partes(fim);

  if (a.ano === b.ano && a.mes === b.mes) {
    return `${a.dia} a ${b.dia} de ${MESES[a.mes - 1]} de ${a.ano}`;
  }
  return `${formatarData(inicio)} a ${formatarData(fim)}`;
}