'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Background {
  id_antecedentes: number;
  paciente: number;
  tipo_antecedentes: number;
  descripcion: string;
}


export default function Page({ params }: { params: { patientId: number } }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<number>(params.patientId);
  const [tipoAntecedente, setTipoAntecedente] = useState<number>();
  const [descripcion, setDescripcion] = useState<string>("");
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);

  const loadBackgrounds = async (patientId: number): Promise<Background[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/antecedentes/${patientId}/`
      );
      const backgroundData = await response.json();
      console.log(backgroundData);
      if (Array.isArray(backgroundData)) {
        return backgroundData;
      } else {
        return [backgroundData];
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      return [];
    }
  };

  const deleteBackground = async (id_antecedente: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/antecedentes/${id_antecedente}/`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        setBackgrounds((prevBackgrounds) =>
          prevBackgrounds.filter((background) => background.id_antecedentes !== id_antecedente)
        );
      } else {
        console.error('Failed to delete background');
      }
    } catch (error) {
      console.error('Error deleting background:', error);
    }
  };

  const fetchAndSetBackgrounds = async (patientId: number) => {
    const fetchedBackgrounds = await loadBackgrounds(patientId);
    setBackgrounds(fetchedBackgrounds);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      descripcion,
      paciente,
      tipo_antecedentes: tipoAntecedente,
    };
    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/antecedentes/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    try {
      const response = await fetch(endpoint, options);
      if (response.ok) {
        await fetchAndSetBackgrounds(params.patientId); 
        setTipoAntecedente(1); 
        setDescripcion(""); 
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const fetchedBackgrounds = await loadBackgrounds(params.patientId);
      setBackgrounds(fetchedBackgrounds);
    };
  
    if (params.patientId) {
      fetchData();
    }
  }, [paciente]);

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-orange">Antecedentes</h2>
      <div>
        <table className="w-full table-fixed text-center">
          <thead className="text-orange">
            <tr>
              <th className="px-4 py-2 border-b">Tipo</th>
              <th className="px-4 py-2 border-b">Descripción</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {backgrounds.map((background) => (
              <tr key={background.id_antecedentes}>
                <td className="px-4 py-2 border-b">
                  {background.tipo_antecedentes === 1
                    ? 'Alergia'
                    : background.tipo_antecedentes === 2
                    ? 'Antecedente Familiar'
                    : background.tipo_antecedentes === 3
                    ? 'Antecedente Personal'
                    : 'Otro'}
                </td>
                <td className="px-4 py-2 border-b">{background.descripcion}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="w-full h-10 bg-button2 p-2 rounded-md hover:bg-button2alt"
                    onClick={() => deleteBackground(background.id_antecedentes)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <p className="block mb-1 font-bold text-lg text-orange">Agregar nuevo antecedente medico</p>
          <label className="block mb-1" htmlFor="tipoAntecedente">
            Tipo de Antecedente:
          </label>
          <select
            id="tipoAntecedente"
            value={tipoAntecedente}
            onChange={(event) => setTipoAntecedente(Number(event.target.value))}
            className="w-full px-3 py-2 border border-black bg-second rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value={1}>Alergia</option>
            <option value={2}>Antecedente Familiar</option>
            <option value={3}>Antecedente Personal</option>
            <option value={4}>Otro</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="descripcion4">
            Descripción:
          </label>
          <textarea
            id="descripcion4"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            className="w-full px-3 py-2 border border-black bg-second rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-brown rounded-md hover:bg-button1alt focus:outline-none focus:bg-blue-600"
        >
          Agregar Antecedente
        </button>
      </form>
    </div>
  );
}