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
  const router = useRouter();

  useEffect(() => {
    loadPatients().then((data: Patient[]) => {
      setPatients(data);
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
    <div className="p-6 bg-second text-white rounded-md shadow-md w-full overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none focus:border-blue-500 text-white"
        />
      </div>
      <table className="w-full table-auto">
        <thead className="bg-second text-orange">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Apellido</th>
            <th className="text-left px-4 py-2">Cedula</th>
            <th className="text-left px-4 py-2">Fecha de Nacimiento</th>
            <th className="text-left px-4 py-2">Genero</th>
            <th className="text-left px-4 py-2">Direccion</th>
            <th className="text-left px-4 py-2">Telefono</th>
            <th className="text-left px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr
              key={patient.id_patient}
              className="border-b border-orange hover:bg-first hover:text-white cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/patients/${patient.id_patient}/records`)
              }
            >
              <td className="text-left px-4 py-2">{patient.name}</td>
              <td className="text-left px-4 py-2">{patient.lastname}</td>
              <td className="text-left px-4 py-2">{patient.identification}</td>
              <td className="text-left px-4 py-2">{patient.birthdate}</td>
              <td className="text-left px-4 py-2">{patient.gender}</td>
              <td className="text-left px-4 py-2">{patient.address}</td>
              <td className="text-left px-4 py-2">{patient.phone}</td>
              <td className="text-left px-4 py-2">{patient.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}