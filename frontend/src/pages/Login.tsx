import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await login(usuario, senha);
      navigate("/");
    } catch (err: any) {
      setErro(err.response?.data?.mensagem ?? "Usuário ou senha inválidos");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="card card-narrow">
      <h1>Entrar</h1>
      <p>Acesse sua área de aluguel.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Usuário
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {erro && <p className="error">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </section>
  );
}