'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Patient {
  id_patient: string;
  name: string;
  lastname: string;
  birthdate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
}

const loadPatients = async (params: {
  patientId: string;
}): Promise<Patient> => {
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
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadPatients(params).then((data: Patient) => {
      setPatient(data);
      setName(data.name);
      setLastname(data.lastname);
      setBirthdate(data.birthdate);
      setGender(data.gender);
      setAddress(data.address);
      setPhone(data.phone);
      setEmail(data.email);
    });

  }, [params]);
  

  console.log(name);
  const handleEdit = async () => {
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
            birthdate,
            gender,
            address,
            phone,
            email,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert('Paciente editado con exito');
        router.back();
      } else {
        console.error('Error al editar el paciente:', data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-contrast1 rounded-md shadow-md">
      <form onSubmit={handleEdit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="lastname">Lastname:</label>
          <input
            id="lastname"
            type="text"
            value={lastname}
            onChange={(event) => setLastname(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="birthdate">Birthdate:</label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(event) => setBirthdate(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
        <label className="block mb-1" htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          >
            <option value="">Seleccione</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="phone">Phone:</label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-gradient4 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
        <button
          type="button"
          className="w-full mt-5 py-2 bg-gradient4 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={() => router.back()}
        >
          Cancel
        </button>

      </form>
    </div>
  );  

}