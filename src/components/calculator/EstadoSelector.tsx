
import React from 'react';
import { ESTADOS_DATA, getAliquotaDisplay } from '../../data/estadosData';
import LuxuryField from '@/components/ui/LuxuryField';

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
    <LuxuryField label="Estado onde será feito o inventário *" icon="📍">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        required
        style={{
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(133, 149, 171, 0.3)',
          borderRadius: '12px',
          color: '#e1e5ea',
          padding: '20px',
          fontSize: '18px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          appearance: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%23FFD700' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 20px center',
          paddingRight: '48px'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(255, 215, 0, 0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(133, 149, 171, 0.3)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {estadosOptions.map(estado => (
          <option 
            key={estado.value} 
            value={estado.value}
            style={{
              background: '#1a1a1a',
              color: '#e1e5ea'
            }}
          >
            {estado.label}
          </option>
        ))}
      </select>
      <div className="text-xs text-purple-300 italic">
        💡 Alíquotas atualizadas para 2025 - algumas são progressivas
      </div>
    </LuxuryField>
  );
};

export default EstadoSelector;
