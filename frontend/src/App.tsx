import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import MeuCadastro from "./pages/MeuCadastro";
import MeusPedidos from "./pages/MeusPedidos";
import NovoPedido from "./pages/NovoPedido";
import DetalhePedido from "./pages/DetalhePedido";
import PedidosRecebidos from "./pages/PedidosRecebidos";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/meu-cadastro"
            element={
              <PrivateRoute perfil="CLIENTE">
                <MeuCadastro />
              </PrivateRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <PrivateRoute perfil="CLIENTE">
                <MeusPedidos />
              </PrivateRoute>
            }
          />
          <Route
            path="/pedidos/novo"
            element={
              <PrivateRoute perfil="CLIENTE">
                <NovoPedido />
              </PrivateRoute>
            }
          />
          <Route
            path="/pedidos/:id"
            element={
              <PrivateRoute perfil="CLIENTE">
                <DetalhePedido />
              </PrivateRoute>
            }
          />
          <Route
            path="/agente/pedidos"
            element={
              <PrivateRoute perfil="AGENTE">
                <PedidosRecebidos />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
