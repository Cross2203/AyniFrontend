'use client';
import React, { useState, useEffect } from "react";

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
    <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="block mb-1 font-bold text-lg mt-4 text-orange">Revision de Organos y Sistemas</p>
          <label className="block mb-1" htmlFor="tipoRevision">Tipo de Revision</label>
          <select
            id="tipoRevision"
            className="w-full px-3 py-2 border-black bg-second rounded-md focus:outline-none focus:border-blue-500"
            onChange={(e) => setTipoOrganos(Number(e.target.value))}
          >
            <option value={1}>Organos de los Sentidos</option>
            <option value={2}>Respiratorio</option>
            <option value={3}>CardioVascular</option>
            <option value={4}>Digestivo</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="descripcion6">Descripcion</label>
          <textarea 
            id="descripcion6"
            className="w-full px-3 py-2 border-black rounded-md focus:outline-none focus:border-blue-500 bg-second"
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="image">Subir Archivo:</label>
          <input
            id="image"
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                setRevisionFile(event.target.files[0]);
              }
            }}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
        </div>
        <button 
          type="submit"
          className="w-full py-2 bg-brown rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Agregar Revision
        </button>
      </form>
    </div>
  );
}
  