'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  id_patient: string;
  name: string;
  lastname: string;
  identification: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  image_url: string;
}

const loadPatients = async (params: { patientId: string }): Promise<Patient> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/${params.patientId}/`
  );
  const patient = await response.json();
  return patient;
};

export default function Page({ params }: { params: { patientId: string } }) {
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [identification, setIdentification] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadPatients(params).then((data: Patient) => {
      setPatient(data);
      setName(data.name);
      setLastname(data.lastname);
      setIdentification(data.identification);
      setBirthdate(data.birthdate);
      setGender(data.gender);
      setAddress(data.address);
      setPhone(data.phone);
      setEmail(data.email);
      setImageUrl(data.image_url);
    });
  }, [params]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!/^\d{10}$/.test(identification)) {
      newErrors.identification = 'La cédula debe tener exactamente 10 dígitos.';
    }
    
    const birthDate = new Date(birthdate);
    const today = new Date();
    if (birthDate > today) {
      newErrors.birthdate = 'La fecha de nacimiento no puede ser posterior a la fecha actual.';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Por favor, ingrese un email válido.';
    }

    if (!/^\d{7,10}$/.test(phone)) {
      newErrors.phone = 'El número de teléfono debe tener entre 7 y 10 dígitos.';
    }
    
    ['name', 'lastname', 'identification', 'birthdate', 'gender', 'address', 'phone', 'email'].forEach(field => {
      if (!(field in errors) && !eval(field)) {
        newErrors[field] = 'Este campo es requerido.';
      }
    });
    
    return newErrors;
  };

  const handleBlur = () => {
    const newErrors = validate();
    setErrors(newErrors);
  };

  const uploadImageToS3 = async (file: File, filename: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/patient-faces/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir la imagen');
    }

    const data = await response.json();
    return data.url;
  };

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let updatedImageUrl = imageUrl;
    if (newImageFile) {
      const filename = `${identification}-face`;
      updatedImageUrl = await uploadImageToS3(newImageFile, filename);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/${params.patientId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            lastname,
            identification,
            birthdate,
            gender,
            address,
            phone,
            email,
            image_url: updatedImageUrl,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert('Paciente editado con éxito');
        router.back();
      } else {
        console.error('Error al editar el paciente:', data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-second rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-orange text-center">Edición de Paciente</h2>
      <form onSubmit={handleEdit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="name">Nombre:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="lastname">Apellido:</label>
            <input
              id="lastname"
              type="text"
              value={lastname}
              onChange={(event) => setLastname(event.target.value)}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
            {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-orange" htmlFor="identification">Cédula:</label>
          <input
            id="identification"
            type="text"
            value={identification}
            onChange={(event) => setIdentification(event.target.value)}
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
              type="date"
              value={birthdate}
              onChange={(event) => setBirthdate(event.target.value)}
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
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            >
              <option value="">Seleccione</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-orange" htmlFor="address">Dirección:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
            required
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-orange" htmlFor="phone">Teléfono:</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
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
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-orange" htmlFor="image">Foto del paciente:</label>
          {imageUrl && (
            <img src={imageUrl} alt="Foto del paciente" className="w-32 h-32 object-cover mb-2 rounded-full" />
          )}
          <input
            id="image"
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                setNewImageFile(event.target.files[0]);
              }
            }}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-orange focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}