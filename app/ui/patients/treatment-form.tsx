import React, { useState } from 'react';
import { TreatmentData, FormData } from '@/app/ui/patients/interfaces';

interface TreatmentFormProps {
  data: TreatmentData;
  onChange: (formName: keyof FormData, field: keyof TreatmentData, value: string) => void;
}

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('treatment', id as keyof TreatmentData, value);
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }
  return (
    <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
      <div>
        <div onClick={toggleVisibility}>
          <p className="block mb-4 font-bold text-lg cursor-pointer">
            Tratamiento {isVisible ? '▼' : '▲'}
            </p>
        </div>
        {isVisible && (
        <form>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="descripcion">
              Descripcion
            </label>
            <textarea 
              id="descripcion"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second "
              value={data.descripcion}
              onChange={handleInputChange}
              />
          </div>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="duracion">
              Duracion
            </label>
            <input
              type="text"
              id="duracion"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second "
              value={data.duracion}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="dosis">
              Dosis
            </label>
            <input
              type="text"
              id="dosis"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second "
              value={data.dosis}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="frecuencia">
              Frecuencia
            </label>
            <input
              type="text"
              id="frecuencia"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second "
              value={data.frecuencia}
              onChange={handleInputChange}
            />
          </div>

        </form>
        )}
      </div>
    </div>
  );
}