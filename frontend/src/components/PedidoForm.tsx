import { useEffect, useState, type FormEvent } from "react";
import { listarAutomoveisDisponiveis } from "../services/pedidoService";
import { listarBancos } from "../services/bancoService";
import type { Automovel, Banco } from "../types/types";

export type DadosPedido = {
  automovel: {
    id?: number;
    matricula: string;
    ano: number;
    marca: string;
    modelo: string;
    placa: string;
  };
  dataInicio: string;
  dataFim: string;
  bancoId?: number | null;
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

  // Automóveis de agentes (só na criação)
  const [disponiveis, setDisponiveis] = useState<Automovel[]>([]);
  const [escolhido, setEscolhido] = useState<number | "">("");

  // Crédito opcional (só na criação)
  const [comCredito, setComCredito] = useState(false);
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [bancoEscolhido, setBancoEscolhido] = useState<number | "">("");

  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (inicial) return;

    setEscolhido("");

    if (!dataInicio || !dataFim || dataFim <= dataInicio) {
      setDisponiveis([]);
      return;
    }

    let ativo = true;

    listarAutomoveisDisponiveis(dataInicio, dataFim)
      .then((lista) => { if (ativo) setDisponiveis(lista); })
      .catch(() => { if (ativo) setDisponiveis([]); });

    return () => {
      ativo = false;
    };
  }, [dataInicio, dataFim, inicial]);

  useEffect(() => {
    if (inicial) return;

    let ativo = true;

    listarBancos()
      .then((lista) => { if (ativo) setBancos(lista); })
      .catch(() => { if (ativo) setBancos([]); });

    return () => {
      ativo = false;
    };
  }, [inicial]);

  function escolher(id: number | "") {
    setEscolhido(id);

    const carro = disponiveis.find((a) => a.id === id);
    if (carro) {
      setMatricula(carro.matricula);
      setAno(carro.ano);
      setMarca(carro.marca);
      setModelo(carro.modelo);
      setPlaca(carro.placa);
    }
  }

  function alternarCredito(marcado: boolean) {
    setComCredito(marcado);
    if (!marcado) setBancoEscolhido("");
  }

  const camposTravados = escolhido !== "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (!inicial && comCredito && bancoEscolhido === "") {
      setErro("Escolha o banco para associar o crédito");
      return;
    }

    setEnviando(true);

    try {
      await onSubmit({
        automovel: {
          id: escolhido === "" ? undefined : escolhido,
          matricula,
          ano: Number(ano),
          marca,
          modelo,
          placa,
        },
        dataInicio,
        dataFim,
        bancoId: !inicial && comCredito && bancoEscolhido !== "" ? Number(bancoEscolhido) : null,
      });
    } catch (err: any) {
      setErro(err.response?.data?.mensagem ?? "Erro ao salvar o pedido");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Período</h2>
      <div className="form-grid">
        <label>
          Data de início
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </label>
        <label>
          Data de fim
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </label>
      </div>

      <h2>Automóvel</h2>

      {!inicial && (
        <div className="form-grid">
          <label className="full">
            Automóvel disponível
            <select
              value={escolhido}
              disabled={!dataInicio || !dataFim}
              onChange={(e) =>
                escolher(e.target.value === "" ? "" : Number(e.target.value))
              }
            >
              <option value="">Digitar os dados do automóvel</option>
              {disponiveis.map((a) => (
                <option key={a.id ?? a.placa} value={a.id}>
                  {a.marca} {a.modelo} · {a.ano} · {a.placa}
                </option>
              ))}
            </select>
          </label>
          <p className="subtext full">
            {!dataInicio || !dataFim
              ? "Escolha as datas para ver os automóveis disponíveis."
              : disponiveis.length === 0
                ? "Nenhum automóvel disponível neste período."
                : "Escolha um automóvel da lista ou digite os dados abaixo."}
          </p>
        </div>
      )}

      <div className="form-grid">
        <label>
          Matrícula
          <input
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            disabled={camposTravados}
            required
          />
        </label>
        <label>
          Ano
          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(e.target.value === "" ? "" : Number(e.target.value))}
            disabled={camposTravados}
            required
          />
        </label>
        <label>
          Marca
          <input
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            disabled={camposTravados}
            required
          />
        </label>
        <label>
          Modelo
          <input
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            disabled={camposTravados}
            required
          />
        </label>
        <label>
          Placa
          <input
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            disabled={camposTravados}
            required
          />
        </label>
      </div>

      {!inicial && (
        <>
          <h2>Crédito (opcional)</h2>
          <div className="form-grid">
            <label className="full checkbox">
              <input
                type="checkbox"
                checked={comCredito}
                onChange={(e) => alternarCredito(e.target.checked)}
              />
              Associar contrato de crédito
            </label>

            {comCredito && (
              <label className="full">
                Banco
                <select
                  value={bancoEscolhido}
                  onChange={(e) =>
                    setBancoEscolhido(e.target.value === "" ? "" : Number(e.target.value))
                  }
                >
                  <option value="">Selecione o banco</option>
                  {bancos.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {comCredito && bancos.length === 0 && (
            <p className="subtext">Nenhum banco disponível no momento.</p>
          )}
        </>
      )}

      {erro && <p className="error">{erro}</p>}

      <div className="form-actions">
        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : textoBotao}
        </button>
        {onCancelar && (
          <button type="button" className="secondary" onClick={onCancelar}>
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  );
}