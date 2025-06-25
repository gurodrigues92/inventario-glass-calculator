
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CalculosHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-[#476D9E] hover:text-[#0C2C45] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        
        <h1 className="text-3xl font-bold" style={{ color: '#2C2C2C' }}>
          Cálculos Salvos
        </h1>
      </div>
    </div>
  );
};

export default CalculosHeader;
