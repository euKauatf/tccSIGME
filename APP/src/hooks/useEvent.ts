import { useOutletContext } from "react-router-dom";
import type { Event } from "../types";

export function useEvent() {
  return useOutletContext<{ event: Event | null }>();
}
