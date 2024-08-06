'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isBefore, isAfter, addHours } from 'date-fns';

interface Paciente {
  id_patient: string;
  name: string;
  lastname: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

interface Cita {
  id: string;
  fecha_hora: string;
  paciente: string;
  motivo: string;
  estado: string;
}

export default function Page() {
  const router = useRouter();
  const [fechaHora, setFechaHora] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/`);
        if (!response.ok) {
          throw new Error('Error fetching pacientes');
        }
        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        console.error('Error fetching pacientes:', error);
      }
    };

    const fetchCitas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/`);
        if (!response.ok) {
          throw new Error('Error fetching citas');
        }
        const data = await response.json();
        setCitas(data);
      } catch (error) {
        console.error('Error fetching citas:', error);
      }
    };

    fetchPacientes();
    fetchCitas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCitaStart = new Date(fechaHora);
    const newCitaEnd = addHours(newCitaStart, 1);

    for (const cita of citas) {

      const existingCitaStart = addHours(new Date(cita.fecha_hora), 5);
      console.log(existingCitaStart + ' Existente');
      const existingCitaEnd = addHours(existingCitaStart, 6);
      console.log(existingCitaEnd   + ' Existente final');

      if (
        (isBefore(newCitaStart, existingCitaEnd) && isAfter(newCitaStart, existingCitaStart)) ||
        (isBefore(newCitaEnd, existingCitaEnd) && isAfter(newCitaEnd, existingCitaStart)) ||
        (isBefore(existingCitaStart, newCitaEnd) && isAfter(existingCitaStart, newCitaStart)) ||
        (isBefore(existingCitaEnd, newCitaEnd) && isAfter(existingCitaEnd, newCitaStart))
      ) {
        setError('La cita se superpone con una cita existente.');
        return;
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha_hora: fechaHora,
          paciente: pacienteId,
          motivo: motivo,
          estado: estado,
        }),
      });

      if (!response.ok) {
        throw new Error('Error adding cita');
      }

      router.push('/dashboard/appointments');
    } catch (error) {
      console.error('Error adding cita:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Agregar Cita</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fecha y Hora</label>
          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => {
              setFechaHora(e.target.value)}}
            className="w-full p-2 border bg-second border-gray-300 rounded-md"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Paciente</label>
          <select
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            className="w-full p-2 border bg-second border-gray-300 rounded-md"
            required
          >
            <option value="">Selecciona un paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id_patient} value={paciente.id_patient}>
                {paciente.name + ' ' + paciente.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-2 border bg-second border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-2 border bg-second border-gray-300 rounded-md"
            required
          >
            <option value="Confirmada">Confirmada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Agregar Cita
        </button>
      </form>
    </div>
  );
}
