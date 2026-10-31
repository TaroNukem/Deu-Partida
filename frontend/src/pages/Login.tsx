import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function login(){
    const { login } = useAuth()
    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")

    async function enviar(e: FormEvent) {
        e.preventDefault()
        setErro("")
        try{
            const dados = await login(user, senha)
            navigate(dados.perfil === "AGENTE" ? "/agente/pedidos": "/pedidos")
        } catch(err: any){
            setErro(err.response?.data?.mensagem ?? "Não foi possível entrar")
        }
    }

    return(
      <form onSubmit={enviar}>
        <h1>Entrar</h1>
        <input placeholder="Usuário" value={user} onChange={(e) => setUser(e.target.value)} />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit">Entrar</button>
        <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </form>
    )
}