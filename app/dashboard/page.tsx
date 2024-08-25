'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/authcontext';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './custom-calendar.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Interfaces para los tipos de datos
interface Appointment {
  id_cita: number;
  fecha_hora: string;
  motivo: string;
  estado: string;
  paciente: number;
}

interface Patient {
  id_patient: number;
  name: string;
  lastname: string;
}

interface Consultation {
  id_consulta: number;
  fecha: string;
  motivo: string;
  paciente: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patientStats, setPatientStats] = useState({ total: 0, new: 0, active: 0 });
  const [appointmentStats, setAppointmentStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch appointments
      const appointmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/`);
      const appointmentsData = await appointmentsResponse.json();
      setAppointments(appointmentsData);

      // Fetch patients
      const patientsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/`);
      const patientsData = await patientsResponse.json();
      setPatients(patientsData);

      // Fetch consultations
      const consultationsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultas/`);
      const consultationsData = await consultationsResponse.json();
      setConsultations(consultationsData);

      // Calculate stats
      setPatientStats({
        total: patientsData.length,
        new: patientsData.filter((p: Patient) => new Date(p.id_patient).getMonth() === new Date().getMonth()).length,
        active: patientsData.filter((p: Patient) => consultationsData.some((c: Consultation) => c.paciente === p.id_patient)).length
      });

      setAppointmentStats({
        total: appointmentsData.length,
        pending: appointmentsData.filter((a: Appointment) => a.estado === 'pendiente').length,
        completed: appointmentsData.filter((a: Appointment) => a.estado === 'completada').length
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasAppointment = appointments.some(appointment => appointment.fecha_hora.split('T')[0] === dateStr);
      return hasAppointment ? <div className="highlight"></div> : null;
    }
    return null;
  };

  const getAppointmentChartData = () => {
    const lastSixMonths = Array.from({length: 6}, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    return lastSixMonths.map(month => ({
      month,
      appointments: appointments.filter(a => new Date(a.fecha_hora).toLocaleString('default', { month: 'short' }) === month).length
    }));
  };

  return (
    <div className="p-6 bg-second">
      <h1 className="text-3xl font-bold mb-6 text-orange">Dashboard Médico</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total: {patientStats.total}</p>
            <p>Nuevos este mes: {patientStats.new}</p>
            <p>Activos: {patientStats.active}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total: {appointmentStats.total}</p>
            <p>Pendientes: {appointmentStats.pending}</p>
            <p>Completadas: {appointmentStats.completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {appointments.slice(0, 3).map(appointment => (
                <li key={appointment.id_cita}>
                  {new Date(appointment.fecha_hora).toLocaleDateString()} - {appointment.motivo}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendario de Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              tileContent={tileContent}
              className="react-calendar"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getAppointmentChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="appointments" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients">
        <TabsList>
          <TabsTrigger value="patients">Pacientes Recientes</TabsTrigger>
          <TabsTrigger value="consultations">Últimas Consultas</TabsTrigger>
        </TabsList>
        <TabsContent value="patients">
          <Card>
            <CardContent>
              <ul>
                {patients.slice(0, 5).map(patient => (
                  <li key={patient.id_patient}>{patient.name} {patient.lastname}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="consultations">
          <Card>
            <CardContent>
              <ul>
                {consultations.slice(0, 5).map(consultation => (
                  <li key={consultation.id_consulta}>
                    {new Date(consultation.fecha).toLocaleDateString()} - {consultation.motivo}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;