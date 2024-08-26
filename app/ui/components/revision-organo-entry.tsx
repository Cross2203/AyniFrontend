import React, { useState } from 'react';
import { RevisionOrgano } from '@/app/ui/components/history-interfaces';

const tiposRevision = [
  { id: 1, nombre: 'ÓRGANOS DE LOS SENTIDOS' },
  { id: 2, nombre: 'RESPIRATORIO' },
  { id: 3, nombre: 'CARDIO VASCULAR' },
  { id: 4, nombre: 'DIGESTIVO' },
  { id: 5, nombre: 'GENITAL' },
  { id: 6, nombre: 'URINARIO' },
  { id: 7, nombre: 'MUSCULO ESQUELÉTICO' },
  { id: 8, nombre: 'ENDOCRINO' },
  { id: 9, nombre: 'HEMO LINFÁTICO' },
  { id: 10, nombre: 'NERVIOSO' },
];

interface RevisionOrganoEntryProps {
  revision: RevisionOrgano;
}

const RevisionOrganoEntry: React.FC<RevisionOrganoEntryProps> = ({ revision }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNombreOrgano = (tipoOrgano: number) => {
    const organo = tiposRevision.find(tipo => tipo.id === tipoOrgano);
    return organo ? organo.nombre : 'Órgano no especificado';
  };

  return (
    <div className="border rounded-lg p-4 my-4 shadow-lg">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer bg-purple-500 text-white p-2 rounded-md text-lg font-semibold"
      >
        Revisión del {new Date(revision.fecha_revision).toLocaleDateString()}
      </div>
      {isExpanded && (
        <div className="mt-4">
          <p className="font-medium">Órgano: {getNombreOrgano(revision.tipo_organos)}</p>
          {revision.descripcion && <p className="mt-2">Descripción: {revision.descripcion}</p>}
          {revision.url_revision && revision.url_revision.trim() !== "null" && (
            <a href={revision.url_revision} className="text-blue-500 underline mt-2 block">Ver revisión</a>
          )}
        </div>
      )}
    </div>
  );
};

export default RevisionOrganoEntry;