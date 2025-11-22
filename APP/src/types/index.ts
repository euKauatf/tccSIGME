export type DiaDaSemana = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";

export interface User {
  id: number;
  name: string;
  matricula: string;
  tipo: "aluno" | "adm";
  created_at: string;
  updated_at: string;
  eventos: Event[];
}

export interface Event {
  id: number;
  tema: string;
  palestrante: string;
  email_palestrante: string;
  telefone_palestrante: string;
  vagas_max: number;
  data: DiaDaSemana;
  horario_inicio: string;
  horario_termino: string;
  descricao: string;
  local: string;
  vagas_restantes: number;
  pivot?: {
    status: "inscrito" | "contemplado" | "nao-contemplado";
  };
  inscritos_count?: number;
}

export interface AuditLog {
  id: number;
  action: string;
  user: {
    id: number;
    name: string;
  } | null;
  auditable: {
    id: number;
    tema: string;
  } | null;
  created_at: string;
}

export interface Palestrante {
  id: number;
  name: string;
  email: string;
  telefone: string;
}

export interface Local {
  id: number;
  name: string;
  capacidade: number;
}
