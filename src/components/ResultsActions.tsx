
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { usePDF } from '../hooks/usePDF';
import { useToast } from '../hooks/use-toast';

interface ResultsActionsProps {
  shareData: {
    total: number;
    patrimonio: number;
    estado: string;
    tipoProcesso: string;
  };
}

const ResultsActions = ({ shareData }: ResultsActionsProps) => {
  const navigate = useNavigate();
  const { generatePDF, isGenerating } = usePDF();
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      // Aguardar um pouco para garantir que o conteúdo esteja renderizado
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Iniciando geração de PDF com dados:', shareData);
      
      await generatePDF(
        'results-pdf-content', // ID correto do container
        `inventario-itcmd-${Date.now()}.pdf`, 
        shareData
      );
      
      toast({
        title: 'PDF Gerado com Sucesso!',
        description: 'Relatório baixado e salvo na pasta de downloads'
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

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button 
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="glass-button px-8 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isGenerating ? 'rgba(209, 191, 163, 0.3)' : 'rgba(209, 191, 163, 0.1)',
          border: '1px solid rgba(209, 191, 163, 0.5)',
          color: '#0C2C45'
        }}
      >
        <Download className="w-4 h-4" />
        <span>{isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}</span>
      </button>
      
      <button 
        onClick={() => navigate('/')}
        className="border border-glass-border text-white px-8 py-3 rounded-lg hover:bg-glass-white transition-all"
      >
        Nova Consulta
      </button>
    </div>
  );
};

export default ResultsActions;
