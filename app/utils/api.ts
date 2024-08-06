// utils/api.ts
export async function fetchHistoriales(id_paciente: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/historiales/${id_paciente}/?full_data=true`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

export async function fetchExamenesFisicos(id_paciente: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/examenfisico/${id_paciente}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

export async function fetchRevisionesOrganos(id_paciente: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/revisionorganossistemas/${id_paciente}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}
