import React, { useState } from 'react';
import { VitalSignsData, FormData } from '@/app/ui/patients/interfaces';

interface VitalSignsFormProps {
  data: VitalSignsData;
  onChange: (formName: keyof FormData, field: keyof VitalSignsData, value: string) => void;
}

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof VitalSignsData]?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('vitalSigns', id as keyof VitalSignsData, value);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    validateField(id as keyof VitalSignsData, value);
  };
  const validateField = (field: keyof VitalSignsData, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'temperatura':
        if (!value) {
          error = 'La temperatura es obligatoria.';
        } else if (Number(value) < 35 || Number(value) > 42) {
          error = 'La temperatura debe estar entre 35°C y 42°C.';
        }
        break;
      case 'presion_arterial_sistolica':
      case 'presion_arterial_diastolica':
        if (!value) {
          error = 'La presión arterial es obligatoria.';
        } else if (isNaN(Number(value)) || Number(value) < 50 || Number(value) > 250) {
          error = 'La presión arterial debe estar entre 50 y 250 mmHg.';
        }
        break;
      case 'frecuencia_cardiaca':
        if (isNaN(Number(value)) || Number(value) < 30 || Number(value) > 200) {
          error = 'La frecuencia cardiaca debe estar entre 30 y 200 lpm.';
        }
        break;
      case 'frecuencia_respiratoria':
        if (isNaN(Number(value)) || Number(value) < 10 || Number(value) > 60) {
          error = 'La frecuencia respiratoria debe estar entre 10 y 60 rpm.';
        }
        break;
      case 'peso':
        if (!value) {
          error = 'El peso es obligatorio.';
        } else if (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 500) {
          error = 'El peso debe estar entre 1 y 500 kg.';
        }
        break;
      case 'talla':
        if (!value) {
          error = 'La talla es obligatoria.';
        } else if (isNaN(Number(value)) || Number(value) < 30 || Number(value) > 250) {
          error = 'La talla debe estar entre 30 y 250 cm.';
        }
        break;
      case 'saturacion_oxigeno':
        if (isNaN(Number(value)) || Number(value) < 70 || Number(value) > 100) {
          error = 'La saturación de oxígeno debe estar entre 70% y 100%.';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    return !error;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
      <div>
        <div onClick={toggleVisibility}>
          <p className="block mb-4 font-bold text-lg cursor-pointer">
            Signos Vitales {isVisible ? '▼' : '▲'}
          </p>
        </div>
        {isVisible && (
          <form>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="temperatura">
                Temperatura (°C)
              </label>
              <input
                type="text"
                id="temperatura"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.temperatura}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.temperatura && <p className="text-red-500 text-xs">{errors.temperatura}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="presion_arterial_sistolica">
                Presión arterial sistólica (mmHg)
              </label>
              <input
                type="text"
                id="presion_arterial_sistolica"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.presion_arterial_sistolica}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.presion_arterial_sistolica && <p className="text-red-500 text-xs">{errors.presion_arterial_sistolica}</p>}
              <label className="block mb-1" htmlFor="presion_arterial_diastolica">
                Presión arterial diastólica (mmHg)
              </label>
              <input
                type="text"
                id="presion_arterial_diastolica"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.presion_arterial_diastolica}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.presion_arterial_diastolica && <p className="text-red-500 text-xs">{errors.presion_arterial_diastolica}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="frecuencia_cardiaca">
                Frecuencia cardiaca (lpm)
              </label>
              <input
                type="text"
                id="frecuencia_cardiaca"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.frecuencia_cardiaca}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.frecuencia_cardiaca && <p className="text-red-500 text-xs">{errors.frecuencia_cardiaca}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="frecuencia_respiratoria">
                Frecuencia respiratoria (rpm)
              </label>
              <input
                type="text"
                id="frecuencia_respiratoria"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.frecuencia_respiratoria}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.frecuencia_respiratoria && <p className="text-red-500 text-xs">{errors.frecuencia_respiratoria}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="peso">
                Peso (kg)
              </label>
              <input
                type="text"
                id="peso"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.peso}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.peso && <p className="text-red-500 text-xs">{errors.peso}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="talla">
                Talla (cm)
              </label>
              <input
                type="text"
                id="talla"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.talla}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.talla && <p className="text-red-500 text-xs">{errors.talla}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="saturacion_oxigeno">
                Saturación de oxígeno (%)
              </label>
              <input
                type="text"
                id="saturacion_oxigeno"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.saturacion_oxigeno}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.saturacion_oxigeno && <p className="text-red-500 text-xs">{errors.saturacion_oxigeno}</p>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default VitalSignsForm;
