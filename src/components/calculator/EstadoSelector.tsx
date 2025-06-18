
import React from 'react';
import { ESTADOS_DATA, getAliquotaDisplay } from '../../data/estadosData';

interface EstadoSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EstadoSelector = ({ value, onChange }: EstadoSelectorProps) => {
  const estadosOptions = Object.values(ESTADOS_DATA).map(estado => ({
    value: estado.uf,
    label: `${estado.nome} - ${getAliquotaDisplay(estado.uf)}`
  }));

  return (
    <div>
      <label className="luxury-label">
        Estado onde será feito o inventário *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="luxury-select w-full"
        required
      >
        {estadosOptions.map(estado => (
          <option key={estado.value} value={estado.value}>
            {estado.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-glass mt-1">
        Alíquotas atualizadas para 2025 - algumas são progressivas
      </p>
    </div>
  );
};

export default EstadoSelector;
