
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShareMenu from './ShareMenu';

interface ResultsActionsProps {
  shareData: {
    total: number;
    patrimonio: number;
    estado: string;
    tipoProcesso: string;
  };
}

const ResultsActions = ({ shareData }: ResultsActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <ShareMenu data={shareData} />
      
      <button 
        onClick={() => navigate('/')}
        className="border border-glass-border text-white px-8 py-3 rounded-lg hover:bg-glass-white transition-all"
      >
        Nova Consulta
      </button>
    </div>
  );
};

export default ResultsActions;
