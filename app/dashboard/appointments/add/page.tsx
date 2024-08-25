'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, isBefore, isAfter, addHours, setHours, setMinutes, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

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
  const [estado, setEstado] = useState('Confirmada');
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

  const validateAppointmentTime = (date: Date) => {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return (hour >= 8 && hour < 18) && (minutes === 0 || minutes === 30);
  };

  const validateFutureDate = (date: Date) => {
    const today = startOfDay(new Date());
    return isAfter(date, today) || format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newCitaStart = new Date(fechaHora);
    const newCitaEnd = addHours(newCitaStart, 1);

    if (!validateFutureDate(newCitaStart)) {
      setError('No se pueden programar citas en fechas pasadas.');
      return;
    }

    if (!validateAppointmentTime(newCitaStart)) {
      setError('Las citas deben ser programadas entre las 8:00 AM y las 6:00 PM, en intervalos de 30 minutos.');
      return;
    }

    for (const cita of citas) {
      const existingCitaStart = new Date(cita.fecha_hora);
      const existingCitaEnd = addHours(existingCitaStart, 1);

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
      setError('Hubo un error al agregar la cita. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[#334D66] rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-[#FDAC4A]">Agregar Nueva Cita</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Fecha y Hora</label>
          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
            className="w-full p-3 bg-[#1A2633] border border-[#FDAC4A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FDAC4A]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Paciente</label>
          <select
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            className="w-full p-3 bg-[#1A2633] border border-[#FDAC4A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FDAC4A]"
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
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full p-3 bg-[#1A2633] border border-[#FDAC4A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FDAC4A]"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-3 bg-[#1A2633] border border-[#FDAC4A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FDAC4A]"
            required
          >
            <option value="Confirmada">Confirmada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        {error && <p className="text-red-500 bg-[#1A2633] p-3 rounded-md">{error}</p>}
        <button
          type="submit"
          className="w-full p-3 bg-[#FDAC4A] text-[#1A2633] rounded-md font-semibold hover:bg-[#FFC77D] transition duration-300"
        >
          Agregar Cita
        </button>
      </form>
    </div>
  );
}