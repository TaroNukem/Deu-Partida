import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  if (!usuario) return null;

  const ehCliente = usuario.perfil === "CLIENTE";
  const rotulo = ehCliente
    ? "Cliente"
    : usuario.tipoAgente === "BANCO"
      ? "Banco"
      : "Empresa";

  function sair() {
    logout();
    navigate("/login");
  }

  return (
    <header className="topbar">
      <Link className="brand" to={ehCliente ? "/pedidos" : "/agente/pedidos"}>
        <span className="brand-icon">DP</span>
        <span>
          Deu <span className="accent">Partida</span>
        </span>
      </Link>

      <nav>
        {ehCliente ? (
          <>
            <NavLink to="/pedidos" end>Meus pedidos</NavLink>
            <NavLink to="/pedidos/novo">Novo pedido</NavLink>
            <NavLink to="/meu-cadastro">Meu cadastro</NavLink>
          </>
        ) : (
          <NavLink to="/agente/pedidos">Pedidos recebidos</NavLink>
        )}

        <span className="user-chip">
          <strong>{usuario.nome}</strong>
          <span className="role">{rotulo}</span>
        </span>

        <button type="button" className="secondary logout" onClick={sair}>
          Sair
        </button>
      </nav>
    </header>
  );
}