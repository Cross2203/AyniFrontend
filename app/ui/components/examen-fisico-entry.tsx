import React, { useState } from 'react';
import { ExamenFisico } from '@/app/ui/components/history-interfaces';

interface ExamenFisicoEntryProps {
  examen: ExamenFisico;
}

const ExamenFisicoEntry: React.FC<ExamenFisicoEntryProps> = ({ examen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          {examen.descripcion && <p>Descripción: {examen.descripcion}</p>}
          {examen.url_examen && examen.url_examen.trim() !== "null" && (
            <a href={examen.url_examen} className="text-blue-500 underline">Ver examen</a>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamenFisicoEntry;