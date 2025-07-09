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