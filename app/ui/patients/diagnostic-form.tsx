import React, { useState } from 'react';
import { DiagnosticData, FormData } from '@/app/ui/patients/interfaces';

interface DiagnosticFormProps {
  data: DiagnosticData;
  onChange: (formName: keyof FormData, field: keyof DiagnosticData, value: string) => void;
}


export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('diagnostic', id as keyof DiagnosticData, value);
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }
  return (
    <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
      <div>
        <div onClick={toggleVisibility}>
          <p className="block mb-4 font-bold text-lg cursor-pointer">
          Diagnostico {isVisible ? '▼' : '▲'}
          </p>
        </div>
        {isVisible && (
        <form>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="nombre">
              Diagnostico 
            </label>
            <input
              type="text"
              id="nombre"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second "
              value={data.nombre}
              onChange={handleInputChange}
            />
          </div>
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
        </form>
        )}
      </div>
    </div>
  );
}