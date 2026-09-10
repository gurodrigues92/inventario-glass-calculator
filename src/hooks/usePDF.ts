
import { useState } from 'react';
// import jsPDF from 'jspdf'; // Dynamically imported
// import html2canvas from 'html2canvas'; // Dynamically imported
import { formatCurrencyWithDecimals } from '../utils/formatters';

type PdfData = {
  total: number;
  patrimonio: number;
  estado: string;
  tipoProcesso: string;
};

// Função para validar e criar dados padrão
const validateAndCreateDefaultData = (data?: Partial<PdfData>): PdfData => {
  return {
    total: data?.total || 0,
    patrimonio: data?.patrimonio || 0,
    estado: data?.estado || 'Não informado',
    tipoProcesso: data?.tipoProcesso || 'judicial'
  };
};

// Função para preparar elemento para captura
const prepareElementForCapture = (element: HTMLElement): void => {
  // Garantir que todos os estilos sejam aplicados
  element.style.transform = 'translateZ(0)';
  element.style.webkitTransform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  
  // Aplicar estilos para impressão
  const allElements = element.querySelectorAll('*') as NodeListOf<HTMLElement>;
  allElements.forEach((el) => {
    // Forçar visibilidade de texto
    if (el.style.color === 'transparent' || getComputedStyle(el).color === 'rgba(0, 0, 0, 0)') {
      el.style.color = '#000000';
    }
    
    // Garantir backgrounds sejam visíveis
    const bgColor = getComputedStyle(el).backgroundColor;
    if (bgColor === 'rgba(0, 0, 0, 0)' && el.classList.contains('glass-card')) {
      el.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      el.style.backdropFilter = 'none';
    }
    
    // Melhorar contraste para elementos importantes
    if (el.classList.contains('text-muted') || el.classList.contains('text-muted-foreground')) {
      el.style.color = '#666666';
    }
  });
};

