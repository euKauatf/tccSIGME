/// !! !Hook que pega o usuário (lá ele) com tudo bonitinho !!!

// IMPORTAÇÕES
import { useOutletContext } from "react-router-dom";
import type { User } from "../types";

// Puxada bruta de qualidade do usuário com validação de admin inclusa
export function useUser() {
  const { user } = useOutletContext<{ user: User | null }>();

  const isAdmin = user?.tipo === 'adm';

  return { user, isAdmin };
}