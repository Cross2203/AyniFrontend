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
      <div className="relative h-full">
        {citasForDate.length > 0 && <Badge status="success" className="absolute top-1 right-1" />}
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
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <h2 className="font-bold text-3xl mb-6">Citas</h2>
            <Calendar
              value={selectedDate}
              onSelect={onSelect}
              fullscreen={false}
              cellRender={dateCellRender}
              className="bg-white rounded-lg shadow-md p-4"
            />
            <button
              onClick={handleAddCita}
              className="mt-4 w-full bg-button1 hover:bg-button1alt text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Agregar Cita
            </button>
          </div>
          <div className="lg:w-1/2">
            <h3 className="font-bold text-2xl mb-4">Citas para {selectedDate.format('DD/MM/YYYY')}</h3>
            <div className="bg-white rounded-lg shadow-md p-4">
              {citas.length > 0 ? (
                <ul className="space-y-4">
                  {citas.map((cita) => (
                    <li key={cita.id_cita} className="border-b pb-4 last:border-b-0">
                      <p className="font-bold text-lg text-gray-800">
                        {formatInTimeZone(new Date(cita.fecha_hora), 'Etc/GMT', 'HH:mm')} - {formatInTimeZone(new Date(cita.fecha_hora), 'Etc/GMT-1', 'HH:mm')}
                      </p>
                      <p className="text-gray-600"><strong>Paciente:</strong> {cita.nombre_paciente}</p>
                      {cita.motivo && <p className="text-gray-600"><strong>Motivo:</strong> {cita.motivo}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No hay citas para la fecha seleccionada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}