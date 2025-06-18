
import React from 'react';

interface TipoProcessoSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TipoProcessoSelector = ({ value, onChange }: TipoProcessoSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Tipo de processo desejado *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('extrajudicial')}
          className={`p-4 rounded-lg border transition-all ${
            value === 'extrajudicial'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-glass-border bg-glass-white'
          }`}
        >
          <div className="font-medium text-white">Extrajudicial</div>
          <div className="text-sm text-glass">60-120 dias</div>
          <div className="text-xs text-green-400">Mais econômico</div>
        </button>
        <button
          type="button"
          onClick={() => onChange('judicial')}
          className={`p-4 rounded-lg border transition-all ${
            value === 'judicial'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-glass-border bg-glass-white'
          }`}
        >
          <div className="font-medium text-white">Judicial</div>
          <div className="text-sm text-glass">3-8 anos</div>
          <div className="text-xs text-orange-400">Processo tradicional</div>
        </button>
      </div>
    </div>
  );
};

export default TipoProcessoSelector;
