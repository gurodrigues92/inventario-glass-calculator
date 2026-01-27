import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuditoriaITCMD from '../components/dev/AuditoriaITCMD';
import Header from '../components/Header';

const AuditoriaITCMDPage = () => {
  return (
    <>
      <Helmet>
        <title>Auditoria ITCMD - Verificação de Cálculos</title>
        <meta name="description" content="Ferramenta de auditoria para verificar consistência dos cálculos de ITCMD em todos os estados." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-animated">
        <Header />
        <main className="pt-28 pb-12">
          <AuditoriaITCMD />
        </main>
      </div>
    </>
  );
};

export default AuditoriaITCMDPage;