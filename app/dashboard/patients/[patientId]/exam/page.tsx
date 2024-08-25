'use client';
import React, { useState, useEffect } from "react";
const tiposExamen = [
  { id: 1, nombre: 'PIEL - FANERAS' },
  { id: 2, nombre: 'CABEZA' },
  { id: 3, nombre: 'OJOS' },
  { id: 4, nombre: 'OIDOS' },
  { id: 5, nombre: 'NARIZ' },
  { id: 6, nombre: 'BOCA' },
  { id: 7, nombre: 'ORO FARINGE' },
  { id: 8, nombre: 'CUELLO' },
  { id: 9, nombre: 'AXILAS - MAMAS' },
  { id: 10, nombre: 'TÓRAX' },
  { id: 11, nombre: 'ABDOMEN' },
  { id: 12, nombre: 'COLUMNA VERTEBRAL' },
  { id: 13, nombre: 'INGLE-PERINÉ' },
  { id: 14, nombre: 'MIEMBROS SUPERIORES' },
  { id: 15, nombre: 'MIEMBROS INFERIORES' },
  { id: 16, nombre: 'ÓRGANOS DE LOS SENTIDOS' },
  { id: 17, nombre: 'RESPIRATORIO' },
  { id: 18, nombre: 'CARDIO VASCULAR' },
  { id: 19, nombre: 'DIGESTIVO' },
  { id: 20, nombre: 'GENITAL' },
  { id: 21, nombre: 'URINARIO' },
  { id: 22, nombre: 'MÚSCULO ESQUELÉTICO' },
  { id: 23, nombre: 'ENDOCRINO' },
  { id: 24, nombre: 'HEMO LINFÁTICO' },
  { id: 25, nombre: 'NEUROLÓGICO' },
];

export default function Page({ params }: { params: { patientId: number } }) {
  const [tipo_area, setTipoArea] = useState<number>(1);
  const [descripcion, setDescripcion] = useState<string>("");
  const [examFile, setExamFile] = useState<File | null>(null);

  const uploadExamToS3 = async (file: File, filename: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/exam/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let url_examen = '';
    if (examFile) {
      const filename = `${params.patientId}-exam`;
      url_examen = await uploadExamToS3(examFile, filename);
    } else {
      url_examen = 'null';
    }
    const data = {
      tipo_area,
      descripcion,
      paciente: params.patientId,
      url_examen
    }
    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/examenfisico/`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata,
    };
    const response = fetch(endpoint, options);
    alert('Examen anadido con exito');
    setTipoArea(1);
    setDescripcion("");
    window.location.reload();
    
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange mb-6">Examen Físico</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tipoExamen" className="block text-sm font-medium mb-2">
            Tipo de Examen
          </label>
          <select
            id="tipoExamen"
            className="w-full bg-second text-white px-3 py-2 rounded-md focus:outline-none ring-2 ring-orange"
            onChange={(e) => setTipoArea(Number(e.target.value))}
          >
            {tiposExamen.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="w-full bg-second text-white px-3 py-2 rounded-md focus:outline-none ring-2 ring-orange resize-none"
            placeholder="Ingrese la descripción del examen"
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Subir Archivo
          </label>
          <div className="flex items-center space-x-2">
            <label
              htmlFor="image"
              className="cursor-pointer bg-orange text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
            >
              Seleccionar archivo
            </label>
            <input
              id="image"
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setExamFile(event.target.files[0]);
                }
              }}
            />
            <span className="text-sm">
              {examFile ? examFile.name : "Ningún archivo seleccionado"}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-brown hover:bg-orange text-white py-2 rounded-md transition duration-300 ease-in-out"
        >
          Agregar Examen
        </button>
      </form>
    </div>
  );
}