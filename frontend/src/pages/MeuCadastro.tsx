import { useEffect, useState } from "react";
import { buscarMeuCadastro } from "../services/clienteService";
import type { Cliente } from "../types";

export default function MeuCadastro() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [erro, setErro] = useState<string | null>(null);

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

  if (erro) return <p role="alert">{erro}</p>;
  if (!cliente) return <p>Carregando...</p>;

  const rendimentos = cliente.rendimentos ?? [];

  function adicionarRendimento() {
    setCliente({
      ...cliente!,
      rendimentos: [...rendimentos, { entidadeEmpregadora: "", valor: 0 }],
    });
  }

  function removerRendimento(index: number) {
    setCliente({
      ...cliente!,
      rendimentos: rendimentos.filter((_, i) => i !== index),
    });
  }

  function atualizarRendimento(
    index: number,
    campo: "entidadeEmpregadora" | "valor",
    valor: string
  ) {
    setCliente({
      ...cliente!,
      rendimentos: rendimentos.map((r, i) =>
        i === index
          ? { ...r, [campo]: campo === "valor" ? Number(valor) : valor }
          : r
      ),
    });
  }

  return (
    <main>
      <h1>Meu cadastro</h1>

      <form>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          value={cliente.nome ?? ""}
          onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
        />

        <label htmlFor="rg">RG</label>
        <input
          id="rg"
          value={cliente.rg ?? ""}
          onChange={(e) => setCliente({ ...cliente, rg: e.target.value })}
        />

        <label htmlFor="cpf">CPF</label>
        <input
          id="cpf"
          value={cliente.cpf ?? ""}
          onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })}
        />

        <label htmlFor="endereco">Endereço</label>
        <input
          id="endereco"
          value={cliente.endereco ?? ""}
          onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
        />

        <label htmlFor="profissao">Profissão</label>
        <input
          id="profissao"
          value={cliente.profissao ?? ""}
          onChange={(e) => setCliente({ ...cliente, profissao: e.target.value })}
        />

        <h2>Rendimentos</h2>

        {rendimentos.map((rendimento, index) => (
          <div key={rendimento.id ?? index}>
            <input
              placeholder="Entidade empregadora"
              value={rendimento.entidadeEmpregadora}
              onChange={(e) =>
                atualizarRendimento(index, "entidadeEmpregadora", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Valor"
              value={rendimento.valor}
              onChange={(e) =>
                atualizarRendimento(index, "valor", e.target.value)
              }
            />
            <button type="button" onClick={() => removerRendimento(index)}>
              Remover
            </button>
          </div>
        ))}

        {rendimentos.length >= 3 && <p>Máximo de 3 rendimentos</p>}

        <button
          type="button"
          onClick={adicionarRendimento}
          disabled={rendimentos.length >= 3}
        >
          Adicionar rendimento
        </button>
      </form>
    </main>
  );
}