import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuditoriaITCMD from '../components/dev/AuditoriaITCMD';

const AuditoriaITCMDPage = () => {
  return (
    <>
      <Helmet>
        <title>Auditoria ITCMD - Verificação de Cálculos</title>
        <meta name="description" content="Ferramenta de auditoria para verificar consistência dos cálculos de ITCMD em todos os estados." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background py-8">
        <AuditoriaITCMD />
      </div>
    </>
  );
};

export default AuditoriaITCMDPage;