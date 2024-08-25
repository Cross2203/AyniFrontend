'use client';
import React, { useEffect, useState } from 'react';
import { fetchHistoriales, fetchExamenesFisicos, fetchRevisionesOrganos } from '@/app/utils/api';
import { Historial, ExamenFisico, RevisionOrgano } from '@/app/ui/components/history-interfaces';
import HistorialEntry from '@/app/ui/components/historial-entry';
import ExamenFisicoEntry from '@/app/ui/components/examen-fisico-entry';
import RevisionOrganoEntry from '@/app/ui/components/revision-organo-entry';

interface PacientePageProps {
  patientId: string;
}

const PacientePage: React.FC<PacientePageProps> = ({ patientId }) => {
  const [historiales, setHistoriales] = useState<Historial[]>([]);
  const [examenesFisicos, setExamenesFisicos] = useState<ExamenFisico[]>([]);
  const [revisionesOrganos, setRevisionesOrganos] = useState<RevisionOrgano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historialesData, examenesFisicosData, revisionesOrganosData] = await Promise.all([
          fetchHistoriales(patientId),
          fetchExamenesFisicos(patientId),
          fetchRevisionesOrganos(patientId),
        ]);

        setHistoriales(historialesData);
        setExamenesFisicos(examenesFisicosData);
        setRevisionesOrganos(revisionesOrganosData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const groupByDate = <T,>(entries: T[], dateField: keyof T) => {
    return entries.reduce((acc, entry) => {
      const date = new Date(entry[dateField] as unknown as string).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {} as { [key: string]: T[] });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const historialesGrouped = groupByDate<Historial>(historiales, 'fecha_creacion');
  const examenesFisicosGrouped = groupByDate<ExamenFisico>(examenesFisicos, 'fecha_examen');
  const revisionesOrganosGrouped = groupByDate<RevisionOrgano>(revisionesOrganos, 'fecha_revision');

  return (
    <div className="w-full max-w-4xl mx-auto bg-second text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl text-orange font-bold mb-4">Historial del Paciente</h1>
      {Object.keys(historialesGrouped).map(date => (
        <div key={date}>
          <h2 className="text-2xl font-semibold my-2">Historial del {date}</h2>
          {historialesGrouped[date].map(entry  => (
            <HistorialEntry key={entry.id_historial} entry={entry} />
          ))}
        </div>
      ))}

      <h1 className="text-3xl text-orange font-bold mb-4 mt-8">Exámenes Físicos</h1>
      {Object.keys(examenesFisicosGrouped).map(date => (
        <div key={date}>
          <h2 className="text-2xl font-semibold my-2">Exámenes Físicos del {date}</h2>
          {examenesFisicosGrouped[date].map(examen => (
            <ExamenFisicoEntry key={examen.id_examen} examen={examen} />
          ))}
        </div>
      ))}

      <h1 className="text-3xl text-orange font-bold mb-4 mt-8">Revisiones de Órganos y Sistemas</h1>
      {Object.keys(revisionesOrganosGrouped).map(date => (
        <div key={date}>
          <h2 className="text-2xl font-semibold my-2">Revisiones del {date}</h2>
          {revisionesOrganosGrouped[date].map(revision => (
            <RevisionOrganoEntry key={revision.id_revision} revision={revision} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default function Page({ params }: { params: { patientId: string } }) {
  return <PacientePage patientId={params.patientId} />;
}