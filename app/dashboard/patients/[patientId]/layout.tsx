"use client";
import type { ReactNode } from "react";
import Link from "next/link.js";
import clsx from "clsx";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientFace from "@/public/customers/michael-novotny.png";
import Image from "next/image";

interface LayoutProps {
  children: ReactNode;
  params: { patientId: string };
}

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
  image_url: string;
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

export default function Layout({ children, params }: LayoutProps) {
  const pathname = usePathname();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  
return (
    <div className="p-6 rounded-md shadow-md w-full">
      <div>
        {patient ? (
          <h2 className="text-2xl text-orange">
            Paciente{" "}
            <b>
              {patient.name} {patient.lastname}{" "}
            </b>
          </h2>
        ) : (
          <p>Cargando...</p>
        )}
        <div className="flex flex-col md:flex-row gap-4 items-center">
        {!imageLoaded && (
            <Image
              src={PatientFace}
              alt="Default Patient Face"
              width={100}
              height={100}
              className="border-2 border-black mt-4 rounded-full"
            />
          )}
          <Image
            src={patient?.image_url || PatientFace}
            alt="Patient Face"
            width={100}
            height={100}
            className="border-2 border-black mt-4 rounded-full"
            onLoad={handleImageLoad}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
          <div className="mt-4 flex flex-col">
            <li>
              <b>Genero:</b> {patient?.gender}
            </li>
            <li>
              <b>Cedula:</b> {patient?.identification}
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
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4 md:ml-auto">
            <button
              onClick={() => router.push(`/dashboard/patients/${params.patientId}/edit`)}
              className="w-full md:w-24 h-10 bg-button1 p-2 rounded-md hover:bg-button1alt"
            >
              Editar
            </button>
            <button
              onClick={deletePatient}
              className="w-full md:w-24 h-10 bg-button2 p-2 rounded-md hover:bg-button2alt"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 md:flex-row gap-4">
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <li className="me-2">
              <Link
                href={`/dashboard/patients/${params.patientId}/records`}
                className={clsx(
                  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
                  {
                    "text-gray-600 border-gray-300 dark:text-gray-300 dark:border-gray-600": pathname === `/dashboard/patients/${params.patientId}/records`,
                  }
                )}
              >
                Historial
              </Link>
            </li>
            <li className="me-2">
              <Link
                href={`/dashboard/patients/${params.patientId}/background`}
                className={clsx(
                  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
                  {
                    "text-gray-600 border-gray-300 dark:text-gray-300 dark:border-gray-600": pathname === `/dashboard/patients/${params.patientId}/background`,
                  }
                )}
              >
                Antecedentes
              </Link>
            </li>
            <li className="me-2">
              <Link
                href={`/dashboard/patients/${params.patientId}/exam`}
                className={clsx(
                  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
                  {
                    "text-gray-600 border-gray-300 dark:text-gray-300 dark:border-gray-600": pathname === `/dashboard/patients/${params.patientId}/exam`,
                  }
                )}
              >
                Examenes Fisicos
              </Link>
            </li>
            <li className="me-2">
              <Link
                href={`/dashboard/patients/${params.patientId}/revision`}
                className={clsx(
                  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
                  {
                    "text-gray-600 border-gray-300 dark:text-gray-300 dark:border-gray-600": pathname === `/dashboard/patients/${params.patientId}/revision`,
                  }
                )}
              >
                Revisiones de Organos y Sistemas
              </Link>
            </li>
            <li className="me-2">
              <Link
                href={`/dashboard/patients/${params.patientId}/appointments`}
                className={clsx(
                  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300",
                  {
                    "text-gray-600 border-gray-300 dark:text-gray-300 dark:border-gray-600": pathname === `/dashboard/patients/${params.patientId}/appointments`,
                  }
                )}
              >
                Datos de la consulta
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}