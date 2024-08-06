export interface HistorialMedico {
  id_historial: number;
  fecha_creacion: string;
  paciente: {
    id_patient: number;
    name: string;
    lastname: string;
    birthdate: string;
    gender: string;
    address: string;
    phone: string;
    email: string;
  };
  consulta: {
    id_consulta: number;
    fecha_consulta: string;
    motivo: string;
    notas_medicas: string;
  } | null;
  signos_vitales: {
    id_signos: number;
    temperatura: number | null;
    presion_arterial_sistolica: number | null;
    presion_arterial_diastolica: number | null;
    frecuencia_cardiaca: number | null;
    frecuencia_respiratoria: number | null;
    peso: number | null;
    talla: number | null;
    saturacion_oxigeno: number | null;
  } | null;
  diagnostico: {
    id_diagnostico: number;
    nombre: string;
    descripcion: string;
  } | null;
  tratamiento: {
    id_tratamiento: number;
    descripcion: string;
    duracion: string;
    dosis: string;
    frecuencia: string;
  } | null;
  receta: {
    id_receta: number;
    fecha_receta: string;
    medicamentos_recetados: string;
  } | null;
}

export const fetchHistorial = async (patientId: number): Promise<HistorialMedico[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/historiales/${patientId}?full_data=true`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch historial');
  }
  return response.json();
};
