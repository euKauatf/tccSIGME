export type DiaDaSemana = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta";

export interface User {
  id: number;
  name: string;
  email: string;
  matricula: string;
  cpf: string;
  tipo: 'aluno' | 'adm';
  created_at: string;
  updated_at: string;
  eventos: Event[];
}

export interface Event {
    id: number;
    tema: string;
    palestrante: string;
    vagas_max: number;
    data: DiaDaSemana;
    horario_inicio: string;
    horario_termino: string;
    descricao: string;
    local: string;
}

export interface AuditLog {
  id: number;
  action: string;
  user: { // O objeto do usuário que realizou a ação
    id: number;
    name: string;
  } | null; // Pode ser nulo se o usuário for deletado
  auditable: { // O objeto que sofreu a ação (neste caso, um Evento)
    id: number;
    tema: string;
  } | null; // Pode ser nulo se não houver objeto alvo
  created_at: string; // O Laravel envia datas como strings no formato ISO
}