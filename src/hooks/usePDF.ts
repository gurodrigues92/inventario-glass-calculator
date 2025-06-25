
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrencyWithDecimals } from '../utils/formatters';

export const usePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (
    elementId: string, 
    fileName: string = 'relatorio-inventario.pdf',
    data?: {
      total: number;
      patrimonio: number;
      estado: string;
      tipoProcesso: string;
    }
  ) => {
    setIsGenerating(true);
    
    try {
      // Aguardar um pouco para garantir que o elemento esteja totalmente renderizado
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Elemento com ID '${elementId}' não foi encontrado. Verifique se o conteúdo está carregado.`);
      }

      // Verificar se o elemento está visível
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('O elemento não está visível ou não possui dimensões válidas.');
      }

      console.log('Iniciando captura do elemento:', { 
        id: elementId, 
        width: rect.width, 
        height: rect.height 
      });

      // Configurações otimizadas para html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Alta qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Fundo branco para PDF
        removeContainer: true,
        imageTimeout: 15000, // 15 segundos de timeout para imagens
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Garantir que os estilos sejam aplicados corretamente no clone
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.padding = '20px';
            
            // Forçar cores para impressão
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el: any) => {
              if (el.style.color === 'transparent' || el.style.color === '') {
                el.style.color = '#000000';
              }
            });
          }
        }
      });

      console.log('Canvas gerado com sucesso:', { 
        width: canvas.width, 
        height: canvas.height 
      });

      const imgData = canvas.toDataURL('image/png', 1.0); // Máxima qualidade
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Dimensões da página A4
      const pageWidth = 210;
      const pageHeight = 295;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Calcular dimensões da imagem
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Header do PDF
      pdf.setFontSize(18);
      pdf.setTextColor(12, 44, 69); // Cor primária do sistema
      pdf.text('Relatório de Inventário ITCMD', margin, 20);
      
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, 28);

      // Dados do relatório se fornecidos
      if (data) {
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        
        let yPos = 40;
        pdf.text(`Estado: ${data.estado}`, margin, yPos);
        yPos += 6;
        pdf.text(`Tipo de Processo: ${data.tipoProcesso}`, margin, yPos);
        yPos += 6;
        pdf.text(`Patrimônio: ${formatCurrencyWithDecimals(data.patrimonio)}`, margin, yPos);
        yPos += 6;
        pdf.text(`Custo Total: ${formatCurrencyWithDecimals(data.total)}`, margin, yPos);
        yPos += 6;
        
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('────────────────────────────────────────────────────────────────────────', margin, yPos + 3);
        
        position = yPos + 10;
      } else {
        position = 35;
      }

      // Adicionar primeira página da imagem
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= (pageHeight - position);

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= (pageHeight - margin);
      }

      // Footer em todas as páginas
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(120, 120, 120);
        
        // Footer esquerdo
        pdf.text('Inventário Descomplicado - Cálculo estimativo baseado na legislação atual', margin, pageHeight - 5);
        
        // Footer direito (número da página)
        const pageText = `Página ${i} de ${pageCount}`;
        const pageTextWidth = pdf.getStringUnitWidth(pageText) * 7 / pdf.internal.scaleFactor;
        pdf.text(pageText, pageWidth - margin - pageTextWidth, pageHeight - 5);
      }

      console.log('PDF gerado com sucesso:', { 
        fileName, 
        pages: pageCount,
        fileSize: `${(imgData.length * 0.75 / 1024).toFixed(0)}KB`
      });

      pdf.save(fileName);
      return true;
    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', error);
      
      // Melhor tratamento de erros com mensagens específicas
      if (error instanceof Error) {
        if (error.message.includes('não foi encontrado')) {
          throw new Error('Conteúdo não encontrado. Aguarde o carregamento completo da página.');
        } else if (error.message.includes('não está visível')) {
          throw new Error('Conteúdo não está visível. Verifique se a página foi carregada corretamente.');
        } else if (error.message.includes('timeout')) {
          throw new Error('Tempo limite excedido. Verifique sua conexão e tente novamente.');
        } else {
          throw new Error(`Erro na geração do PDF: ${error.message}`);
        }
      } else {
        throw new Error('Erro desconhecido ao gerar PDF. Tente novamente.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
};
