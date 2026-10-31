import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Cadastro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState<"CLIENTE" | "AGENTE">("CLIENTE");

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [endereco, setEndereco] = useState("");
  const [profissao, setProfissao] = useState("");

  const [tipoAgente, setTipoAgente] = useState<"EMPRESA" | "BANCO">("EMPRESA");

  const [erro, setErro] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const dados = {
      login,
      senha,
      nome,
      perfil,
      ...(perfil === "CLIENTE"
        ? { cpf, rg, endereco, profissao }
        : { tipoAgente }),
    };

    try {
      await registrar(dados);
      navigate("/");
    } catch {
      setErro("Não foi possível realizar o cadastro. Verifique os dados.");
    }
  }
  return (
    <main>
      <h1>Criar conta</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="perfil">Perfil</label>
        <select
          id="perfil"
          value={perfil}
          onChange={(event) =>
            setPerfil(event.target.value as "CLIENTE" | "AGENTE")
          }
        >
          <option value="CLIENTE">Cliente</option>
          <option value="AGENTE">Agente</option>
        </select>

        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          required
        />

        <label htmlFor="login">Login</label>
        <input
          id="login"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          required
        />

        {perfil === "CLIENTE" ? (
          <>
            <h2>Dados do cliente</h2>

            <label htmlFor="cpf">CPF</label>
            <input
              id="cpf"
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              required
            />

            <label htmlFor="rg">RG</label>
            <input
              id="rg"
              value={rg}
              onChange={(event) => setRg(event.target.value)}
              required
            />

            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              value={endereco}
              onChange={(event) => setEndereco(event.target.value)}
              required
            />

            <label htmlFor="profissao">Profissão</label>
            <input
              id="profissao"
              value={profissao}
              onChange={(event) => setProfissao(event.target.value)}
              required
            />
          </>
        ) : (
          <>
            <h2>Dados do agente</h2>

            <label htmlFor="tipoAgente">Tipo de agente</label>
            <select
              id="tipoAgente"
              value={tipoAgente}
              onChange={(event) =>
                setTipoAgente(event.target.value as "EMPRESA" | "BANCO")
              }
            >
              <option value="EMPRESA">Empresa</option>
              <option value="BANCO">Banco</option>
            </select>
          </>
        )}

        {erro && <p role="alert">{erro}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}
