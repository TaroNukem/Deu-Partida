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
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">NOVO PEDIDO</p>
          <h1>Solicitar aluguel</h1>
          <p>Informe o automóvel e o período desejado.</p>
        </div>
      </section>

      <section className="card">
        <PedidoForm textoBotao="Criar pedido" onSubmit={handleCriar} />
      </section>
    </>
  );
}