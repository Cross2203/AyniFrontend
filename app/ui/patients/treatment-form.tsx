import React, { useState } from 'react';
import { TreatmentData, FormData } from '@/app/ui/patients/interfaces';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TreatmentFormProps {
  data: TreatmentData;
  onChange: (formName: keyof FormData, field: keyof TreatmentData, value: string) => void;
}

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof TreatmentData]?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('treatment', id as keyof TreatmentData, value);
    validateField(id as keyof TreatmentData, value);
  };

  const validateField = (field: keyof TreatmentData, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'descripcion':
        if (value.length > 500) {
          error = 'La descripción no debe exceder los 500 caracteres.';
        }
        break;
      case 'duracion':
        if (value.length > 100) {
          error = 'La duración no debe exceder los 100 caracteres.';
        }
        break;
      case 'dosis':
        if (value.length > 100) {
          error = 'La dosis no debe exceder los 100 caracteres.';
        }
        break;
      case 'frecuencia':
        if (value.length > 100) {
          error = 'La frecuencia no debe exceder los 100 caracteres.';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const renderInput = (id: keyof TreatmentData, label: string, type: 'input' | 'textarea' = 'input') => (
    <div className="mb-4">
      <label className="block mb-1" htmlFor={id}>
        {label}:
      </label>
      {type === 'input' ? (
        <input
          type="text"
          id={id}
          value={data[id]}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 ring-2 ${errors[id] ? 'ring-red-500' : 'ring-orange'} bg-second rounded-md focus:outline-none focus:ring-blue-500`}
        />
      ) : (
        <textarea
          id={id}
          value={data[id]}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 ring-2 ${errors[id] ? 'ring-red-500' : 'ring-orange'} bg-second rounded-md focus:outline-none focus:ring-blue-500`}
          rows={4}
        />
      )}
      {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleVisibility}
      >
        <h2 className="text-2xl font-bold text-orange">Tratamiento</h2>
        {isVisible ? <ChevronUp className="text-orange" /> : <ChevronDown className="text-orange" />}
      </div>
      {isVisible && (
        <form className="mt-4">
          {renderInput('descripcion', 'Descripción', 'textarea')}
          {renderInput('duracion', 'Duración')}
          {renderInput('dosis', 'Dosis')}
          {renderInput('frecuencia', 'Frecuencia')}
        </form>
      )}
    </div>
  );
};