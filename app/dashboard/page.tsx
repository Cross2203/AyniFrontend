'use client';
import { useAuth } from '@/app/context/authcontext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logoayni from '@/public/logo.png';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';
import './custom-calendar.css';

interface Cita {
  estado: string;
  fecha_hora: string;
  id_cita: number;
  motivo: string;
  paciente: number;
}

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [proximasCitas, setProximasCitas] = useState(0);
  const [totalHistoriales, setTotalHistoriales] = useState(0);
  const [actividadReciente, setActividadReciente] = useState<string[]>([]);
  const [notificaciones, setNotificaciones] = useState<string[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('');
    } else {
      fetchData();
      console.log("Citas actualizadas:", citas);
    }
  }, [user, loading, router]);

  function getDateInTimezoneOffset(offsetHours: number): string {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localDate = new Date(utc + 3600000 * offsetHours);
    return localDate.toISOString().split('T')[0];
  }
  
  const fechaGMTMinus5 = getDateInTimezoneOffset(-10);

  const fetchData = async () => {
    try {
      const pacientesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/total`);
      const pacientesData = await pacientesResponse.json();
      setTotalPacientes(pacientesData.total);

      const proxCitasResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/por-fecha/?fecha=${fechaGMTMinus5}`);
      const proxCitasData = await proxCitasResponse.json();
      setProximasCitas(proxCitasData.length);

      const citasResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/`);
      const citasData = await citasResponse.json();
      console.log("Citas:", citasData);
      setCitas(citasData.map((cita: any) => ({
        estado: cita.estado,
        fecha_hora: cita.fecha_hora,
        id_cita: cita.id_cita,
        motivo: cita.motivo,
        paciente: cita.paciente,
      })));
      console.log("Citas cargadas:", citas);


  
      const historialesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/historiales/total`);
      const historialesData = await historialesResponse.json();
      setTotalHistoriales(historialesData.total);

      setActividadReciente([
        '- Cita con Juan Pérez el 07/12/2024',
        '- Nueva historia médica agregada para María Gómez',
        '- Cita con Ana López el 06/12/2024',
      ]);

      setNotificaciones([
        '- Recordatorio: Actualizar historial médico de Pedro',
        '- Notificación: Consulta de seguimiento para Laura el 08/12/2024',
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasAppointment = citas.some(cita => {
        const citaDate = new Date(cita.fecha_hora).toISOString().split('T')[0];
        return citaDate === dateStr;
      });
      if (hasAppointment) {
        return <div className="highlight"></div>;
      }
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          <img src={logoayni.src} alt="Logo" className="w-14 h-14" />
        </div>
        <h1 className="text-3xl font-bold">Bienvenido a Ayni</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-second shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Total Pacientes Registrados</h2>
          <p className="text-2xl mb-4">{totalPacientes}</p>
          <Link href="/dashboard/patients/add" className="text-blue-500 hover:underline">Agregar Pacientes</Link>
        </div>
        <div className="bg-second shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Citas Para el dia de hoy</h2>
          <p className="text-2xl mb-4">{proximasCitas}</p>
          <Link href="/dashboard/appointments" className="text-blue-500 hover:underline">Ver Citas</Link>
        </div>
        <div className="bg-second shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Historiales Médicos</h2>
          <p className="text-2xl mb-4">{totalHistoriales}</p>
          <Link href="/dashboard/patients/list" className="text-blue-500 hover:underline">Lista de Pacientes</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-second shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Calendario de Citas</h2>
          <div className="calendar-container">
          <Calendar
            tileContent={tileContent}
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const dateStr = date.toISOString().split('T')[0];
                const hasAppointment = citas.some(cita => {
                  const citaDate = new Date(cita.fecha_hora).toISOString().split('T')[0];
                  return citaDate === dateStr;
                });
                return hasAppointment ? 'tile--hasAppointment' : null;
              }
              return null;
            }}
            view="month"
            className="react-calendar"
          />
          </div>
        </div>
        <div className="bg-second shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <ul className="text-left">
            {actividadReciente.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-second shadow-md rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
        <ul className="text-left">
          {notificaciones.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
