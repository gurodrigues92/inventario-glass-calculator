
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
      await generatePDF('results-content', `inventario-itcmd-${Date.now()}.pdf`, shareData);
      toast({
        title: 'PDF Gerado!',
        description: 'Relatório baixado com sucesso'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o PDF. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button 
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="glass-button px-8 py-3 flex items-center space-x-2 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
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
