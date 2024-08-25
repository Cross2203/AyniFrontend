import React, { useState } from 'react';
import { VitalSignsData, FormData } from '@/app/ui/patients/interfaces';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface VitalSignsFormProps {
  data: VitalSignsData;
  onChange: (formName: keyof FormData, field: keyof VitalSignsData, value: string) => void;
}

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof VitalSignsData]?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onChange('vitalSigns', id as keyof VitalSignsData, value);
    validateField(id as keyof VitalSignsData, value);
  };

  const validateField = (field: keyof VitalSignsData, value: string): boolean => {
    let error = '';
    const num = Number(value);

    switch (field) {
      case 'temperatura':
        if (!value) error = 'La temperatura es obligatoria.';
        else if (num < 35 || num > 42) error = 'La temperatura debe estar entre 35°C y 42°C.';
        break;
      case 'presion_arterial_sistolica':
      case 'presion_arterial_diastolica':
        if (!value) error = 'La presión arterial es obligatoria.';
        else if (isNaN(num) || num < 50 || num > 250) error = 'La presión arterial debe estar entre 50 y 250 mmHg.';
        break;
      case 'frecuencia_cardiaca':
        if (isNaN(num) || num < 30 || num > 200) error = 'La frecuencia cardiaca debe estar entre 30 y 200 lpm.';
        break;
      case 'frecuencia_respiratoria':
        if (isNaN(num) || num < 10 || num > 60) error = 'La frecuencia respiratoria debe estar entre 10 y 60 rpm.';
        break;
      case 'peso':
        if (!value) error = 'El peso es obligatorio.';
        else if (isNaN(num) || num < 1 || num > 500) error = 'El peso debe estar entre 1 y 500 kg.';
        break;
      case 'talla':
        if (!value) error = 'La talla es obligatoria.';
        else if (isNaN(num) || num < 30 || num > 250) error = 'La talla debe estar entre 30 y 250 cm.';
        break;
      case 'saturacion_oxigeno':
        if (isNaN(num) || num < 70 || num > 100) error = 'La saturación de oxígeno debe estar entre 70% y 100%.';
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const renderInput = (id: keyof VitalSignsData, label: string, unit: string) => (
    <div className="mb-4">
      <label className="block mb-1" htmlFor={id}>
        {label} ({unit}):
      </label>
      <input
        type="number"
        step="0.1"
        id={id}
        value={data[id]}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 ring-2 ${errors[id] ? 'ring-red-500' : 'ring-orange'} bg-second rounded-md focus:outline-none focus:ring-blue-500`}
      />
      {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
    </div>
  );

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleVisibility}
      >
        <h2 className="text-2xl font-bold text-orange">Signos Vitales</h2>
        {isVisible ? <ChevronUp className="text-orange" /> : <ChevronDown className="text-orange" />}
      </div>
      {isVisible && (
        <form className="mt-4">
          {renderInput('temperatura', 'Temperatura', '°C')}
          <div className="flex space-x-4 mb-4">
            {renderInput('presion_arterial_sistolica', 'Presión arterial sistólica', 'mmHg')}
            {renderInput('presion_arterial_diastolica', 'Presión arterial diastólica', 'mmHg')}
          </div>
          {renderInput('frecuencia_cardiaca', 'Frecuencia cardiaca', 'lpm')}
          {renderInput('frecuencia_respiratoria', 'Frecuencia respiratoria', 'rpm')}
          {renderInput('peso', 'Peso', 'kg')}
          {renderInput('talla', 'Talla', 'cm')}
          {renderInput('saturacion_oxigeno', 'Saturación de oxígeno', '%')}
        </form>
      )}
    </div>
  );
};

export default VitalSignsForm;