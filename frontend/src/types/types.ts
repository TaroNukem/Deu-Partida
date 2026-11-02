export type Perfil = "CLIENTE" | "AGENTE";
export type TipoAgente = "EMPRESA" | "BANCO";
export type StatusPedido =
  | "EM_ANALISE"
  | "APROVADO"
  | "REPROVADO"
  | "CANCELADO"
  | "CONTRATADO";

export interface AuthResponse {
  token: string;
  id: number;
  login: string;
  nome: string;
  perfil: Perfil;
  tipoAgente?: TipoAgente | null;
}
export interface Rendimento {
  id?: number;
  entidadeEmpregadora: string;
  valor: number;
}
export interface Cliente {
  id?: number;
  login?: string;
  nome: string;
  rg: string;
  cpf: string;
  endereco: string;
  profissao: string;
  rendimentos: Rendimento[];
}

export interface Automovel{
    id?:number,
    matricula:string,
    ano:number,
    marca:string,
    modelo:string,
    placa:string
}

export interface Avaliacao {
  observacao: string;
  parecerPositivo: boolean;
  data: string;
  agenteNome: string;
}

export interface Pedido {
  id?: number;
  automovel: Automovel;
  dataInicio: string;
  dataFim: string;
  dataPedido: string;
  status: StatusPedido;
  clienteNome?: string;
  avaliacao?: Avaliacao | null;
  cliente?: ClienteResumo | null;
}

export interface ContratoCredito {
  id: number;
  pedidoId: number;
  bancoNome: string;
  valor: number;
  taxaJuros: number;
  data: string;
}

export interface RendimentoResumo {
  id?: number;
  entidadeEmpregadora: string;
  valor: number;
}

export interface ClienteResumo {
  id: number;
  nome: string;
  cpf: string;
  profissao: string;
  rendimentos: RendimentoResumo[];
}