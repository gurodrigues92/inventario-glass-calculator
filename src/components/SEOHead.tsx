import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SEOHead = ({
  title = "Calculadora de ITCMD - Reduza até 90% do Imposto de Herança",
  description = "Calculadora profissional de ITCMD e inventário. Estratégias jurídicas avançadas para reduzir imposto de herança. Análise completa por estado brasileiro.",
  keywords = "calculadora ITCMD, imposto herança, inventário judicial, inventário extrajudicial, holding patrimonial, planejamento sucessório, direito sucessório, otimização tributária",
  ogImage = "/diamond-favicon.png",
  canonicalUrl,
  noIndex = false,
  structuredData
}: SEOHeadProps) => {
  const currentUrl = canonicalUrl || window.location.href;
  const siteName = "Calculadora de ITCMD";

  return (
    <Helmet>
      {/* Título e Meta Tags Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Calculadora de ITCMD" />
      <meta name="language" content="pt-BR" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content="Calculadora de ITCMD - Logo" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Calculadora de ITCMD" />
      
      {/* WhatsApp específico */}
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      
      {/* LinkedIn */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="BR" />
      <meta name="geo.country" content="Brazil" />
      
      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;