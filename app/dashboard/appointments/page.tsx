'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Badge, ConfigProvider, Modal, Form, Input, Select, Button, message } from 'antd';
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
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const fetchCitas = useCallback(async (fecha: string) => {
    setLoading(true);
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
      message.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const formattedDate = selectedDate.format('YYYY-MM-DD');
    fetchCitas(formattedDate);
  }, [selectedDate, fetchCitas]);

  const handleAddCita = () => {
    router.push('/dashboard/appointments/add');
  };

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const citasForDate = citas.filter(cita => dayjs(cita.fecha_hora).format('YYYY-MM-DD') === dateStr);

    return (
      <div className="relative h-full">
        {citasForDate.length > 0 && (
          <Badge
            count={citasForDate.length}
            style={{ backgroundColor: '#FDAC4A', color: '#1A2633' }}
            className="absolute top-1 right-1"
          />
        )}
      </div>
    );
  };

  const showEditModal = (cita: Cita) => {
    setSelectedCita(cita);
    form.setFieldsValue({
      fecha_hora: dayjs(cita.fecha_hora).format('YYYY-MM-DDTHH:mm'),
      motivo: cita.motivo,
      estado: cita.estado,
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedCita) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/${selectedCita.id_cita}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            fecha_hora: dayjs(values.fecha_hora).format('YYYY-MM-DDTHH:mm:ss'),
            paciente: selectedCita.paciente,
          }),
        });

        if (!response.ok) {
          throw new Error('Error updating appointment');
        }

        message.success('Cita actualizada con éxito');
        setModalVisible(false);
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        fetchCitas(formattedDate);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error al actualizar la cita');
    }
  };

  const handleDelete = async () => {
    if (selectedCita) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/citas/${selectedCita.id_cita}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error deleting appointment');
        }

        message.success('Cita eliminada con éxito');
        setModalVisible(false);
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        fetchCitas(formattedDate);
      } catch (error) {
        console.error('Error:', error);
        message.error('Error al eliminar la cita');
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: '#1A2633',
          colorTextBase: '#FFFFFF',
          colorPrimary: '#FDAC4A',
          colorBgContainer: '#334D66',
        },
      }}
    >
      <div className="max-w-7xl mx-auto p-4 bg-[#1A2633] min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <h2 className="font-bold text-3xl mb-6 text-[#FDAC4A]">Citas</h2>
            <Calendar
              value={selectedDate}
              onSelect={onSelect}
              fullscreen={false}
              cellRender={dateCellRender}
              className="bg-[#334D66] rounded-lg shadow-md p-4"
            />
            <button
              onClick={handleAddCita}
              className="mt-4 w-full bg-[#FDAC4A] hover:bg-[#FFC77D] text-[#1A2633] font-bold py-2 px-4 rounded transition duration-300"
            >
              Agregar Cita
            </button>
          </div>
          <div className="lg:w-1/2">
            <h3 className="font-bold text-2xl mb-4 text-[#FDAC4A]">Citas para {selectedDate.format('DD/MM/YYYY')}</h3>
            <div className="bg-[#334D66] rounded-lg shadow-md p-4">
              {loading ? (
                <p className="text-white">Cargando citas...</p>
              ) : citas.length > 0 ? (
                <ul className="space-y-4">
                  {citas.map((cita) => (
                    <li key={cita.id_cita} className="border-b border-gray-600 pb-4 last:border-b-0 hover:bg-[#3D5A7A] p-3 rounded-lg transition duration-300 cursor-pointer" onClick={() => showEditModal(cita)}>
                      <p className="font-bold text-lg text-[#FDAC4A]">
                        {formatInTimeZone(new Date(cita.fecha_hora), 'Etc/GMT', 'HH:mm')} - {formatInTimeZone(new Date(cita.fecha_hora), 'Etc/GMT-1', 'HH:mm')}
                      </p>
                      <p className="text-white"><strong>Paciente:</strong> {cita.nombre_paciente}</p>
                      {cita.motivo && <p className="text-white"><strong>Motivo:</strong> {cita.motivo}</p>}
                      <p className="text-white"><strong>Estado:</strong> {cita.estado}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white">No hay citas para la fecha seleccionada.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={<span className="text-[#FDAC4A]">Editar Cita</span>}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="delete" danger onClick={handleDelete}>
            Eliminar
          </Button>,
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Guardar
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fecha_hora" label="Fecha y Hora" rules={[{ required: true }]}>
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="motivo" label="Motivo">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Confirmada">Confirmada</Select.Option>
              <Select.Option value="Pendiente">Pendiente</Select.Option>
              <Select.Option value="Cancelada">Cancelada</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}