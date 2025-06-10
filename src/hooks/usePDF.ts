
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (elementId: string, fileName: string = 'relatorio-inventario.pdf') => {
    setIsGenerating(true);
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0a0a0a'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Adicionar header
      pdf.setFontSize(20);
      pdf.setTextColor(139, 92, 246);
      pdf.text('Relatório de Inventário ITCMD', 20, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);

      // Adicionar conteúdo
      pdf.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight);
      heightLeft -= pageHeight - 40;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Adicionar footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Inventário Descomplicado - www.inventariodescomplicado.com.br', 20, 285);
        pdf.text(`Página ${i} de ${pageCount}`, 170, 285);
      }

      pdf.save(fileName);
      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
};
