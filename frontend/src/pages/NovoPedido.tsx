import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { criarPedido } from "../services/pedidoService";

export default function NovoPedido() {
  const navigate = useNavigate();

  const [matricula, setMatricula] = useState("");
  const [ano, setAno] = useState<number | "">("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await criarPedido({
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
      navigate("/pedidos");
    } catch (err: any) {
      setErro(err.response?.data?.mensagem ?? "Erro ao criar o pedido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Novo pedido</h1>

      <form onSubmit={handleSubmit}>
        <h2>Automóvel</h2>

        <label htmlFor="matricula">Matrícula</label>
        <input
          id="matricula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
        />

        <label htmlFor="ano">Ano</label>
        <input
          id="ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />

        <label htmlFor="marca">Marca</label>
        <input
          id="marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          required
        />

        <label htmlFor="modelo">Modelo</label>
        <input
          id="modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          required
        />

        <label htmlFor="placa">Placa</label>
        <input
          id="placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          required
        />

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
          {enviando ? "Enviando..." : "Criar pedido"}
        </button>
      </form>
    </main>
  );
}