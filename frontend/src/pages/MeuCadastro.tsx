import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarMeuCadastro, atualizarCadastro, excluirConta } from "../services/clienteService";
import { useAuth } from "../context/AuthContext";
import type { Cliente, Rendimento } from "../types/types";

export default function MeuCadastro() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    buscarMeuCadastro()
      .then((dados) => {
        if (ativo) setCliente(dados);
      })
      .catch(() => {
        if (ativo) setErro("Erro ao carregar");
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (erro) return <section className="card"><p className="error">{erro}</p></section>;
  if (!cliente) return <section className="card"><p>Carregando...</p></section>;

  const rendimentos: Rendimento[] = cliente.rendimentos ?? [];

  function adicionarRendimento() {
    setCliente({
      ...cliente!,
      rendimentos: [...rendimentos, { entidadeEmpregadora: "", valor: 0 }],
    });
  }

  function removerRendimento(index: number) {
    setCliente({
      ...cliente!,
      rendimentos: rendimentos.filter((_: Rendimento, i: number) => i !== index),
    });
  }

  function atualizarRendimento(
    index: number,
    campo: "entidadeEmpregadora" | "valor",
    valor: string
  ) {
    setCliente({
      ...cliente!,
      rendimentos: rendimentos.map((r: Rendimento, i: number) =>
        i === index
          ? { ...r, [campo]: campo === "valor" ? Number(valor) || 0 : valor }
          : r
      ),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null);
    setSucesso(false);
    setSalvando(true);

    try {
      const atualizado = await atualizarCadastro(cliente!);
      setCliente(atualizado);
      setMensagem("Dados salvos com sucesso!");
      setSucesso(true);
    } catch (err: any) {
      setMensagem(err.response?.data?.mensagem ?? "Erro ao salvar o cadastro");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir() {
    const confirmado = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );
    if (!confirmado) return;

    try {
      await excluirConta();
      logout();
      navigate("/login");
    } catch (err: any) {
      setMensagem(err.response?.data?.mensagem ?? "Erro ao excluir a conta");
    }
  }

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">MEU PERFIL</p>
          <h1>Meu cadastro</h1>
          <p>Mantenha seus dados e rendimentos atualizados.</p>
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="card">
          <h2>Dados pessoais</h2>
          <div className="form-grid">
            <label>
              Nome
              <input
                value={cliente.nome ?? ""}
                onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
              />
            </label>
            <label>
              RG
              <input
                value={cliente.rg ?? ""}
                onChange={(e) => setCliente({ ...cliente, rg: e.target.value })}
              />
            </label>
            <label>
              CPF
              <input
                value={cliente.cpf ?? ""}
                onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })}
              />
            </label>
            <label>
              Endereço
              <input
                value={cliente.endereco ?? ""}
                onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
              />
            </label>
            <label>
              Profissão
              <input
                value={cliente.profissao ?? ""}
                onChange={(e) => setCliente({ ...cliente, profissao: e.target.value })}
              />
            </label>
          </div>
        </section>

        <section className="card">
          <h2>Rendimentos</h2>

          {rendimentos.map((rendimento: Rendimento, index: number) => (
            <div className="form-grid employment" key={rendimento.id ?? index}>
              <label>
                Empregador
                <input
                  value={rendimento.entidadeEmpregadora}
                  onChange={(e) =>
                    atualizarRendimento(index, "entidadeEmpregadora", e.target.value)
                  }
                />
              </label>
              <label>
                Renda mensal (R$)
                <input
                  type="number"
                  value={rendimento.valor}
                  onChange={(e) => atualizarRendimento(index, "valor", e.target.value)}
                />
              </label>
              <button type="button" className="danger" onClick={() => removerRendimento(index)}>
                Remover
              </button>
            </div>
          ))}

          {rendimentos.length >= 3 && (
            <p className="subtext">Máximo de 3 rendimentos</p>
          )}

          <button
            type="button"
            className="secondary"
            onClick={adicionarRendimento}
            disabled={rendimentos.length >= 3}
          >
            Adicionar rendimento
          </button>
        </section>

        <section className="card">
          <div className="form-actions">
            <button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
            <button type="button" className="danger" onClick={handleExcluir}>
              Excluir conta
            </button>
          </div>

          {mensagem && (
            <p className={sucesso ? "success" : "error"} role="status">
              {mensagem}
            </p>
          )}
        </section>
      </form>
    </>
  );
}