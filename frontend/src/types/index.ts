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

export interface Pedido{
    id?:number, automovel: Automovel, dataInicio:string, dataFim:string, dataPedido:string, status:StatusPedido, clienteNome?: string
}