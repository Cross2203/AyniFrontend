"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  id_patient: string;
  name: string;
  lastname: string;
  identification: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

const loadPatients = async (): Promise<Patient[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/`
  );
  const patients = await response.json();
  return patients;
};

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    loadPatients().then((data: Patient[]) => {
      setPatients(data);
      setIsLoading(false);
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.lastname} ${patient.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-second text-white rounded-lg shadow-lg w-full">
      <h1 className="text-3xl font-bold mb-6 text-orange">Lista de Pacientes</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar paciente por nombre, apellido o email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border bg-first rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
        />
      </div>
      {isLoading ? (
        <div className="text-center py-4">Cargando pacientes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-first text-orange">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Apellido</th>
                <th className="px-4 py-2 text-left">Cédula</th>
                <th className="px-4 py-2 text-left">Fecha de Nacimiento</th>
                <th className="px-4 py-2 text-left">Género</th>
                <th className="px-4 py-2 text-left">Dirección</th>
                <th className="px-4 py-2 text-left">Teléfono</th>
                <th className="px-4 py-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id_patient}
                  className="border-b border-orange hover:bg-first transition-colors duration-200 cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/patients/${patient.id_patient}/records`)
                  }
                >
                  <td className="px-4 py-3">{patient.name}</td>
                  <td className="px-4 py-3">{patient.lastname}</td>
                  <td className="px-4 py-3">{patient.identification}</td>
                  <td className="px-4 py-3">{new Date(patient.birthdate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{patient.gender}</td>
                  <td className="px-4 py-3">{patient.address}</td>
                  <td className="px-4 py-3">{patient.phone}</td>
                  <td className="px-4 py-3">{patient.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && filteredPatients.length === 0 && (
        <div className="text-center py-4 text-orange">No se encontraron pacientes</div>
      )}
    </div>
  );
}