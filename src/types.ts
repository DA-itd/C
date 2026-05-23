export interface Student {
  id: string;
  nombre: string;
  apellidos: string;
  sexo: 'H' | 'M' | '';
  grupal: boolean;
  individual: boolean;
  canalizado: boolean;
  area1: boolean;
  area2: boolean;
  area3: boolean;
  area4: boolean;
  area5: boolean;
  area6: boolean;
  otraArea: string;
  calificacion: string;
}

export interface ReportData {
  nombreTutor: string;
  fecha: string;
  semestre: string;
  carrera: string;
  grupo: string;
  semestreGrupo: string;
  estudiantes: Student[];
  actividades: string[];
  acciones: string[];
  observaciones: string;
  fechaEntrega: string;
  firmaTutor: string;
  firmaCoord: string;
  firmaJefe: string;
}

export const initialStudent: Omit<Student, 'id'> = {
  nombre: '',
  apellidos: '',
  sexo: '',
  grupal: false,
  individual: false,
  canalizado: false,
  area1: false,
  area2: false,
  area3: false,
  area4: false,
  area5: false,
  area6: false,
  otraArea: '',
  calificacion: '',
};
