import React, { useState } from 'react';
import { ExamenFisico } from '@/app/ui/components/history-interfaces';

const tiposExamen = [
  { id: 1, nombre: 'PIEL - FANERAS' },
  { id: 2, nombre: 'CABEZA' },
  { id: 3, nombre: 'OJOS' },
  { id: 4, nombre: 'OIDOS' },
  { id: 5, nombre: 'NARIZ' },
  { id: 6, nombre: 'BOCA' },
  { id: 7, nombre: 'ORO FARINGE' },
  { id: 8, nombre: 'CUELLO' },
  { id: 9, nombre: 'AXILAS - MAMAS' },
  { id: 10, nombre: 'TÓRAX' },
  { id: 11, nombre: 'ABDOMEN' },
  { id: 12, nombre: 'COLUMNA VERTEBRAL' },
  { id: 13, nombre: 'INGLE-PERINÉ' },
  { id: 14, nombre: 'MIEMBROS SUPERIORES' },
  { id: 15, nombre: 'MIEMBROS INFERIORES' },
  { id: 16, nombre: 'ÓRGANOS DE LOS SENTIDOS' },
  { id: 17, nombre: 'RESPIRATORIO' },
  { id: 18, nombre: 'CARDIO VASCULAR' },
  { id: 19, nombre: 'DIGESTIVO' },
  { id: 20, nombre: 'GENITAL' },
  { id: 21, nombre: 'URINARIO' },
  { id: 22, nombre: 'MÚSCULO ESQUELÉTICO' },
  { id: 23, nombre: 'ENDOCRINO' },
  { id: 24, nombre: 'HEMO LINFÁTICO' },
  { id: 25, nombre: 'NEUROLÓGICO' },
];

interface ExamenFisicoEntryProps {
  examen: ExamenFisico;
}

const ExamenFisicoEntry: React.FC<ExamenFisicoEntryProps> = ({ examen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNombreArea = (tipoArea: number) => {
    const area = tiposExamen.find(tipo => tipo.id === tipoArea);
    return area ? area.nombre : 'Área no especificada';
  };

  return (
    <div className="border rounded-lg p-4 my-4 shadow-lg">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer bg-green-500 text-white p-2 rounded-md text-lg font-semibold"
      >
        Examen del {new Date(examen.fecha_examen).toLocaleDateString()}
      </div>
      {isExpanded && (
        <div className="mt-4">
          <p className="font-medium">Área: {getNombreArea(examen.tipo_area)}</p>
          {examen.descripcion && <p className="mt-2">Descripción: {examen.descripcion}</p>}
          {examen.url_examen && examen.url_examen.trim() !== "null" && (
            <a href={examen.url_examen} className="text-blue-500 underline mt-2 block">Ver examen</a>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamenFisicoEntry;