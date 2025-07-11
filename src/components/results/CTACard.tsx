import React from 'react';
import GlassCard from '../GlassCard';
import { useIsMobile } from '../../hooks/use-mobile';

const CTACard = () => {
  const isMobile = useIsMobile();

  return (
    <GlassCard premium={true} className="text-center">
      <div className="mb-6">
        <h3 
          className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold mb-2`}
          style={{ color: '#10B981' }}
        >
          ISENTE O PROCESSO DE INVENTÁRIO
        </h3>
        <p 
          className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}
          style={{ color: '#0C2C45' }}
        >
          FALE COM UM ESPECIALISTA
        </p>
      </div>
      
      <button
        className={`luxury-btn-primary ${isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} font-semibold touchable`}
        style={{
          background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1, #D1BFA3)',
          color: '#0C2C45',
          border: 'none',
          borderRadius: '12px',
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 20px rgba(209, 191, 163, 0.4)',
          minHeight: isMobile ? '48px' : 'auto',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '100%' : 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(209, 191, 163, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(209, 191, 163, 0.4)';
        }}
      >
        📞 Agendar Consulta Gratuita
      </button>
      
      <p 
        className={`${isMobile ? 'text-xs' : 'text-sm'} mt-4 font-semibold`}
        style={{ color: '#0C2C45' }}
      >
        Consultoria especializada em planejamento sucessório e holding familiar
      </p>
    </GlassCard>
  );
};

export default CTACard;