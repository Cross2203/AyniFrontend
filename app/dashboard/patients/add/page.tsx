'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Page() {
  
  const router = useRouter();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [identification, setIdentification] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (identification.length !== 10) {
      newErrors.identification = 'La cédula debe tener 10 dígitos.';
    }
    if (new Date(birthdate) > new Date()) {
      newErrors.birthdate = 'La fecha de nacimiento no puede ser posterior a la fecha actual.';
    }
    if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'El email debe ser valido.';
    }
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
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL)

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    let image_url = '';
    if (imageFile) {
      const filename = `${identification}-face`;
      image_url = await uploadImageToS3(imageFile, filename);
    } else {
      image_url = gender === 'M' ? 'default-male.png' : 'default-female.png';
      image_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-file/patient-faces/${image_url}`;
    }
    const data = {
      name,
      lastname,
      identification,
      birthdate,
      gender,
      address,
      phone,
      email,
      image_url,
    };
    const JSONdata = JSON.stringify(data);
    console.log(JSONdata);
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error('Error al agregar paciente, revise los datos ingresados');
    } 
    else {
    alert('Paciente agregado con exito');
    router.push('/dashboard/patients/list');
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 rounded-md shadow-md text-orange">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="name">Nombre:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="lastname">Apellido:</label>
          <input
            id="lastname"
            type="text"
            value={lastname}
            onChange={(event) => setLastname(event.target.value)}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="identification">Cedula:</label>
          <input
            id="identification"
            type="text"
            value={identification}
            onChange={(event) => setIdentification(event.target.value)}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
          {errors.identification && <p className="text-red-500">{errors.identification}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="birthdate">Fecha de Nacimiento:</label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(event) => setBirthdate(event.target.value)}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
          {errors.birthdate && <p className="text-red-500">{errors.birthdate}</p>}
        </div>
        <div className="mb-4">
        <label className="block mb-1" htmlFor="gender">Genero:</label>
          <select
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          >
            <option value="">Seleccione</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>

        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="address">Direccion:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="phone">Telefono:</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onBlur={handleBlur}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="image">Subir Imagen:</label>
          <input
            id="image"
            type="file"
            onChange={(event) => {
              if (event.target.files) {
                setImageFile(event.target.files[0]);
              }
            }}
            className="w-full px-3 py-2 border bg-second rounded-md focus:outline-none border-black focus:border-blue-500 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
        >
          Submit
        </button>
      </form>
    </div>
  );  

}