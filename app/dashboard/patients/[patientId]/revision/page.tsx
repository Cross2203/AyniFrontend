'use client';
import React, { useState, useEffect } from "react";

const tiposRevision = [
  { id: 1, nombre: 'ÓRGANOS DE LOS SENTIDOS' },
  { id: 2, nombre: 'RESPIRATORIO' },
  { id: 3, nombre: 'CARDIO VASCULAR' },
  { id: 4, nombre: 'DIGESTIVO' },
  { id: 5, nombre: 'GENITAL' },
  { id: 6, nombre: 'URINARIO' },
  { id: 7, nombre: 'MUSCULO ESQUELÉTICO' },
  { id: 8, nombre: 'ENDOCRINO' },
  { id: 9, nombre: 'HEMO LINFÁTICO' },
  { id: 10, nombre: 'NERVIOSO' },
];

export default function Page({ params }: { params: { patientId: number } }) {
  const [tipo_organos, setTipoOrganos] = useState<number>(1);
  const [descripcion, setDescripcion] = useState<string>("");
  const [revisionFile, setRevisionFile] = useState<File | null>(null);

  const uploadRevisionToS3 = async (file: File, filename: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/test-images/`, {
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
    let url_revision = '';
    if (revisionFile) {
      const filename = `${params.patientId}-revision`;
      url_revision = await uploadRevisionToS3(revisionFile, filename);
    } else {
      url_revision = 'null';
    }
    const data = {
      tipo_organos,
      descripcion,
      paciente: params.patientId,
      url_revision
    }
    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/revisionorganossistemas/`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata,
    };
    const response = fetch(endpoint, options);
    alert('Examen anadido con exito');
    setTipoOrganos(1);
    setDescripcion("");
    window.location.reload();
    
  };
  return (
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange mb-6">Revisión de Órganos y Sistemas</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tipoRevision" className="block text-sm font-medium mb-2">
            Tipo de Revisión
          </label>
          <select
            id="tipoRevision"
            className="w-full bg-second text-white px-3 py-2 rounded-md focus:outline-none  ring-2 ring-orange"
            onChange={(e) => setTipoOrganos(Number(e.target.value))}
          >
            {tiposRevision.map((tipo) => (
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
            className="w-full bg-second text-white px-3 py-2 rounded-md focus:outline-none  ring-2 ring-orange resize-none"
            rows={4}
            placeholder="Ingrese la descripción de la revisión"
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
                  setRevisionFile(event.target.files[0]);
                }
              }}
            />
            <span className="text-sm">
              {revisionFile ? revisionFile.name : "Ningún archivo seleccionado"}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-brown hover:bg-orange text-white py-2 rounded-md transition duration-300 ease-in-out"
        >
          Agregar Revisión
        </button>
      </form>
    </div>
  );
}