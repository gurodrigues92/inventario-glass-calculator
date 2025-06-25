
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface CalculoSalvo {
  id: string;
  patrimonio: number;
  estado: string;
  tipo_processo: string;
  custo_total: number;
  tempo_estimado: string;
  created_at: string;
  profile: {
    nome: string;
    email?: string;
    telefone?: string;
  };
}

interface SummarySectionProps {
  calculos: CalculoSalvo[];
}

const SummarySection = ({ calculos }: SummarySectionProps) => {
  if (calculos.length === 0) return null;

  const totalPatrimonio = calculos.reduce((sum, calc) => sum + calc.patrimonio, 0);
  const totalCustos = calculos.reduce((sum, calc) => sum + calc.custo_total, 0);

  return (
    <div className="mt-8 bg-white/95 backdrop-blur-sm border border-[#E8E2DD] rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold mb-4" style={{ color: '#2C2C2C' }}>Resumo</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-[#476D9E] text-sm">Total de Cálculos</p>
          <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>{calculos.length}</p>
        </div>
        <div>
          <p className="text-[#476D9E] text-sm">Patrimônio Total Calculado</p>
          <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>
            {formatCurrency(totalPatrimonio)}
          </p>
        </div>
        <div>
          <p className="text-[#476D9E] text-sm">Custos Totais Calculados</p>
          <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>
            {formatCurrency(totalCustos)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
