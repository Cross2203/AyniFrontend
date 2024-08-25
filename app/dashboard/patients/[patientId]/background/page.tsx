'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Background {
  id_antecedentes?: number;
  paciente: number;
  tipo_antecedentes: number;
  descripcion: string;
}

const tiposAntecedentes = [
  { id: 1, tipo: 'ALERGIAS' },
  { id: 2, tipo: 'ANTECEDENTES PERSONALES' },
  { id: 3, tipo: 'ANTECEDENTES FAMILIARES' },
  { id: 4, tipo: 'HISTORIA GINECO-OBSTÉTRICA' },
  { id: 5, tipo: 'HÁBITOS' },
  { id: 6, tipo: 'VACUNAS' },
];

const subtiposGinecoObstetricos = [
  { id: 'MENARQUIA', tipo: 'fecha', label: 'Menarquía (edad)' },
  { id: 'MENOPAUSIA', tipo: 'fecha', label: 'Menopausia (edad)' },
  { id: 'FUM', tipo: 'fecha', label: 'Fecha última menstruación' },
  { id: 'FUP', tipo: 'fecha', label: 'Fecha último parto' },
  { id: 'FUC', tipo: 'fecha', label: 'Fecha última citología' },
  { id: 'GESTA', tipo: 'numero', label: 'Gestas' },
  { id: 'PARTOS', tipo: 'numero', label: 'Partos' },
  { id: 'ABORTOS', tipo: 'numero', label: 'Abortos' },
  { id: 'CESAREAS', tipo: 'numero', label: 'Cesáreas' },
  { id: 'HIJOS_VIVOS', tipo: 'numero', label: 'Hijos vivos' },
  { id: 'CICLOS', tipo: 'texto', label: 'Ciclos' },
  { id: 'VIDA_SEXUAL_ACTIVA', tipo: 'texto', label: 'Vida sexual activa' },
  { id: 'METODO_PF', tipo: 'texto', label: 'Método de planificación familiar' },
  { id: 'TERAPIA_HORMONAL', tipo: 'texto', label: 'Terapia hormonal' },
  { id: 'COLPOSCOPIA', tipo: 'texto', label: 'Colposcopía' },
  { id: 'MAMOGRAFIA', tipo: 'texto', label: 'Mamografía' },
  { id: 'BIOPSIA', tipo: 'texto', label: 'Biopsia' },
];

export default function Page({ params }: { params: { patientId: number } }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<number>(params.patientId);
  const [tipoAntecedente, setTipoAntecedente] = useState<number>(1);
  const [subtipoAntecedente, setSubtipoAntecedente] = useState<string>('');
  const [valor, setValor] = useState<string>("");
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
    let descripcion = "";

    if (tipoAntecedente === 4 && subtipoAntecedente) {
      const subtipo = subtiposGinecoObstetricos.find(s => s.id === subtipoAntecedente);
      if (subtipo) {
        descripcion = `${subtipo.label} - ${valor}`;
      }
    } else {
      descripcion = valor;
    }

    const data: Omit<Background, 'id_antecedentes'> = {
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
        resetForm();
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setTipoAntecedente(1);
    setSubtipoAntecedente('');
    setValor("");
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
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange">Antecedentes</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-center">
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
                  {tiposAntecedentes.find(t => t.id === background.tipo_antecedentes)?.tipo || 'Desconocido'}
                </td>
                <td className="px-4 py-2 border-b">{background.descripcion}</td>
                <td className="px-4 py-2 border-b">
                  {background.id_antecedentes && (
                    <button
                      className="w-full h-10 bg-button2 p-2 rounded-md hover:bg-button2alt"
                      onClick={() => deleteBackground(background.id_antecedentes as number)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block mb-1" htmlFor="tipoAntecedente">
            Tipo de Antecedente:
          </label>
          <select
            id="tipoAntecedente"
            value={tipoAntecedente}
            onChange={(e) => setTipoAntecedente(Number(e.target.value))}
            className="w-full ring-2 ring-orange px-3 py-2 bg-second rounded-md focus:outline-none focus:border-blue-500"
          >
            {tiposAntecedentes.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
            ))}
          </select>
        </div>

        {tipoAntecedente === 4 && (
          <div className="mb-4">
            <label className="block mb-1" htmlFor="subtipoAntecedente">
              Subtipo de Antecedente Gineco-Obstétrico:
            </label>
            <select
              id="subtipoAntecedente"
              value={subtipoAntecedente}
              onChange={(e) => setSubtipoAntecedente(e.target.value)}
              className="w-full px-3 py-2 ring-2 ring-orange bg-second rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccione un subtipo</option>
              {subtiposGinecoObstetricos.map((subtipo) => (
                <option key={subtipo.id} value={subtipo.id}>{subtipo.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1" htmlFor="valor">
            {tipoAntecedente === 4 && subtipoAntecedente
              ? subtiposGinecoObstetricos.find(s => s.id === subtipoAntecedente)?.label
              : "Descripción"}:
          </label>
          <input
            type={tipoAntecedente === 4 && subtipoAntecedente && subtiposGinecoObstetricos.find(s => s.id === subtipoAntecedente)?.tipo === 'fecha' ? "date" : "text"}
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full px-3 py-2 ring-2 ring-orange bg-second rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brown hover:bg-orange text-white py-2 rounded-md transition duration-300 ease-in-out"
        >
          Agregar Antecedente
        </button>
      </form>
    </div>
  );
}