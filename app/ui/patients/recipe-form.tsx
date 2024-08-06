import React, { useState } from 'react';
import { RecipeData, FormData } from '@/app/ui/patients/interfaces';

interface RecipeFormProps {
  data: RecipeData;
  onChange: (formName: keyof FormData, field: keyof RecipeData, value: string) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('recipe', id as keyof RecipeData, value);
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
      <div>
        <div onClick={toggleVisibility}>
          <p className="block mb-4 font-bold text-lg cursor-pointer">
            Receta {isVisible ? '▼' : '▲'}
          </p>
        </div>
        {isVisible && (
          <form>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="fecha_receta">
                Fecha
              </label>
              <input
                type="date"
                id="fecha_receta"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.fecha_receta}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1" htmlFor="medicamentos_recetados">
                Medicamentos Recetados
              </label>
              <textarea
                id="medicamentos_recetados"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 border-black bg-second"
                value={data.medicamentos_recetados}
                onChange={handleInputChange}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
