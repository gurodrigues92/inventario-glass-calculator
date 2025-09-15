
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/home/HeroSection';
import PatrimonioForm from '../components/home/PatrimonioForm';
import ValueGuideSection from '../components/home/ValueGuideSection';
import InfoSection from '../components/home/InfoSection';
import SEOHead from '../components/SEOHead';
import StructuredData from '../components/StructuredData';

const Home = () => {
  return (
    <div className="min-h-screen bg-animated">
      <SEOHead 
        title="Calculadora de ITCMD - Reduza até 90% do Imposto de Herança"
        description="Calculadora profissional de ITCMD e inventário. Estratégias jurídicas avançadas para reduzir imposto de herança. Análise completa por estado brasileiro."
        keywords="calculadora ITCMD, imposto herança, inventário judicial, inventário extrajudicial, planejamento patrimonial, estratégia sucessória"
        canonicalUrl="/"
      />
      
      <StructuredData type="WebApplication" />
      <StructuredData type="Calculator" />
      <StructuredData type="Organization" />
      <StructuredData type="FAQ" />
      <StructuredData type="HowTo" />
      
      <Header />
      
      <main className="pt-20 md:pt-36 pb-12 px-3 md:px-6">
        <div className="max-w-3xl mx-auto">
          <HeroSection />
          <PatrimonioForm />
          <ValueGuideSection />
          <InfoSection />
          
          {/* Link temporário para auditoria - apenas desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">🔧 Ferramentas de Desenvolvimento:</p>
              <Link 
                to="/auditoria-itcmd" 
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                📊 Executar Auditoria Completa ITCMD
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
