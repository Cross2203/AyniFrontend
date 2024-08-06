'use client';
import React, { useState, useEffect } from "react";
import VitalSignsForm from "@/app/ui/patients/vital-signs-form";
import ConsultationForm from "@/app/ui/patients/consultation-form";
import { DiagnosticForm } from "@/app/ui/patients/diagnostic-form";
import { TreatmentForm } from "@/app/ui/patients/treatment-form";
import { RecipeForm } from "@/app/ui/patients/recipe-form";
import { FormData } from "@/app/ui/patients/interfaces";

export default function Page({ params }: { params: { patientId: number } }) {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (formName: keyof FormData, field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [formName]: {
        ...prevData[formName],
        [field]: value
      }
    }));
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
  
    try {
      const vitalSignsResponse = await fetch(urls.vitalSigns, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.vitalSigns),
      });
      console.log(JSON.stringify(formData.vitalSigns));
      const vitalSignsResult = await vitalSignsResponse.json();
      console.log('Vital Signs Response:', vitalSignsResult);
  
      const consultationResponse = await fetch(urls.consultation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.consultation),
      });
      const consultationResult = await consultationResponse.json();
      console.log('Consultation Response:', consultationResult);

      const diagnosticResponse = await fetch(urls.diagnostic, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.diagnostic),
      });
      const diagnosticResult = await diagnosticResponse.json();
      console.log('Diagnostic Response:', diagnosticResult);

      const treatmentResponse = await fetch(urls.treatment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.treatment),
      });
      const treatmentResult = await treatmentResponse.json();
      console.log('Treatment Response:', treatmentResult);

      const recipeResponse = await fetch(urls.recipe, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.recipe),
      });
      const recipeResult = await recipeResponse.json();
      console.log('Recipe Response:', recipeResult);

      const patientResponse = await fetch(urls.paciente, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const patientResult = await patientResponse.json();
      console.log('Patient Response:', patientResult);

      const historialData = {
        paciente: patientResult.id_patient,
        consulta: consultationResult.id_consulta,
        signos_vitales: vitalSignsResult.id_signos,
        diagnostico: diagnosticResult.id_diagnostico,
        tratamiento: treatmentResult.id_tratamiento,
        receta: recipeResult.id_receta,
      };
  
      console.log(JSON.stringify(historialData));
  
      const historialResponse = await fetch(urls.historial, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historialData),
      });
  
      if (historialResponse.ok) {
        const historialResult = await historialResponse.json();
        console.log('Historial Response:', historialResult);
        alert('Datos guardados correctamente');
      } else {
        alert('Error al guardar datos');
      }
  
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('Error al guardar datos');
    }
  };

  return (
  <div className="max-w-6xl mx-auto p-6 rounded-md shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-orange text-center">Datos relevantes de la consulta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <VitalSignsForm data={formData.vitalSigns} onChange={handleChange}/>
        <ConsultationForm data={formData.consultation} onChange={handleChange}/>
        <DiagnosticForm data={formData.diagnostic} onChange={handleChange}/>
        <TreatmentForm data={formData.treatment} onChange={handleChange}/>
        <RecipeForm data={formData.recipe} onChange={handleChange}/>
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