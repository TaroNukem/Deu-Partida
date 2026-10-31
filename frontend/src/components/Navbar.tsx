import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar(){
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout(){
        logout() 
        navigate("/login")
    }

    if(!usuario){
        return null
    }

    return(
        <nav>
            <Link to="/">Deu Partida</Link>

            {usuario.perfil === "CLIENTE" && (
                <>
                    <Link to="/cadastro">Meu Cadastro</Link>
                    <Link to="/pedidos">Meus pedidos</Link>
                    <Link to="/pedidos/novo">Novo pedido</Link>
                </>
            )}

            {usuario.perfil == "AGENTE" && (
                <Link to="/agente/pedidos">Pedidos recebidos</Link>
            )}

            <button onClick={handleLogout}>
                Sair
            </button>
        </nav>
    )
}