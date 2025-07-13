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