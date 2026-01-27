
import React from 'react';
import { Input } from '@/components/ui/input';
import LuxuryField from '@/components/ui/LuxuryField';

interface PatrimonioInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PatrimonioInput = ({ value, onChange, error }: PatrimonioInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    
    if (inputValue) {
      const numericValue = parseInt(inputValue);
      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue);
      
      onChange(formattedValue);
    } else {
      onChange('');
    }
  };

  return (
    <LuxuryField label="Valor do Patrimônio" icon="💰">
      <Input
        id="patrimonio"
        type="text"
        placeholder="R$ 0"
        value={value}
        onChange={handleChange}
        className="text-base font-medium"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2DD',
          borderRadius: '8px',
          color: '#2C2C2C',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#9FB7D4';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#E8E2DD';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      
      {error && (
        <p className="text-sm flex items-center gap-2" style={{ color: '#E74C3C' }}>
          <span>⚠️</span>
          {error}
        </p>
      )}
      
      <div className="text-xs italic" style={{ color: '#476D9E' }}>
        💡 Inclui todos os bens: imóveis, veículos, investimentos, etc.
      </div>
    </LuxuryField>
  );
};

export default PatrimonioInput;
