//HOOK QUE RETORNA OS DADOS DO USUÁRIO!
//Armazena os dados do usuário e permite que eles sejam acessados em qualquer lugar da aplicação.

import { useOutletContext } from "react-router-dom";
import type { User } from "../types";

export function useUser() {
  return useOutletContext<{ user: User | null }>();
}