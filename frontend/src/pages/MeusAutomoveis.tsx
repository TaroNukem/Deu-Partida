import { useEffect, useState, type FormEvent } from "react";
import { listarMeusAutomoveis, cadastrarAutomovel } from "../services/automovelAgenteService";
import type { Automovel } from "../types/types";

const FORM_VAZIO = { matricula: "", ano: "", marca: "", modelo: "", placa: "" };

export default function MeusAutomoveis() {
  const [automoveis, setAutomoveis] = useState<Automovel[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState(FORM_VAZIO);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ texto: string; ok: boolean } | null>(null);

  function carregar() {
    setCarregando(true);
    return listarMeusAutomoveis()
      .then(setAutomoveis)
      .catch(() => setAviso({ texto: "Erro ao carregar automóveis", ok: false }))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function atualizar(campo: keyof typeof FORM_VAZIO, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAviso(null);
    setEnviando(true);

    try {
      await cadastrarAutomovel({
        matricula: form.matricula,
        ano: Number(form.ano),
        marca: form.marca,
        modelo: form.modelo,
        placa: form.placa,
      });
      setForm(FORM_VAZIO);
      setAviso({ texto: "Automóvel cadastrado", ok: true });
      await carregar();
    } catch (err: any) {
      setAviso({
        texto: err.response?.data?.mensagem ?? "Erro ao cadastrar automóvel",
        ok: false,
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">ÁREA DO AGENTE</p>
          <h1>Meus automóveis</h1>
          <p>Cadastre os carros em seu nome para disponibilizá-los nos pedidos.</p>
        </div>
      </section>

      {aviso && (
        <p className={aviso.ok ? "success notice" : "error notice"} role="status">
          {aviso.texto}
        </p>
      )}

      <section className="card">
        <h2>Cadastrar automóvel</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Matrícula
              <input value={form.matricula} onChange={(e) => atualizar("matricula", e.target.value)} required />
            </label>
            <label>
              Placa
              <input value={form.placa} onChange={(e) => atualizar("placa", e.target.value)} required />
            </label>
            <label>
              Marca
              <input value={form.marca} onChange={(e) => atualizar("marca", e.target.value)} required />
            </label>
            <label>
              Modelo
              <input value={form.modelo} onChange={(e) => atualizar("modelo", e.target.value)} required />
            </label>
            <label>
              Ano
              <input
                type="number"
                value={form.ano}
                onChange={(e) => atualizar("ano", e.target.value)}
                required
              />
            </label>
          </div>
          <div className="actions">
            <button type="submit" disabled={enviando}>
              {enviando ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Automóveis cadastrados</h2>

        {carregando ? (
          <p>Carregando...</p>
        ) : automoveis.length === 0 ? (
          <p>Nenhum automóvel cadastrado.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Automóvel</th>
                  <th>Ano</th>
                  <th>Placa</th>
                  <th>Matrícula</th>
                </tr>
              </thead>
              <tbody>
                {automoveis.map((a) => (
                  <tr key={a.id}>
                    <td>{a.marca} {a.modelo}</td>
                    <td>{a.ano}</td>
                    <td>{a.placa}</td>
                    <td>{a.matricula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}