// Função para aguardar elemento estar pronto com retry
const waitForElement = async (elementId: string, maxRetries: number = 15): Promise<HTMLElement> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const element = document.getElementById(elementId);
    
    if (element && element.offsetWidth > 0 && element.offsetHeight > 0) {
      // Verificar se o elemento tem conteúdo
      const hasContent = element.children.length > 0 || element.textContent?.trim();
      if (hasContent) {
        // Aguardar fonts e imagens carregarem
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Preparar elemento para captura
        prepareElementForCapture(element);
        
        console.log(`Elemento ${elementId} encontrado e preparado (tentativa ${attempt})`);
        return element;
      }
    }
    
    console.log(`Aguardando elemento ${elementId} (tentativa ${attempt}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, 800));
  }
  
  throw new Error(`Elemento ${elementId} não foi encontrado ou não carregou corretamente após ${maxRetries} tentativas`);
};

export const usePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (
    elementId: string, 
    fileName: string = 'relatorio-inventario.pdf',
    data?: Partial<PdfData>
  ) => {
    setIsGenerating(true);
    
    // Validar e garantir dados padrão (fora do try para uso no catch)
    const validatedData = validateAndCreateDefaultData(data);
    console.log('Dados validados para PDF:', validatedData);
    
    try {
      // Dynamic imports to reduce initial bundle size
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      // Aguardar renderização inicial
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Iniciando geração de PDF com duas páginas separadas');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 295;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // PÁGINA 1 - CUSTOS E DETALHAMENTO com retry robusto
      const page1Element = await waitForElement('results-page-1');

      console.log('Capturando página 1 (custos e detalhamento)');
      const canvas1 = await html2canvas(page1Element, {
        scale: 3, // Maior qualidade
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        removeContainer: false,
        imageTimeout: 45000,
        scrollX: 0,
        scrollY: 0,
        width: page1Element.scrollWidth,
        height: page1Element.scrollHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        logging: true,
        foreignObjectRendering: false, // Melhor compatibilidade
        ignoreElements: (element) => {
          const htmlElement = element as HTMLElement;
          return element.classList?.contains('loading') || 
                 element.classList?.contains('skeleton') ||
                 htmlElement.style?.display === 'none' ||
                 htmlElement.style?.visibility === 'hidden';
        },
        onclone: (clonedDoc, element) => {
          const clonedElement = clonedDoc.getElementById('results-page-1');
          if (clonedElement) {
            // Aplicar estilos para impressão
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.padding = '20px';
            clonedElement.style.minHeight = 'auto';
            clonedElement.style.pageBreakAfter = 'auto';
            clonedElement.style.transform = 'none';
            clonedElement.style.filter = 'none';
            
            // Forçar aplicação de estilos em todos os elementos
            const allElements = clonedElement.querySelectorAll('*') as NodeListOf<HTMLElement>;
            allElements.forEach((el) => {
              // Garantir texto visível
              const computedStyle = window.getComputedStyle(el);
              if (el.style.color === 'transparent' || el.style.color === '' || computedStyle.color === 'rgba(0, 0, 0, 0)') {
                el.style.color = '#000000 !important';
              }
              
              // Aplicar backgrounds de gradiente como cores sólidas
              if (el.classList.contains('bg-gradient-to-br') || el.classList.contains('bg-gradient-to-r')) {
                el.style.background = '#f8fafc !important';
                el.style.backgroundImage = 'none !important';
              }
              
              // Glass cards - aplicar background sólido
              if (el.classList.contains('glass-card') || el.classList.contains('backdrop-blur')) {
                el.style.backgroundColor = 'rgba(255, 255, 255, 0.95) !important';
                el.style.backdropFilter = 'none !important';
                el.style.border = '1px solid rgba(0, 0, 0, 0.1) !important';
                el.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1) !important';
              }
              
              // Botões e elementos interativos
              if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                el.style.backgroundColor = '#3b82f6 !important';
                el.style.color = '#ffffff !important';
                el.style.border = '1px solid #3b82f6 !important';
              }
              
              // Textos coloridos - garantir contraste
              if (el.style.color?.includes('hsl') || computedStyle.color?.includes('hsl')) {
                el.style.color = '#1e293b !important';
              }
            });
          }
        }
      });

      const imgData1 = canvas1.toDataURL('image/png', 1.0);
      
      // Header da página 1
      pdf.setFontSize(18);
      pdf.setTextColor(12, 44, 69);
      pdf.text('Relatório de Inventário ITCMD', margin, 20);
      
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, 28);

      // Dados do relatório na página 1 (sempre incluir com dados validados)
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      let yPos = 40;
      pdf.text(`Estado: ${validatedData.estado}`, margin, yPos);
      yPos += 6;
      pdf.text(`Tipo de Processo: ${validatedData.tipoProcesso === 'extrajudicial' ? 'Extrajudicial (Cartório)' : 'Judicial'}`, margin, yPos);
      yPos += 6;
      pdf.text(`Patrimônio Declarado: ${formatCurrencyWithDecimals(validatedData.patrimonio)}`, margin, yPos);
      yPos += 6;
      pdf.text(`Custo Total Estimado: ${formatCurrencyWithDecimals(validatedData.total)}`, margin, yPos);
      yPos += 10;
      
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Adicionar imagem da página 1
      const imgWidth1 = contentWidth;
      const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;
      
      // Se a imagem for maior que o espaço restante, adicionar em nova página?
      // Neste caso, vamos apenas adicionar
      pdf.addImage(imgData1, 'PNG', margin, yPos, imgWidth1, imgHeight1);
      
      // Rodapé página 1
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Inventário Simplificado - Página 1 de 2', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // PÁGINA 2 - GRÁFICOS E COMPARAÇÃO
      try {
        console.log('Capturando página 2 (gráficos e comparação)');
        const page2Element = await waitForElement('results-page-2', 5); // Menos retries pois já deve estar carregado
        
        pdf.addPage();
        
        // Header da página 2
        pdf.setFontSize(14);
        pdf.setTextColor(12, 44, 69);
        pdf.text('Análise Comparativa e Gráficos', margin, 20);
        
        const canvas2 = await html2canvas(page2Element, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          removeContainer: false,
          imageTimeout: 45000,
          scrollX: 0,
          scrollY: 0,
          width: page2Element.scrollWidth,
          height: page2Element.scrollHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          logging: true,
          foreignObjectRendering: false,
          ignoreElements: (element) => {
            const htmlElement = element as HTMLElement;
            return element.classList?.contains('loading') || 
                   htmlElement.style?.display === 'none' ||
                   htmlElement.style?.visibility === 'hidden';
          },
          onclone: (clonedDoc, element) => {
            const clonedElement = clonedDoc.getElementById('results-page-2');
            if (clonedElement) {
              clonedElement.style.backgroundColor = '#ffffff';
              clonedElement.style.padding = '20px';
              clonedElement.style.minHeight = 'auto';
              clonedElement.style.transform = 'none';
              
              // Ajustes específicos para gráficos
              const charts = clonedElement.querySelectorAll('.recharts-wrapper');
              charts.forEach((chart: any) => {
                chart.style.backgroundColor = '#ffffff';
              });
            }
          }
        });
        
        const imgData2 = canvas2.toDataURL('image/png', 1.0);
        const imgWidth2 = contentWidth;
        const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
        
        pdf.addImage(imgData2, 'PNG', margin, 30, imgWidth2, imgHeight2);
        
        // Rodapé página 2
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Inventário Simplificado - Página 2 de 2', pageWidth / 2, pageHeight - 10, { align: 'center' });
        
      } catch (page2Error) {
        console.warn('Não foi possível gerar a página 2 (opcional):', page2Error);
        // Não falhar o processo se a página 2 falhar (pode não ter conteúdo suficiente)
      }
      
      console.log('Salvando PDF final');
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
};
