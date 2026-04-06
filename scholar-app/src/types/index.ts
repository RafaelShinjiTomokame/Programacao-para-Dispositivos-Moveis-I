export interface Aluno {
    id: string;
    nome: string;
    matricula: string;
    curso: string;
    email: string;
    telefone: string;
    cep: string;
    endereco: string;
    cidade: string;
    estado: string;
  }
  
  export interface Professor {
    id: string;
    nome: string;
    titulacao: string;
    areaAtuacao: string;
    tempoDocencia: string;
    email: string;
  }
  
  export interface Disciplina {
    id: string;
    nome: string;
    cargaHoraria: string;
    professorResponsavel: string;
    curso: string;
    semestre: string;
  }
  
  export interface BoletimItem {
    id: string;
    disciplina: string;
    nota1: number;
    nota2: number;
    media: number;
    situacao: 'Aprovado' | 'Reprovado' | 'Em Recuperação';
  }