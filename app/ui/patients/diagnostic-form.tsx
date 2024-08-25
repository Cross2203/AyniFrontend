import React, { useState } from 'react';
import { DiagnosticData, FormData } from '@/app/ui/patients/interfaces';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DiagnosticFormProps {
  data: DiagnosticData;
  onChange: (formName: keyof FormData, field: keyof DiagnosticData, value: string) => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof DiagnosticData]?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('diagnostic', id as keyof DiagnosticData, value);
    validateField(id as keyof DiagnosticData, value);
  };

  const validateField = (field: keyof DiagnosticData, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'nombre':
        if (value.length > 100) error = 'El diagnóstico no debe exceder los 100 caracteres.';
        break;
      case 'descripcion':
        if (value.length > 500) error = 'La descripción no debe exceder los 500 caracteres.';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const renderInput = (id: keyof DiagnosticData, label: string, type: 'input' | 'textarea' = 'input') => (
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
        <h2 className="text-2xl font-bold text-orange">Diagnóstico</h2>
        {isVisible ? <ChevronUp className="text-orange" /> : <ChevronDown className="text-orange" />}
      </div>
      {isVisible && (
        <form className="mt-4">
          {renderInput('nombre', 'Diagnóstico')}
          {renderInput('descripcion', 'Descripción', 'textarea')}
        </form>
      )}
    </div>
  );
};