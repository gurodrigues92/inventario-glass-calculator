
import React from 'react';

interface InformacoesAdicionaisProps {
  temTestamento: boolean;
  temMenoresIncapazes: boolean;
  temLitigio: boolean;
  onToggle: (field: string, value: boolean) => void;
}

const InformacoesAdicionais = ({ 
  temTestamento, 
  temMenoresIncapazes, 
  temLitigio, 
  onToggle 
}: InformacoesAdicionaisProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Informações Adicionais</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={temTestamento}
            onChange={(e) => onToggle('temTestamento', e.target.checked)}
            className="rounded border-glass-border"
          />
          <span className="text-sm text-white">Existe testamento válido</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={temMenoresIncapazes}
            onChange={(e) => onToggle('temMenoresIncapazes', e.target.checked)}
            className="rounded border-glass-border"
          />
          <span className="text-sm text-white">Há herdeiros menores ou incapazes</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={temLitigio}
            onChange={(e) => onToggle('temLitigio', e.target.checked)}
            className="rounded border-glass-border"
          />
          <span className="text-sm text-white">Possibilidade de litígio entre herdeiros</span>
        </label>
      </div>
    </div>
  );
};

export default InformacoesAdicionais;
