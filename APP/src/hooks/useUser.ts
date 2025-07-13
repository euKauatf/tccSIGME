/// !! !Hook que pega o usuário (lá ele) com tudo bonitinho !!!

// IMPORTAÇÕES
import { useOutletContext } from "react-router-dom";
import type { User } from "../types";

// Puxada bruta de qualidade do usuário
export function useUser() {
  return useOutletContext<{ user: User | null }>();
}