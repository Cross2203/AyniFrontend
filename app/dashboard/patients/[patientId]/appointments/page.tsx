'use client';
import React, { useState } from "react";
import VitalSignsForm from "@/app/ui/patients/vital-signs-form";
import ConsultationForm from "@/app/ui/patients/consultation-form";
import { DiagnosticForm } from "@/app/ui/patients/diagnostic-form";
import { TreatmentForm } from "@/app/ui/patients/treatment-form";
import { RecipeForm } from "@/app/ui/patients/recipe-form";
import { FormData } from "@/app/ui/patients/interfaces";

export default function Page({ params }: { params: { patientId: number } }) {
  const initialFormData: FormData = {
    vitalSigns: {
      temperatura: '',
      presion_arterial_sistolica: '',
      presion_arterial_diastolica: '',
      frecuencia_cardiaca: '',
      frecuencia_respiratoria: '',
      peso: '',
      talla: '',
      saturacion_oxigeno: ''
    },
    consultation: {
      fecha_consulta: '',
      motivo: '',
      notas_medicas: '',
    },
    diagnostic: {
      nombre: '',
      descripcion: '',
    },
    treatment: {
      descripcion: '',
      duracion: '',
      dosis: '',
      frecuencia: '',
    },
    recipe: {
      fecha_receta: '',
      medicamentos_recetados: '',
    }
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showTreatment, setShowTreatment] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);

  const handleChange = (formName: keyof FormData, field: string, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [formName]: {
        ...prevData[formName],
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setShowDiagnostic(false);
    setShowTreatment(false);
    setShowRecipe(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const urls = {
      vitalSigns: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signosvitales/`,
      consultation: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultas/`,
      diagnostic: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/diagnosticos/`,
      treatment: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tratamientos/`,
      recipe: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recetas/`,
      historial: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/historiales/`,
      paciente: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pacientes/${params.patientId}/`,
    };

    console.log('URLs configuradas:', urls);
  
    try {
      // Convertir los datos de signos vitales
      const vitalSignsData = {
        temperatura: parseFloat(formData.vitalSigns.temperatura) || null,
        presion_arterial_sistolica: parseInt(formData.vitalSigns.presion_arterial_sistolica, 10) || null,
        presion_arterial_diastolica: parseInt(formData.vitalSigns.presion_arterial_diastolica, 10) || null,
        frecuencia_cardiaca: parseInt(formData.vitalSigns.frecuencia_cardiaca, 10) || null,
        frecuencia_respiratoria: parseInt(formData.vitalSigns.frecuencia_respiratoria, 10) || null,
        peso: parseFloat(formData.vitalSigns.peso) || null,
        talla: parseFloat(formData.vitalSigns.talla) || null,
        saturacion_oxigeno: parseFloat(formData.vitalSigns.saturacion_oxigeno) || null
      };

      console.log('Enviando datos de signos vitales:', vitalSignsData);
      const vitalSignsResponse = await fetch(urls.vitalSigns, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vitalSignsData),
      });
      if (!vitalSignsResponse.ok) {
        console.error('Error en la respuesta de signos vitales:', await vitalSignsResponse.text());
        throw new Error('Error al guardar los signos vitales');
      }
      const vitalSignsResult = await vitalSignsResponse.json();
      console.log('Respuesta de signos vitales:', vitalSignsResult);
  
      console.log('Enviando datos de consulta:', formData.consultation);
      const consultationResponse = await fetch(urls.consultation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.consultation),
      });
      if (!consultationResponse.ok) {
        console.error('Error en la respuesta de consulta:', await consultationResponse.text());
        throw new Error('Error al guardar la consulta');
      }
      const consultationResult = await consultationResponse.json();
      console.log('Respuesta de consulta:', consultationResult);

      let diagnosticResult, treatmentResult, recipeResult;

      if (showDiagnostic) {
        console.log('Enviando datos de diagnóstico:', formData.diagnostic);
        const diagnosticResponse = await fetch(urls.diagnostic, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.diagnostic),
        });
        if (!diagnosticResponse.ok) {
          console.error('Error en la respuesta de diagnóstico:', await diagnosticResponse.text());
          throw new Error('Error al guardar el diagnóstico');
        }
        diagnosticResult = await diagnosticResponse.json();
        console.log('Respuesta de diagnóstico:', diagnosticResult);
      }

      if (showTreatment) {
        console.log('Enviando datos de tratamiento:', formData.treatment);
        const treatmentResponse = await fetch(urls.treatment, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.treatment),
        });
        if (!treatmentResponse.ok) {
          console.error('Error en la respuesta de tratamiento:', await treatmentResponse.text());
          throw new Error('Error al guardar el tratamiento');
        }
        treatmentResult = await treatmentResponse.json();
        console.log('Respuesta de tratamiento:', treatmentResult);
      }

      if (showRecipe) {
        console.log('Enviando datos de receta:', formData.recipe);
        const recipeResponse = await fetch(urls.recipe, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.recipe),
        });
        if (!recipeResponse.ok) {
          console.error('Error en la respuesta de receta:', await recipeResponse.text());
          throw new Error('Error al guardar la receta');
        }
        recipeResult = await recipeResponse.json();
        console.log('Respuesta de receta:', recipeResult);
      }

      console.log('Obteniendo datos del paciente para ID:', params.patientId);
      const patientResponse = await fetch(urls.paciente, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!patientResponse.ok) {
        console.error('Error en la respuesta del paciente:', await patientResponse.text());
        throw new Error('Error al obtener los datos del paciente');
      }
      const patientResult = await patientResponse.json();
      console.log('Respuesta del paciente:', patientResult);

      const historialData = {
        paciente: patientResult.id_patient,
        consulta: consultationResult.id_consulta,
        signos_vitales: vitalSignsResult.id_signos,
        diagnostico: showDiagnostic ? diagnosticResult.id_diagnostico : null,
        tratamiento: showTreatment ? treatmentResult.id_tratamiento : null,
        receta: showRecipe ? recipeResult.id_receta : null,
      };
  
      console.log('Enviando datos del historial:', historialData);
      const historialResponse = await fetch(urls.historial, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historialData),
      });
  
      if (historialResponse.ok) {
        const historialResult = await historialResponse.json();
        console.log('Respuesta del historial:', historialResult);
        alert('Datos guardados correctamente');
        resetForm();  
      } else {
        console.error('Error en la respuesta del historial:', await historialResponse.text());
        throw new Error('Error al guardar el historial');
      }
  
    } catch (error) {
      console.error('Error detallado al enviar datos del formulario:', error);
      alert('Error al guardar datos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const ToggleCheckbox = ({ id, checked, onChange, label }: { id: string, checked: boolean, onChange: (checked: boolean) => void, label: string }) => (
    <div className="flex items-center space-x-2 mb-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-orange bg-gray-100 border-gray-300 rounded focus:ring-orange dark:focus:ring-orange dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-orange text-center">Datos relevantes de la consulta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <VitalSignsForm data={formData.vitalSigns} onChange={handleChange}/>
        <ConsultationForm data={formData.consultation} onChange={handleChange}/>
        
        <ToggleCheckbox
          id="show-diagnostic"
          checked={showDiagnostic}
          onChange={setShowDiagnostic}
          label="Incluir Diagnóstico"
        />
        {showDiagnostic && <DiagnosticForm data={formData.diagnostic} onChange={handleChange}/>}
        
        <ToggleCheckbox
          id="show-treatment"
          checked={showTreatment}
          onChange={setShowTreatment}
          label="Incluir Tratamiento"
        />
        {showTreatment && <TreatmentForm data={formData.treatment} onChange={handleChange}/>}
        
        <ToggleCheckbox
          id="show-recipe"
          checked={showRecipe}
          onChange={setShowRecipe}
          label="Incluir Receta"
        />
        {showRecipe && <RecipeForm data={formData.recipe} onChange={handleChange}/>}
        
        <button 
          type="submit"
          className="w-full py-2 bg-brown rounded-md hover:bg-brownalt focus:outline-none focus:bg-blue-600"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}