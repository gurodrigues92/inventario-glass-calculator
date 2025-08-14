
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrencyWithDecimals } from '../utils/formatters';

// Função para validar e criar dados padrão
const validateAndCreateDefaultData = (data: any) => {
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
    data?: {
      total: number;
      patrimonio: number;
      estado: string;
      tipoProcesso: string;
    }
  ) => {
    setIsGenerating(true);
    
    // Validar e garantir dados padrão (fora do try para uso no catch)
    const validatedData = validateAndCreateDefaultData(data);
    console.log('Dados validados para PDF:', validatedData);
    
    try {

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
      pdf.text(`Tipo de Processo: ${validatedData.tipoProcesso}`, margin, yPos);
      yPos += 6;
      pdf.text(`Patrimônio: ${formatCurrencyWithDecimals(validatedData.patrimonio)}`, margin, yPos);
      yPos += 6;
      pdf.text(`Custo Total: ${formatCurrencyWithDecimals(validatedData.total)}`, margin, yPos);
      yPos += 6;
      
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('────────────────────────────────────────────────────────────────────────', margin, yPos + 3);

      // Adicionar imagem da página 1
      const imgWidth1 = contentWidth;
      const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;
      const startY1 = 55; // Sempre usar posição com dados
      
      pdf.addImage(imgData1, 'PNG', margin, startY1, imgWidth1, imgHeight1, undefined, 'FAST');

      // PÁGINA 2 - HOLDING S/A E CTA com retry robusto
      const page2Element = await waitForElement('results-page-2');

      console.log('Capturando página 2 (holding e CTA)');
      const canvas2 = await html2canvas(page2Element, {
        scale: 3, // Maior qualidade
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
        foreignObjectRendering: false, // Melhor compatibilidade
        ignoreElements: (element) => {
          const htmlElement = element as HTMLElement;
          return element.classList?.contains('loading') || 
                 element.classList?.contains('skeleton') ||
                 htmlElement.style?.display === 'none' ||
                 htmlElement.style?.visibility === 'hidden';
        },
        onclone: (clonedDoc, element) => {
          const clonedElement = clonedDoc.getElementById('results-page-2');
          if (clonedElement) {
            // Aplicar estilos para impressão
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.padding = '20px';
            clonedElement.style.minHeight = 'auto';
            clonedElement.style.pageBreakBefore = 'auto';
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

      const imgData2 = canvas2.toDataURL('image/png', 1.0);

      // Adicionar nova página
      pdf.addPage();

      // Header da página 2
      pdf.setFontSize(16);
      pdf.setTextColor(12, 44, 69);
      pdf.text('Planejamento Sucessório - Estratégia Avançada', margin, 20);
      
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('────────────────────────────────────────────────────────────────────────', margin, 25);

      // Adicionar imagem da página 2
      const imgWidth2 = contentWidth;
      const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;
      const startY2 = 35;
      
      pdf.addImage(imgData2, 'PNG', margin, startY2, imgWidth2, imgHeight2, undefined, 'FAST');

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
        page1Size: `${(imgData1.length * 0.75 / 1024).toFixed(0)}KB`,
        page2Size: `${(imgData2.length * 0.75 / 1024).toFixed(0)}KB`
      });

      pdf.save(fileName);
      return true;
    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', {
        error,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        validatedData
      });
      
      if (error instanceof Error) {
        // Erros específicos de elementos DOM
        if (error.message.includes('não foi encontrado') || error.message.includes('não carregou')) {
          throw new Error(`Conteúdo da página não foi carregado. Aguarde alguns segundos e tente novamente. Se o problema persistir, recarregue a página.`);
        } 
        // Erros do html2canvas
        else if (error.message.includes('timeout') || error.message.includes('canvas')) {
          throw new Error('Falha na captura da página. Verifique sua conexão de internet e tente novamente.');
        } 
        // Erros do jsPDF
        else if (error.message.includes('jsPDF') || error.message.includes('PDF')) {
          throw new Error('Erro interno na geração do PDF. Tente novamente em alguns segundos.');
        }
        // Erro genérico
        else {
          throw new Error(`Erro na geração do PDF: ${error.message}. Dados usados: Estado: ${validatedData.estado}, Processo: ${validatedData.tipoProcesso}`);
        }
      } else {
        throw new Error('Erro desconhecido ao gerar PDF. Verifique se a página está totalmente carregada e tente novamente.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePDF, isGenerating };
};
