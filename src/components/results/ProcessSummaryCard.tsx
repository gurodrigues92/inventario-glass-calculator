import React from 'react';
import GlassCard from '../GlassCard';
import { useIsMobile } from '../../hooks/use-mobile';

interface ProcessSummaryCardProps {
  formData: any;
}

const ProcessSummaryCard = ({ formData }: ProcessSummaryCardProps) => {
  const isMobile = useIsMobile();

  return (
    <GlassCard>
      <h4 
        className={`${isMobile ? 'text-sm' : ''} font-semibold mb-3 text-center`}
        style={{ color: '#0C2C45' }}
      >
        📋 Resumo do Processo
      </h4>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'md:grid-cols-2 gap-4'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
        <div>
          <span style={{ color: '#476D9E' }}>Estado:</span>
          <span className="ml-2 font-medium" style={{ color: '#0C2C45' }}>{formData.estado}</span>
        </div>
        <div>
          <span style={{ color: '#476D9E' }}>Tipo de Processo:</span>
          <span className="ml-2 font-medium" style={{ color: '#0C2C45' }}>{formData.tipoProcesso}</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProcessSummaryCard;