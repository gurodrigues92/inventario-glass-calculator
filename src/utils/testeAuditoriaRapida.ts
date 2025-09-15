// Teste rápido da auditoria ITCMD para identificar problemas
import { executarAuditoriaITCMD, testarEstadosSuspeitos } from './auditoria/itcmdAuditoria';

// Função para executar teste rápido e mostrar resultados no console
export const executarTesteRapido = () => {
  console.log('🔍 INICIANDO AUDITORIA RÁPIDA DE ITCMD...\n');
  
  const resumo = executarAuditoriaITCMD(5000000);
  
  console.log('📊 RESUMO GERAL:');
  console.log(`- Total de estados: ${resumo.totalEstados}`);
  console.log(`- Estados OK: ${resumo.estadosOK}`);
  console.log(`- Estados com discrepância: ${resumo.estadosComDiscrepancia}`);
  console.log(`- Estados com erro: ${resumo.estadosComErro}\n`);
  
  if (resumo.discrepanciasEncontradas.length > 0) {
    console.log('🚨 DISCREPÂNCIAS ENCONTRADAS:\n');
    
    resumo.discrepanciasEncontradas.forEach(resultado => {
      console.log(`${resultado.uf} - ${resultado.nome}:`);
      console.log(`  Status: ${resultado.status}`);
      console.log(`  Tipo: ${resultado.tipo}`);
      console.log(`  Alíquota exibida: ${resultado.aliquotaExibida}`);
      console.log(`  Valor calculado: R$ ${resultado.valorCalculado.toLocaleString()}`);
      console.log(`  Alíquota efetiva: ${resultado.aliquotaEfetiva.toFixed(2)}%`);
      console.log(`  Observações:`);
      resultado.observacoes.forEach(obs => {
        console.log(`    - ${obs}`);
      });
      console.log('');
    });
  } else {
    console.log('✅ Nenhuma discrepância encontrada!');
  }
  
  // Teste detalhado dos estados suspeitos
  console.log('🔍 ANÁLISE DOS ESTADOS SUSPEITOS:\n');
  const suspeitos = testarEstadosSuspeitos();
  
  Object.entries(suspeitos).forEach(([uf, dados]: [string, any]) => {
    console.log(`${uf} - ${dados.nome}:`);
    console.log(`  Imposto Total: R$ ${dados.impostoTotal.toLocaleString()}`);
    console.log(`  Alíquota Efetiva: ${dados.aliquotaEfetiva}`);
    console.log(`  Cálculo detalhado:`);
    dados.calculoDetalhado.forEach((faixa: any) => {
      console.log(`    ${faixa.faixa}: ${faixa.aliquota} sobre R$ ${faixa.valorIncidencia.toLocaleString()} = R$ ${faixa.impostoFaixa.toLocaleString()}`);
    });
    console.log('');
  });
  
  return resumo;
};

// Auto-executar quando o arquivo for importado (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  // executarTesteRapido();
}