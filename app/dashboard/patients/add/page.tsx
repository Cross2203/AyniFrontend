'use client';
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UploadResult {
  url: string;
  success: boolean;
  message: string;
}

interface FormData {
  name: string;
  lastname: string;
  identification: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

export default function PatientRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastname: '',
    identification: '',
    birthdate: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (!/^\d{10}$/.test(formData.identification)) {
      newErrors.identification = 'La cédula debe tener exactamente 10 dígitos.';
    }
    
    const birthDate = new Date(formData.birthdate);
    const today = new Date();
    if (birthDate > today) {
      newErrors.birthdate = 'La fecha de nacimiento no puede ser posterior a la fecha actual.';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Por favor, ingrese un email válido.';
    }

    if (!/^\d{7,10}$/.test(formData.phone)) {
      newErrors.phone = 'El número de teléfono debe tener entre 7 y 10 dígitos.';
    }
    
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof FormData]) {
        newErrors[key] = 'Este campo es requerido.';
      }
    });
    
    return newErrors;
  }, [formData]);

  const handleBlur = useCallback(() => {
    const newErrors = validate();
    setErrors(newErrors);
  }, [validate]);

  const uploadImageToS3 = useCallback(async (file: File, filename: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL no está definida');
    }

    try {
      const response = await fetch(`${backendUrl}/upload/patient-faces/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw new Error('Error al subir la imagen');
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    setIsLoading(true);
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      let image_url = '';
      if (imageFile) {
        const filename = `${formData.identification}-face`;
        image_url = await uploadImageToS3(imageFile, filename);
      } else {
        image_url = formData.gender === 'M' ? 'default-male.png' : 'default-female.png';
        image_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-file/patient-faces/${image_url}`;
      }

      const patientData = {
        ...formData,
        image_url,
      };

      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al agregar paciente, revise los datos ingresados');
      }

      alert('Paciente agregado con éxito');
      router.push('/dashboard/patients/list');
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-8 bg-second rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-orange text-center">Registro de Paciente</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="name">Nombre:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="lastname">Apellido:</label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-orange" htmlFor="identification">Cédula:</label>
          <input
            id="identification"
            name="identification"
            type="text"
            value={formData.identification}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
            required
          />
          {errors.identification && <p className="text-red-500 text-sm mt-1">{errors.identification}</p>}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="birthdate">Fecha de Nacimiento:</label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
            {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="gender">Género:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            >
              <option value="">Seleccione</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1 text-orange" htmlFor="address">Dirección:</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
            required
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="phone">Teléfono:</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1 text-orange" htmlFor="image">Subir Imagen:</label>
          <input
            id="image"
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                setImageFile(event.target.files[0]);
              }
            }}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
        </div>
  
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Registrando...' : 'Registrar Paciente'}
        </button>
      </form>
    </div>
  );
}