import { useOutletContext } from "react-router-dom";
import type { User } from "../types";

export function useUser() {
  return useOutletContext<{ user: User | null }>();
}