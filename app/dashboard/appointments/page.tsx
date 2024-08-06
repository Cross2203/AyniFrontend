'use client';
import React, { useState, useEffect } from "react";
import { Calendar, Badge, ConfigProvider } from "antd";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';

interface Cita {
  id_cita: number;
  fecha_hora: string;
  paciente: number;
  nombre_paciente: string;
  motivo: string | null;
  estado: string | null;
}

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [citas, setCitas] = useState<Cita[]>([]);
  const router = useRouter();

  const handleAddCita = () => {
    router.push('/dashboard/appointments/add');
  };

  useEffect(() => {
    const fetchCitas = async (fecha: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/por-fecha/?fecha=${fecha}`);
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();

        const citasWithNames = await Promise.all(data.map(async (cita: Cita) => {
          const pacienteResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/${cita.paciente}`);
          if (!pacienteResponse.ok) {
            throw new Error('Error fetching patient data');
          }
          const pacienteData = await pacienteResponse.json();
          return { ...cita, nombre_paciente: pacienteData.name + ' ' + pacienteData.lastname };
        }));

        setCitas(citasWithNames);
      } catch (error) {
        console.error('Error fetching citas:', error);
      }
    };

    const formattedDate = selectedDate.format('YYYY-MM-DD');
    fetchCitas(formattedDate);
  }, [selectedDate]);

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const citasForDate = citas.filter(cita => dayjs(cita.fecha_hora).format('YYYY-MM-DD') === dateStr);

    return (
      <div style={{ position: 'relative', height: '100%' }}>
        {citasForDate.length > 0 && <Badge status="success" style={{ position: 'absolute', top: 5, right: 5 }} />}
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: '#FDAC4A',
          colorTextBase: '#FFFFFF',
          colorPrimary: '#FDAC4A',
          colorBgContainer: '#334D66',
        },
      }}
    >
      <div className="max-w-6xl mx-auto w-full flex items-center h-full">
        <button
          onClick={handleAddCita}
          className="fixed top-12 right-15 z-50 bg-button1 hover:bg-button1alt font-bold py-2 px-4 rounded"
        >
          Agregar Cita
        </button>
        <div className="max-w-lg  text-center mx-auto calendar-container">
          <p className="font-bold text-3xl my-4 ml-10">Citas</p>
          <Calendar
            value={selectedDate}
            onSelect={onSelect}
            fullscreen={false}
            className="mt-20"
          />
        </div>
        <div className="mt-4 ml-10 w-full citas-list">
          {citas.length > 0 ? (
            <ul>
              {citas.map((cita) => (
                <li key={cita.id_cita} className="border p-4 mb-4 rounded-md shadow-sm">
                  <p className="font-bold">
                    {formatInTimeZone(new Date(cita.fecha_hora), 'Etc/GMT', 'HH:mm')} - {formatInTimeZone(new Date(cita.fecha_hora), 'Etc/GMT-1', 'HH:mm')}
                  </p>
                  <p className="mt-1"><strong>Paciente: </strong> {cita.nombre_paciente}</p>
                  {cita.motivo && <p className="mt-1"><strong>Motivo:</strong> {cita.motivo}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay citas para la fecha seleccionada.</p>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
