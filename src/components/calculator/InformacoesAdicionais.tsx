
import React from 'react';
import LuxuryField from '@/components/ui/LuxuryField';

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
    <LuxuryField label="Informações Adicionais" icon="📋">
      <div className="grid grid-cols-1 gap-3">
        <label 
          className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(26, 26, 26, 0.4)',
            border: '1px solid rgba(133, 149, 171, 0.2)',
            borderRadius: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
            e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(133, 149, 171, 0.2)';
            e.currentTarget.style.background = 'rgba(26, 26, 26, 0.4)';
          }}
        >
          <input
            type="checkbox"
            checked={temTestamento}
            onChange={(e) => onToggle('temTestamento', e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-500 bg-transparent checked:bg-yellow-400 checked:border-yellow-400 transition-all duration-200"
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(133, 149, 171, 0.4)',
              borderRadius: '4px',
              background: temTestamento ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
              borderColor: temTestamento ? '#FFD700' : 'rgba(133, 149, 171, 0.4)'
            }}
          />
          <span className="text-sm text-white">Existe testamento válido</span>
        </label>
        
        <label 
          className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(26, 26, 26, 0.4)',
            border: '1px solid rgba(133, 149, 171, 0.2)',
            borderRadius: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
            e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(133, 149, 171, 0.2)';
            e.currentTarget.style.background = 'rgba(26, 26, 26, 0.4)';
          }}
        >
          <input
            type="checkbox"
            checked={temMenoresIncapazes}
            onChange={(e) => onToggle('temMenoresIncapazes', e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-500 bg-transparent checked:bg-yellow-400 checked:border-yellow-400 transition-all duration-200"
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(133, 149, 171, 0.4)',
              borderRadius: '4px',
              background: temMenoresIncapazes ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
              borderColor: temMenoresIncapazes ? '#FFD700' : 'rgba(133, 149, 171, 0.4)'
            }}
          />
          <span className="text-sm text-white">Há herdeiros menores ou incapazes</span>
        </label>
        
        <label 
          className="flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(26, 26, 26, 0.4)',
            border: '1px solid rgba(133, 149, 171, 0.2)',
            borderRadius: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
            e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(133, 149, 171, 0.2)';
            e.currentTarget.style.background = 'rgba(26, 26, 26, 0.4)';
          }}
        >
          <input
            type="checkbox"
            checked={temLitigio}
            onChange={(e) => onToggle('temLitigio', e.target.checked)}
            className="w-5 h-5 rounded border-2 border-gray-500 bg-transparent checked:bg-yellow-400 checked:border-yellow-400 transition-all duration-200"
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(133, 149, 171, 0.4)',
              borderRadius: '4px',
              background: temLitigio ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent',
              borderColor: temLitigio ? '#FFD700' : 'rgba(133, 149, 171, 0.4)'
            }}
          />
          <span className="text-sm text-white">Possibilidade de litígio entre herdeiros</span>
        </label>
      </div>
    </LuxuryField>
  );
};

export default InformacoesAdicionais;
