"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PatientFace from "@/public/customers/1.png";
import { useRouter } from "next/navigation";

interface Patient {
  id_patient: string;
  name: string;
  lastname: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

const loadPatients = async (params: {
  patientId: string;
}): Promise<Patient> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/${params.patientId}/`
  );
  const patient = await response.json();
  return patient;
};

const loadRecords = async (params: { patientId: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/historiales/${params.patientId}/`
  );
  const record = await response.json();
  return record;
};

const loadBackground = async (params: { patientId: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/antecedentes/${params.patientId}/`
  );
  const background = await response.json();
  return background;
};

const loadAppointments = async (params: { patientId: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/citas/${params.patientId}/`
  );
  const appointment = await response.json();
  return appointment;
};

export default function Page({ params }: { params: { patientId: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);

  const router = useRouter();

  const deletePatient = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este paciente?");
    if (confirmDelete) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/${params.patientId}/`,
          {
            method: "DELETE",
          }
        );
        router.push("/dashboard/patients/list");
      } catch (error) {
        console.error("Error al eliminar el paciente:", error);
      }
    }
  };
  useEffect(() => {
    loadPatients(params).then((data: Patient) => {
      setPatient(data);
    });
  }, [params]);

  return (
    <div className="p-6 bg-contrast1 rounded-md shadow-md w-full">
      <div>
        {patient ? (
          <h2 className="text-2xl ">
            Paciente{" "}
            <b>
              {patient.name} {patient.lastname}{" "}
            </b>
          </h2>
        ) : (
          <p>Cargando...</p>
        )}
        <div className="flex gap-4 items-center">
          <Image
            src={PatientFace}
            alt="Patient Face"
            width={100}
            height={100}
            className="border-2 border-black mt-4"
          />
          <div className="mt-4 flex flex-col ">
            <li>
              <b>Genero:</b> {patient?.gender}
            </li>
            <li>
              <b>Fecha de Nacimiento:</b> {patient?.birthdate}
            </li>
            <li>
              <b>Dirección:</b> {patient?.address}
            </li>
            <li>
              <b>Telefono:</b> {patient?.phone}
            </li>
            <li>
              <b>Email:</b> {patient?.email}
            </li>
          </div>
          <button onClick={() => router.push(`/dashboard/patients/${params.patientId}/edit`)} className="mt-4 ml-60 w-24 h-10 bg-blue-500 text-white p-2 rounded-md hover:bg-button1alt">
            Editar
          </button>
          <button onClick={deletePatient} className="mt-4  w-24 h-10 bg-red-500 text-white p-2 rounded-md hover:bg-button2alt">
            Eliminar
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-20">
      </div>
    </div>
  );
}
