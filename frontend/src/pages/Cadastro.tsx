import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

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
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <section className="welcome card-wide">
        <div>
          <p className="eyebrow">NOVA CONTA</p>
          <h1>Criar conta</h1>
          <p>Cadastre-se como cliente para alugar, ou como agente para analisar pedidos.</p>
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="card card-wide">
          <h2>Acesso</h2>
          <div className="form-grid">
            <label>
              Perfil
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value as "CLIENTE" | "AGENTE")}
              >
                <option value="CLIENTE">Cliente</option>
                <option value="AGENTE">Agente</option>
              </select>
            </label>

            <label>
              Nome
              <input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </label>

            <label>
              Login
              <input value={login} onChange={(e) => setLogin(e.target.value)} required />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </label>
          </div>
        </section>

        {perfil === "CLIENTE" ? (
          <section className="card card-wide">
            <h2>Dados do cliente</h2>
            <div className="form-grid">
              <label>
                CPF
                <input value={cpf} onChange={(e) => setCpf(e.target.value)} required />
              </label>
              <label>
                RG
                <input value={rg} onChange={(e) => setRg(e.target.value)} required />
              </label>
              <label>
                Endereço
                <input value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
              </label>
              <label>
                Profissão
                <input value={profissao} onChange={(e) => setProfissao(e.target.value)} required />
              </label>
            </div>
          </section>
        ) : (
          <section className="card card-wide">
            <h2>Dados do agente</h2>
            <div className="form-grid">
              <label>
                Tipo de agente
                <select
                  value={tipoAgente}
                  onChange={(e) => setTipoAgente(e.target.value as "EMPRESA" | "BANCO")}
                >
                  <option value="EMPRESA">Empresa</option>
                  <option value="BANCO">Banco</option>
                </select>
              </label>
            </div>
          </section>
        )}

        <section className="card card-wide">
          {erro && <p className="error">{erro}</p>}

          <div className="form-actions">
            <button type="submit" disabled={enviando}>
              {enviando ? "Cadastrando..." : "Cadastrar"}
            </button>
            <Link to="/login" className="secondary-link">
              Já tenho conta
            </Link>
          </div>
        </section>
      </form>
    </>
  );
}