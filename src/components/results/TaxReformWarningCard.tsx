import React from 'react';
import GlassCard from '../GlassCard';
import { useIsMobile } from '../../hooks/use-mobile';

const TaxReformWarningCard = () => {
  const isMobile = useIsMobile();

  return (
    <GlassCard className="border" style={{ borderColor: 'rgba(243, 156, 18, 0.3)' }}>
      <div className={`flex items-start gap-4 ${isMobile ? 'text-sm' : ''}`}>
        <span className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>⚠️</span>
        <div>
          <h4 
            className={`${isMobile ? 'text-sm' : ''} font-semibold mb-2`}
            style={{ color: '#0C2C45' }}
          >
            Importante: Reforma Tributária 2025
          </h4>
          <p 
            className={isMobile ? 'text-xs' : ''}
            style={{ color: '#476D9E' }}
          >
            A partir de 2025, com a reforma tributária, estes custos podem 
            chegar até o dobro do valor, a depender de cada estado. 
            <strong style={{ color: '#0C2C45' }}> Planeje-se agora!</strong>
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default TaxReformWarningCard;