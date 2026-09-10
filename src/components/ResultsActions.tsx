import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { usePDF } from '../hooks/usePDF';
import { useToast } from '../hooks/use-toast';
import { useIsMobile } from '../hooks/use-mobile';

interface ResultsActionsProps {
  shareData: {
    total: number;
    patrimonio: number;
    estado: string;
    tipoProcesso: string;
  };
  isSaving: boolean;
  calculoSalvoId: string | null;
}

const ResultsActions = ({ shareData, isSaving, calculoSalvoId }: ResultsActionsProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { generatePDF, isGenerating } = usePDF();
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Removido log desnecessário
      
      await generatePDF(
        'results-content',
        `inventario-itcmd-${Date.now()}.pdf`, 
        shareData
      );
      
      toast({
        title: 'PDF Gerado com Sucesso!',
        description: 'Relatório com 2 páginas baixado e salvo na pasta de downloads'
      });
    } catch (error) {
      console.error('Erro na geração de PDF:', error);
      toast({
        title: 'Erro na Geração do PDF',
        description: error instanceof Error ? error.message : 'Erro desconhecido. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const buttonBaseStyle = {
    background: isMobile ? 
      'linear-gradient(135deg, #0C2C45 0%, #476D9E 50%, #0C2C45 100%)' :
      'linear-gradient(135deg, #0C2C45, #476D9E)',
    color: '#FFFFFF',
    backgroundColor: '#0C2C45',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: isMobile ? '16px 24px' : '14px 28px',
    fontSize: isMobile ? '16px' : '15px',
    fontWeight: '600',
    textTransform: 'none' as const,
    letterSpacing: '0.025em',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isMobile ?
      '0 4px 12px rgba(12, 44, 69, 0.3), 0 2px 4px rgba(12, 44, 69, 0.2)' :
      '0 6px 20px rgba(12, 44, 69, 0.25), 0 2px 6px rgba(12, 44, 69, 0.15)',
    minHeight: isMobile ? '52px' : '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    textDecoration: 'none',
    touchAction: 'manipulation' as const,
    userSelect: 'none' as const,
    WebkitTapHighlightColor: 'transparent'
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px) scale(1.02)',
    background: 'linear-gradient(135deg, #0A2438 0%, #3A5F8A 50%, #0A2438 100%)',
    boxShadow: isMobile ?
      '0 8px 20px rgba(12, 44, 69, 0.4), 0 4px 8px rgba(12, 44, 69, 0.3)' :
      '0 12px 32px rgba(12, 44, 69, 0.35), 0 4px 12px rgba(12, 44, 69, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.2)'
  };

  const buttonDisabledStyle = {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    background: '#94A3B8',
    boxShadow: 'none'
  };

  return (
    <div className={`results-actions ${isMobile ? 'mobile-results-actions' : ''}`}>
      {/* Indicador de Salvamento */}
      {(isSaving || calculoSalvoId) && (
        <div className="flex justify-center mb-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isSaving ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
          }`}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando cálculo...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Cálculo salvo automaticamente</span>
              </>
            )}
          </div>
        </div>
      )}

      <div 
        className={`flex ${isMobile ? 'flex-col' : 'flex-row'} ${isMobile ? 'gap-4' : 'gap-3'} justify-center items-center`}
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '500px',
          margin: '0 auto',
          padding: isMobile ? '0' : '0 16px'
        }}
      >
        {/* Botão Baixar PDF */}
        <button 
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="results-action-button touchable"
          style={{
            ...buttonBaseStyle,
            ...(isGenerating ? buttonDisabledStyle : {}),
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '180px'
          }}
          onMouseEnter={(e) => {
            if (!isGenerating) {
              Object.assign(e.currentTarget.style, buttonHoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!isGenerating) {
              Object.assign(e.currentTarget.style, buttonBaseStyle);
            }
          }}
          onTouchStart={(e) => {
            if (!isGenerating) {
              Object.assign(e.currentTarget.style, {
                ...buttonHoverStyle,
                transform: 'translateY(-1px) scale(0.98)'
              });
            }
          }}
          onTouchEnd={(e) => {
            if (!isGenerating) {
              setTimeout(() => {
                Object.assign(e.currentTarget.style, buttonBaseStyle);
              }, 150);
            }
          }}
        >
          <Download className="w-5 h-5" />
          <span>{isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}</span>
        </button>
        
        {/* Botão Nova Consulta */}
        <button 
          onClick={() => navigate('/')}
          className="results-action-button touchable"
          style={{
            ...buttonBaseStyle,
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '180px'
          }}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, buttonHoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, buttonBaseStyle);
          }}
          onTouchStart={(e) => {
            Object.assign(e.currentTarget.style, {
              ...buttonHoverStyle,
              transform: 'translateY(-1px) scale(0.98)'
            });
          }}
          onTouchEnd={(e) => {
            setTimeout(() => {
              Object.assign(e.currentTarget.style, buttonBaseStyle);
            }, 150);
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Nova Consulta</span>
        </button>
      </div>
    </div>
  );
};

export default ResultsActions;
