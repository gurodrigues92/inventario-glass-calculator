
import React from 'react';
import LuxuryField from '@/components/ui/LuxuryField';

interface TipoProcessoSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TipoProcessoSelector = ({ value, onChange }: TipoProcessoSelectorProps) => {
  return (
    <LuxuryField label="Tipo de processo desejado *" icon="⚖️">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('extrajudicial')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            value === 'extrajudicial'
              ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
          }`}
          style={{
            background: value === 'extrajudicial' 
              ? 'rgba(255, 215, 0, 0.1)'
              : 'rgba(26, 26, 26, 0.7)',
            borderColor: value === 'extrajudicial'
              ? 'rgba(255, 215, 0, 0.5)'
              : 'rgba(133, 149, 171, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 0.3s ease',
            boxShadow: value === 'extrajudicial'
              ? '0 0 20px rgba(255, 215, 0, 0.2)'
              : 'none'
          }}
        >
          <div className="font-medium text-white text-lg mb-2">Extrajudicial</div>
          <div className="text-sm text-gray-300 mb-2">60-120 dias</div>
          <div className="text-xs text-green-400 font-semibold">Mais econômico</div>
        </button>
        <button
          type="button"
          onClick={() => onChange('judicial')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            value === 'judicial'
              ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
          }`}
          style={{
            background: value === 'judicial' 
              ? 'rgba(255, 215, 0, 0.1)'
              : 'rgba(26, 26, 26, 0.7)',
            borderColor: value === 'judicial'
              ? 'rgba(255, 215, 0, 0.5)'
              : 'rgba(133, 149, 171, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 0.3s ease',
            boxShadow: value === 'judicial'
              ? '0 0 20px rgba(255, 215, 0, 0.2)'
              : 'none'
          }}
        >
          <div className="font-medium text-white text-lg mb-2">Judicial</div>
          <div className="text-sm text-gray-300 mb-2">3-8 anos</div>
          <div className="text-xs text-orange-400 font-semibold">Processo tradicional</div>
        </button>
      </div>
    </LuxuryField>
  );
};

export default TipoProcessoSelector;
