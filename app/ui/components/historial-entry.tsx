import React, { useState } from 'react';
import { Historial } from '@/app/ui/components/history-interfaces';

interface HistorialEntryProps {
  entry: Historial;
}

const HistorialEntry: React.FC<HistorialEntryProps> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const handleGeneratePDF = async () => {
    const data = { pages: selectedPages };
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/historial/pdf/${entry.id_historial}/`;
    
    console.log('Sending request to:', url);
    console.log('With data:', data);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || 'Unknown error occurred');
      }
  
      const blob = await response.blob();
      const url2 = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url2;
      a.download = `historial_medico_${entry.id_historial}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Aquí puedes agregar alguna notificación al usuario sobre el error
    }
  };

  const handleCheckboxChange = (page: number) => {
    setSelectedPages(prevPages =>
      prevPages.includes(page)
        ? prevPages.filter(p => p !== page)
        : [...prevPages, page]
    );
  };

  return (
    <div className="border rounded-lg p-4 my-4 shadow-lg">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer bg-blue-500 text-white p-2 rounded-md text-lg font-semibold"
      >
        Historial del {new Date(entry.fecha_creacion).toLocaleDateString()}
      </div>
      {isExpanded && (
        <div className="mt-4">
          {entry.consulta && (
            <>
              <h4 className="text-xl font-bold mt-2">Consulta:</h4>
              {entry.consulta.motivo && <p>Motivo: {entry.consulta.motivo}</p>}
              {entry.consulta.notas_medicas && <p>Notas Medicas: {entry.consulta.notas_medicas}</p>}
            </>
          )}
          {entry.signos_vitales && (
            <>
              <h4 className="text-xl font-bold mt-2">Signos Vitales:</h4>
              {entry.signos_vitales.temperatura && <p>Temperatura: {entry.signos_vitales.temperatura} °C</p>}
              {entry.signos_vitales.presion_arterial_sistolica && entry.signos_vitales.presion_arterial_diastolica && (
                <p>Presión Arterial: {entry.signos_vitales.presion_arterial_sistolica}/{entry.signos_vitales.presion_arterial_diastolica}</p>
              )}
              {entry.signos_vitales.frecuencia_cardiaca && <p>Frecuencia Cardiaca: {entry.signos_vitales.frecuencia_cardiaca}</p>}
              {entry.signos_vitales.frecuencia_respiratoria && <p>Frecuencia Respiratoria: {entry.signos_vitales.frecuencia_respiratoria}</p>}
              {entry.signos_vitales.peso && <p>Peso: {entry.signos_vitales.peso} kg</p>}
              {entry.signos_vitales.talla && <p>Talla: {entry.signos_vitales.talla} cm</p>}
              {entry.signos_vitales.saturacion_oxigeno && <p>Saturación de Oxígeno: {entry.signos_vitales.saturacion_oxigeno} %</p>}
            </>
          )}
          {entry.diagnostico && (
            <>
              {entry.diagnostico.nombre || entry.diagnostico.descripcion ? (
                <>
                  <h4 className="text-xl font-bold mt-2">Diagnóstico:</h4>
                  {entry.diagnostico.nombre && <p>Nombre: {entry.diagnostico.nombre}</p>}
                  {entry.diagnostico.descripcion && <p>Descripción: {entry.diagnostico.descripcion}</p>}
                </>
              ) : null}
            </>
          )}
          {entry.tratamiento && (
            <>
            {entry.tratamiento.descripcion || entry.tratamiento.duracion || entry.tratamiento.dosis || entry.tratamiento.frecuencia ? (
              <>
                <h4 className="text-xl font-bold mt-2">Tratamiento:</h4>
                {entry.tratamiento.descripcion && <p>Descripción: {entry.tratamiento.descripcion}</p>}
                {entry.tratamiento.duracion && <p>Duración: {entry.tratamiento.duracion}</p>}
                {entry.tratamiento.dosis && <p>Dosis: {entry.tratamiento.dosis}</p>}
                {entry.tratamiento.frecuencia && <p>Frecuencia: {entry.tratamiento.frecuencia}</p>}
              </>
            ) : null}
            </>
          )}
          {entry.receta && (
            <>
              {entry.receta.medicamentos_recetados ? (
                <>
                  <h4 className="text-xl font-bold mt-2">Receta:</h4>
                  <p>Medicamentos Recetados: {entry.receta.medicamentos_recetados}</p>
                </>
              ) : null}
            </>
          )}
          <div className="mt-4">
            <h4 className="text-lg font-semibold">Selecciona las páginas a generar:</h4>
            <div className="flex flex-col mt-2">
              <label>
                <input
                  type="checkbox"
                  checked={selectedPages.includes(1)}
                  onChange={() => handleCheckboxChange(1)}
                />
                Información general de la consulta
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPages.includes(2)}
                  onChange={() => handleCheckboxChange(2)}
                />
                Revisiones
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPages.includes(3)}
                  onChange={() => handleCheckboxChange(3)}
                />
                Exámenes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPages.includes(4)}
                  onChange={() => handleCheckboxChange(4)}
                />
                Recetas
              </label>
            </div>
          </div>
          <button
            onClick={handleGeneratePDF}
            className="mt-4 bg-red-500 text-white p-2 rounded-md"
          >
            Generar PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default HistorialEntry;
