import React, { useState } from 'react';
import { ConsultationData, FormData } from '@/app/ui/patients/interfaces';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ConsultationFormProps {
  data: ConsultationData;
  onChange: (formName: keyof FormData, field: keyof ConsultationData, value: string) => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof ConsultationData]?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('consultation', id as keyof ConsultationData, value);
    validateField(id as keyof ConsultationData, value);
  };

  const validateField = (field: keyof ConsultationData, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'fecha_consulta':
        if (!value) error = 'La fecha de consulta es obligatoria.';
        break;
      case 'motivo':
        if (!value) error = 'El motivo de consulta es obligatorio.';
        else if (value.length > 500) error = 'El motivo de consulta no debe exceder los 500 caracteres.';
        break;
      case 'notas_medicas':
        if (value.length > 1000) error = 'Las notas médicas no deben exceder los 1000 caracteres.';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const renderInput = (id: keyof ConsultationData, label: string, type: 'input' | 'textarea' = 'input') => (
    <div className="mb-4">
      <label className="block mb-1" htmlFor={id}>
        {label}:
      </label>
      {type === 'input' ? (
        <input
          type={id === 'fecha_consulta' ? 'date' : 'text'}
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
        <h2 className="text-2xl font-bold text-orange">Datos de la consulta</h2>
        {isVisible ? <ChevronUp className="text-orange" /> : <ChevronDown className="text-orange" />}
      </div>
      {isVisible && (
        <form className="mt-4">
          {renderInput('fecha_consulta', 'Fecha de consulta')}
          {renderInput('motivo', 'Motivo de consulta', 'textarea')}
          {renderInput('notas_medicas', 'Notas médicas', 'textarea')}
        </form>
      )}
    </div>
  );
};

export default ConsultationForm;