type Props = {
  valor: string;
  onChange: (valor: string) => void;
};

export default function BarraBusca({ valor, onChange }: Props) {
  return (
    <label>
      Buscar por placa ou matrícula
      <input
        type="search"
        value={valor}
        placeholder="Ex.: ABC1D23 ou 123456"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}