export interface ExamenFisico {
  id_examen: number;
  fecha_examen: string;
  descripcion: string;
  url_examen: string | null;
  tipo_area: number;
  paciente: number;
}

export interface RevisionOrgano {
  id_revision: number;
  fecha_revision: string;
  descripcion: string;
  url_revision: string | null;
  tipo_organos: number;
  paciente: number;
}

export interface Historial {
  id_historial: number;
  paciente: {
    id_patient: number;
    name: string;
    lastname: string;
    identification: string | null;
    birthdate: string;
    gender: string;
    address: string;
    phone: string;
    email: string;
    image_url: string | null;
  };
  consulta: {
    id_consulta: number;
    fecha_consulta: string;
    motivo: string;
    notas_medicas: string;
  };
  signos_vitales: {
    id_signos: number;
    temperatura: string;
    presion_arterial_sistolica: number;
    presion_arterial_diastolica: number;
    frecuencia_cardiaca: number;
    frecuencia_respiratoria: number;
    peso: string;
    talla: string;
    saturacion_oxigeno: string;
  };
  diagnostico: {
    id_diagnostico: number;
    nombre: string;
    descripcion: string;
  };
  tratamiento: {
    id_tratamiento: number;
    descripcion: string;
    duracion: string;
    dosis: string;
    frecuencia: string;
  };
  receta: {
    id_receta: number;
    fecha_receta: string;
    medicamentos_recetados: string;
  };
  fecha_creacion: string;
}

