import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'WebApplication' | 'Calculator' | 'Organization' | 'FAQ' | 'HowTo' | 'BreadcrumbList';
  data?: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const getStructuredData = () => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'WebApplication':
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Calculadora de ITCMD",
          "description": "Calculadora profissional de ITCMD e inventário para redução de imposto de herança",
          "url": baseUrl,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "softwareVersion": "1.0",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BRL"
          },
          "creator": {
            "@type": "Organization",
            "name": "Calculadora de ITCMD",
            "url": baseUrl
          },
          "featureList": [
            "Cálculo de ITCMD por estado",
            "Análise de inventário judicial vs extrajudicial",
            "Simulação de estratégias patrimoniais",
            "Geração de relatórios PDF",
            "Salvamento de cálculos"
          ]
        };

      case 'Calculator':
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Calculadora de ITCMD",
          "applicationCategory": "CalculatorApplication",
          "description": "Calculadora especializada em ITCMD e planejamento sucessório",
          "url": baseUrl,
          "author": {
            "@type": "Organization",
            "name": "Calculadora de ITCMD"
          },
          "softwareHelp": {
            "@type": "CreativeWork",
            "name": "Guia de uso da calculadora",
            "description": "Como usar a calculadora para reduzir ITCMD"
          }
        };

      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Calculadora de ITCMD",
          "url": baseUrl,
          "logo": `${baseUrl}/diamond-favicon.png`,
          "sameAs": [],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "areaServed": "BR",
            "availableLanguage": "Portuguese"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Brazil"
          },
          "knowsAbout": [
            "ITCMD",
            "Imposto de Herança",
            "Direito Sucessório",
            "Planejamento Patrimonial",
            "Inventário Judicial",
            "Inventário Extrajudicial",
            "Estratégias Patrimoniais"
          ]
        };

      case 'FAQ':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "O que é ITCMD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "ITCMD é o Imposto sobre Transmissão Causa Mortis e Doação, cobrado na transmissão de bens por herança ou doação."
              }
            },
            {
              "@type": "Question", 
              "name": "Como posso reduzir o ITCMD?",
               "acceptedAnswer": {
                 "@type": "Answer",
                 "text": "Através de estratégias jurídicas avançadas, doação em vida com usufruto, e planejamento sucessório adequado."
               }
            },
            {
              "@type": "Question",
              "name": "Qual a diferença entre inventário judicial e extrajudicial?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O inventário extrajudicial é mais rápido e econômico, feito em cartório, enquanto o judicial é feito no fórum e demora mais."
              }
            }
          ]
        };

      case 'HowTo':
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "Como calcular ITCMD e reduzir imposto de herança",
          "description": "Guia passo a passo para calcular ITCMD e implementar estratégias de redução",
          "step": [
            {
              "@type": "HowToStep",
              "name": "Inserir valor do patrimônio",
              "text": "Digite o valor total do patrimônio a ser transmitido"
            },
            {
              "@type": "HowToStep", 
              "name": "Selecionar estado",
              "text": "Escolha o estado onde será feito o inventário"
            },
            {
              "@type": "HowToStep",
              "name": "Analisar resultados",
              "text": "Veja as opções de inventário e estratégias de redução"
            },
            {
              "@type": "HowToStep",
              "name": "Implementar estratégia",
              "text": "Escolha a melhor opção com base na análise"
            }
          ]
        };

      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Início",
              "item": baseUrl
            },
            ...(data?.breadcrumbs || [])
          ]
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;