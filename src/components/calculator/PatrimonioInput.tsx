
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="space-y-3">
      <Label 
        htmlFor="patrimonio" 
        className="label-luxury"
        style={{
          color: '#c2cad5',
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        💰 Valor do Patrimônio
        <div 
          style={{
            height: '1px',
            flex: '1',
            background: 'linear-gradient(to right, rgba(255, 215, 0, 0.3), transparent)'
          }}
        />
      </Label>
      
      <Input
        id="patrimonio"
        type="text"
        placeholder="R$ 0"
        value={value}
        onChange={handleChange}
        className="glass-input text-lg font-semibold"
        style={{
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(133, 149, 171, 0.3)',
          borderRadius: '12px',
          color: '#e1e5ea',
          padding: '20px',
          fontSize: '18px',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
      />
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </p>
      )}
      
      <div className="text-xs text-purple-300 italic">
        💡 Inclui todos os bens: imóveis, veículos, investimentos, etc.
      </div>
    </div>
  );
};

export default PatrimonioInput;
