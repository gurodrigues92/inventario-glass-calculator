import React from 'react';
import { Calendar, DollarSign, MapPin } from 'lucide-react';
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

interface CalculoCardProps {
  calculo: CalculoSalvo;
}

const CalculoCard = ({ calculo }: CalculoCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-[#E8E2DD] rounded-lg p-6 hover:bg-white transition-colors shadow-sm">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Info do Cliente */}
        <div>
          <h3 className="font-semibold text-lg mb-2" style={{ color: '#2C2C2C' }}>
            {calculo.profile.nome}
          </h3>
          {calculo.profile.email && (
            <p className="text-[#476D9E] text-sm">{calculo.profile.email}</p>
          )}
          {calculo.profile.telefone && (
            <p className="text-[#476D9E] text-sm">{calculo.profile.telefone}</p>
          )}
        </div>

        {/* Dados do Patrimônio */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-[#476D9E] text-sm">Patrimônio</span>
          </div>
          <p className="font-semibold" style={{ color: '#2C2C2C' }}>
            {formatCurrency(calculo.patrimonio)}
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <MapPin className="w-4 h-4 text-secondary" />
            <span className="text-[#476D9E] text-sm">{calculo.estado}</span>
          </div>
        </div>

        {/* Resultado */}
        <div>
          <p className="text-[#476D9E] text-sm mb-2">Custo Total</p>
          <p className="font-semibold text-lg" style={{ color: '#2C2C2C' }}>
            {formatCurrency(calculo.custo_total)}
          </p>
          {calculo.tempo_estimado && (
            <p className="text-[#476D9E] text-sm mt-1">
              {calculo.tempo_estimado}
            </p>
          )}
        </div>

        {/* Data */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#476D9E]" />
            <span className="text-[#476D9E] text-sm">
              {formatDate(calculo.created_at)}
            </span>
          </div>
          
          <span 
            className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(71, 109, 158, 0.1)',
              color: '#476D9E'
            }}
          >
            {calculo.tipo_processo === 'extrajudicial' ? 'Extrajudicial' : 'Judicial'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalculoCard;
