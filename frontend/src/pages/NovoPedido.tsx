import { useNavigate } from "react-router-dom";
import { criarPedido } from "../services/pedidoService";
import PedidoForm, { type DadosPedido } from "../components/PedidoForm";

export default function NovoPedido() {
  const navigate = useNavigate();

  async function handleCriar(dados: DadosPedido) {
    await criarPedido(dados);
    navigate("/pedidos");
  }

  return (
    <main>
      <h1>Novo pedido</h1>
      <PedidoForm textoBotao="Criar pedido" onSubmit={handleCriar} />
    </main>
  );
}