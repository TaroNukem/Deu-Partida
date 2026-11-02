import { api } from "./api";
import type { Banco } from "../types/types";

export const listarBancos = async () =>
  (await api.get<Banco[]>("/bancos")).data;