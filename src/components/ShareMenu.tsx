import React, { useState } from 'react';
import { Share, Download, Mail, Linkedin, Copy, Check } from 'lucide-react';
import { useShare } from '../hooks/useShare';
import { usePDF } from '../hooks/usePDF';
import { useToast } from '../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ShareMenuProps {
  data: {
    total: number;
    patrimonio: number;
    estado: string;
    tipoProcesso: string;
  };
}

const ShareMenu = ({ data }: ShareMenuProps) => {
  const { share, canShare, isSharing } = useShare();
  const { generatePDF, isGenerating } = usePDF();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: 'Cálculo de Inventário ITCMD',
    text: `Calculei os custos do meu inventário:\n\n💰 Patrimônio: ${formatCurrencyWithDecimals(data.patrimonio)}\n📊 Custo Total: ${formatCurrencyWithDecimals(data.total)}\n📍 Estado: ${data.estado}\n⚖️ Processo: ${data.tipoProcesso}\n\nCalcule o seu também: ${window.location.origin}`,
    url: window.location.origin
  };

  const handleShare = async (method: 'native' | 'whatsapp' | 'email' | 'linkedin' | 'copy') => {
    try {
      const success = await share(shareData, method);
      if (success) {
        if (method === 'copy') {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        toast({
          title: 'Sucesso!',
          description: method === 'copy' ? 'Link copiado para a área de transferência' : 'Compartilhado com sucesso'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível compartilhar. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('Iniciando download de PDF via ShareMenu');
      await generatePDF('results-pdf-content', `inventario-itcmd-${Date.now()}.pdf`, data);
      toast({
        title: 'PDF Gerado!',
        description: 'Relatório baixado com sucesso'
      });
    } catch (error) {
      console.error('Erro no ShareMenu PDF:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível gerar o PDF. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="glass-button px-8 py-3 flex items-center space-x-2 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            disabled={isSharing}
            className="glass-button px-8 py-3 flex items-center space-x-2 disabled:opacity-50"
          >
            <Share className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56 glass-card border-glass-border">
          {canShare() && (
            <>
              <DropdownMenuItem onClick={() => handleShare('native')}>
                <Share className="mr-2 h-4 w-4" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
            <div className="mr-2 h-4 w-4 bg-green-500 rounded-sm flex items-center justify-center text-xs text-white">
              W
            </div>
            WhatsApp
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleShare('email')}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleShare('linkedin')}>
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleShare('copy')}>
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? 'Copiado!' : 'Copiar link'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

import { formatCurrencyWithDecimals } from '../utils/formatters';

export default ShareMenu;
