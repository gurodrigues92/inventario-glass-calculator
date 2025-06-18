
import React from 'react';
import { formatCurrencyInput } from '../../utils/formatters';

interface PatrimonioInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PatrimonioInput = ({ value, onChange }: PatrimonioInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    onChange(formatted);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        Valor Total do Patrimônio *
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="R$ 0,00"
        className="glass-input w-full text-lg"
        required
      />
      <p className="text-xs text-glass mt-1">
        Inclua imóveis, veículos, investimentos e outros bens
      </p>
    </div>
  );
};

export default PatrimonioInput;
