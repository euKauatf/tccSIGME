import { useOutletContext } from "react-router-dom";
import type { User } from "../types";

export function useUser() {
  const { user } = useOutletContext<{ user: User | null }>();

  const isAdmin = user?.tipo === "adm";

  return { user, isAdmin };
}
