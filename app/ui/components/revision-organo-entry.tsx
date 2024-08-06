import React, { useState } from 'react';
import { RevisionOrgano } from '@/app/ui/components/history-interfaces';

interface RevisionOrganoEntryProps {
  revision: RevisionOrgano;
}

const RevisionOrganoEntry: React.FC<RevisionOrganoEntryProps> = ({ revision }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
          {revision.descripcion && <p>Descripción: {revision.descripcion}</p>}
          {revision.url_revision && revision.url_revision.trim() !== "null" && (
            <a href={revision.url_revision} className="text-blue-500 underline">Ver revisión</a>
          )}
        </div>
      )}
    </div>
  );
};

export default RevisionOrganoEntry;