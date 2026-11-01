import { useState, type FormEvent } from "react";

export type DadosPedido = {
  automovel: {
    matricula: string;
    ano: number;
    marca: string;
    modelo: string;
    placa: string;
  };
  dataInicio: string;
  dataFim: string;
};

type Props = {
  inicial?: DadosPedido;
  textoBotao: string;
  onSubmit: (dados: DadosPedido) => Promise<void>;
  onCancelar?: () => void;
};

export default function PedidoForm({ inicial, textoBotao, onSubmit, onCancelar }: Props) {
  const [matricula, setMatricula] = useState(inicial?.automovel.matricula ?? "");
  const [ano, setAno] = useState<number | "">(inicial?.automovel.ano ?? "");
  const [marca, setMarca] = useState(inicial?.automovel.marca ?? "");
  const [modelo, setModelo] = useState(inicial?.automovel.modelo ?? "");
  const [placa, setPlaca] = useState(inicial?.automovel.placa ?? "");
  const [dataInicio, setDataInicio] = useState(inicial?.dataInicio ?? "");
  const [dataFim, setDataFim] = useState(inicial?.dataFim ?? "");

  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await onSubmit({
        automovel: {
          matricula,
          ano: Number(ano),
          marca,
          modelo,
          placa,
        },
        dataInicio,
        dataFim,
      });
    } catch (err: any) {
      setErro(err.response?.data?.mensagem ?? "Erro ao salvar o pedido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Automóvel</h2>

      <label htmlFor="matricula">Matrícula</label>
      <input id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />

      <label htmlFor="ano">Ano</label>
      <input
        id="ano"
        type="number"
        value={ano}
        onChange={(e) => setAno(e.target.value === "" ? "" : Number(e.target.value))}
        required
      />

      <label htmlFor="marca">Marca</label>
      <input id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />

      <label htmlFor="modelo">Modelo</label>
      <input id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />

      <label htmlFor="placa">Placa</label>
      <input id="placa" value={placa} onChange={(e) => setPlaca(e.target.value)} required />

      <h2>Período</h2>

      <label htmlFor="dataInicio">Data de início</label>
      <input
        id="dataInicio"
        type="date"
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
        required
      />

      <label htmlFor="dataFim">Data de fim</label>
      <input
        id="dataFim"
        type="date"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
        required
      />

      {erro && <p role="alert">{erro}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : textoBotao}
      </button>

      {onCancelar && (
        <button type="button" onClick={onCancelar}>
          Cancelar edição
        </button>
      )}
    </form>
  );
}