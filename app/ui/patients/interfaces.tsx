export interface VitalSignsData {
  temperatura: string;
  presion_arterial_sistolica: string;
  presion_arterial_diastolica: string;
  frecuencia_cardiaca: string;
  frecuencia_respiratoria: string;
  peso: string;
  talla: string;
  saturacion_oxigeno: string;
}

export interface ConsultationData {
  fecha_consulta: string;
  motivo: string;
  notas_medicas: string;
}

export interface DiagnosticData {
  nombre: string;
  descripcion: string;
}

export interface TreatmentData {
  descripcion: string;
  duracion: string;
  dosis: string;
  frecuencia: string;
}

export interface RecipeData {
  fecha_receta: string;
  medicamentos_recetados: string;
}

export interface FormData {
  vitalSigns: VitalSignsData;
  consultation: ConsultationData;
  diagnostic: DiagnosticData;
  treatment: TreatmentData;
  recipe: RecipeData;
}