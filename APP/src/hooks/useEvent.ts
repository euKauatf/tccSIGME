// !!! Hook que pega o evento com tudo bonitinho !!!

// IMPORTAÇÕES
import { useOutletContext } from "react-router-dom";
import type { Event } from "../types";

// Puxada bruta de qualidade do evento
export function useEvent() {
    return useOutletContext<{ event: Event | null }>();
}