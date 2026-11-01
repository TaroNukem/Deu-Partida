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
if(erro) return <p role="alert">{erro}</p>
if(!cliente) return <p>Carregando...</p>

return(
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
      </form>
    </main>
)
}
