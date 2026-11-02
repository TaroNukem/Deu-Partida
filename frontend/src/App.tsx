import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import MeuCadastro from "./pages/MeuCadastro";
import MeusPedidos from "./pages/MeusPedidos";
import NovoPedido from "./pages/NovoPedido";
import DetalhePedido from "./pages/DetalhePedido";
import PedidosRecebidos from "./pages/PedidosRecebidos";
import MeusAutomoveis from "./pages/MeusAutomoveis";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="shell">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <PublicRoute>
                  <Cadastro />
                </PublicRoute>
              }
            />
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
            <Route
              path="/agente/automoveis"
              element={
                <PrivateRoute perfil="AGENTE">
                  <MeusAutomoveis />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <footer>Deu Partida · Laboratório 02 · DIAW · PUC Minas</footer>
      </div>
    </BrowserRouter>
  );
}