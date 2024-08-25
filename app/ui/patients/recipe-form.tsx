import React, { useState } from 'react';
import { RecipeData, FormData } from '@/app/ui/patients/interfaces';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RecipeFormProps {
  data: RecipeData;
  onChange: (formName: keyof FormData, field: keyof RecipeData, value: string) => void;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({ data, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof RecipeData]?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onChange('recipe', id as keyof RecipeData, value);
    validateField(id as keyof RecipeData, value);
  };

  const validateField = (field: keyof RecipeData, value: string): boolean => {
    let error = '';

    switch (field) {
      case 'medicamentos_recetados':
        if (value.length > 1000) {
          error = 'Los medicamentos recetados no deben exceder los 1000 caracteres.';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const renderInput = (id: keyof RecipeData, label: string, type: 'date' | 'textarea' = 'date') => (
    <div className="mb-4">
      <label className="block mb-1" htmlFor={id}>
        {label}:
      </label>
      {type === 'date' ? (
        <input
          type="date"
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
        <h2 className="text-2xl font-bold text-orange">Receta</h2>
        {isVisible ? <ChevronUp className="text-orange" /> : <ChevronDown className="text-orange" />}
      </div>
      {isVisible && (
        <form className="mt-4">
          {renderInput('fecha_receta', 'Fecha de la receta', 'date')}
          {renderInput('medicamentos_recetados', 'Medicamentos recetados', 'textarea')}
        </form>
      )}
    </div>
  );
};