import { calcularCustosInventario } from '../itcmdCalculator';
import { DadosCalculoInventario } from '../types/calculator';

// Casos de teste para validar os cálculos corretos
export const testeCases = [
  {
    nome: 'RN - Fixa 3% - Com ganho de capital',
    dados: {
      patrimonio: 10800600,
      patrimonioAtualMercado: 10800600,
      patrimonioHistoricoIR: 3342000,
      estado: 'RN',
      tipoProcesso: 'extrajudicial',
      temLitigio: false
    } as DadosCalculoInventario,
    esperado: {
      baseCalculo: 7458600, // 10.800.600 - 3.342.000
      itcmd: 223758, // 3% de 7.458.600
      ganhoCapital: 1118790, // 15% de 7.458.600
      honorarios: 1080060 // 10% de 10.800.600
    }
  },
  {
    nome: 'RS - Progressiva - Valor alto',
    dados: {
      patrimonio: 2000000,
      patrimonioAtualMercado: 2000000,
      patrimonioHistoricoIR: 0,
      estado: 'RS',
      tipoProcesso: 'extrajudicial',
      temLitigio: false
    } as DadosCalculoInventario,
    esperado: {
      baseCalculo: 2000000,
      // RS progressivo: 700k*3% + 500k*4% + 300k*5% + 500k*6%
      itcmd: 86000, // 21.000 + 20.000 + 15.000 + 30.000
      ganhoCapital: 0, // Sem ganho de capital
      honorarios: 200000 // 10% de 2.000.000
    }
  },
  {
    nome: 'SP - Progressiva - Valor médio',
    dados: {
      patrimonio: 1500000,
      patrimonioAtualMercado: 1500000,
      patrimonioHistoricoIR: 500000,
      estado: 'SP',
      tipoProcesso: 'extrajudicial',
      temLitigio: false
    } as DadosCalculoInventario,
    esperado: {
      baseCalculo: 1000000, // 1.500.000 - 500.000
      // SP progressivo sobre 1M: 276k*4% + 724k*5%
      itcmd: 47240, // 11.040 + 36.200
      ganhoCapital: 150000, // 15% de 1.000.000
      honorarios: 150000 // 10% de 1.500.000
    }
  }
];

export const executarTestes = () => {
  console.log('🧪 Executando Testes de Validação ITCMD...\n');
  
  testeCases.forEach((teste, index) => {
    console.log(`${index + 1}. ${teste.nome}`);
    console.log('─'.repeat(50));
    
    const resultado = calcularCustosInventario(teste.dados);
    
    // Verificar base de cálculo
    const baseOk = Math.abs(resultado.baseCalculo - teste.esperado.baseCalculo) < 1;
    console.log(`Base de Cálculo: ${baseOk ? '✅' : '❌'} ${resultado.baseCalculo.toLocaleString('pt-BR')} (esperado: ${teste.esperado.baseCalculo.toLocaleString('pt-BR')})`);
    
    // Verificar ITCMD
    const itcmdOk = Math.abs(resultado.detalhamento.itcmd.valor - teste.esperado.itcmd) < 100; // Tolerância de R$ 100
    console.log(`ITCMD: ${itcmdOk ? '✅' : '❌'} R$ ${resultado.detalhamento.itcmd.valor.toLocaleString('pt-BR')} (esperado: R$ ${teste.esperado.itcmd.toLocaleString('pt-BR')})`);
    
    // Verificar Ganho de Capital
    const ganhoOk = Math.abs(resultado.detalhamento.ganhoCapital.valor - teste.esperado.ganhoCapital) < 100;
    console.log(`Ganho de Capital: ${ganhoOk ? '✅' : '❌'} R$ ${resultado.detalhamento.ganhoCapital.valor.toLocaleString('pt-BR')} (esperado: R$ ${teste.esperado.ganhoCapital.toLocaleString('pt-BR')})`);
    
    // Verificar Honorários
    const honorariosOk = Math.abs(resultado.detalhamento.honorarios.valor - teste.esperado.honorarios) < 100;
    console.log(`Honorários: ${honorariosOk ? '✅' : '❌'} R$ ${resultado.detalhamento.honorarios.valor.toLocaleString('pt-BR')} (esperado: R$ ${teste.esperado.honorarios.toLocaleString('pt-BR')})`);
    
    console.log(`\nDetalhes do resultado:`);
    console.log(`- Descrição ITCMD: ${resultado.detalhamento.itcmd.descricao}`);
    console.log(`- Percentual ITCMD: ${resultado.detalhamento.itcmd.percentual.toFixed(2)}%`);
    console.log(`- Total Pessoa Física: R$ ${resultado.resumo.custoTotal.toLocaleString('pt-BR')}\n`);
  });
};

// Função para executar teste específico
export const testarEstado = (uf: string, patrimonio: number, valorHistorico?: number) => {
  const dados: DadosCalculoInventario = {
    patrimonio,
    patrimonioAtualMercado: patrimonio,
    patrimonioHistoricoIR: valorHistorico || 0,
    estado: uf,
    tipoProcesso: 'extrajudicial' as const,
    temLitigio: false
  };
  
  const resultado = calcularCustosInventario(dados);
  
  console.log(`📊 Teste Individual - ${uf}`);
  console.log('─'.repeat(30));
  console.log(`Patrimônio: R$ ${patrimonio.toLocaleString('pt-BR')}`);
  console.log(`Valor Histórico IR: R$ ${(valorHistorico || 0).toLocaleString('pt-BR')}`);
  console.log(`Base de Cálculo: R$ ${resultado.baseCalculo.toLocaleString('pt-BR')}`);
  console.log(`ITCMD (${resultado.detalhamento.itcmd.descricao}): R$ ${resultado.detalhamento.itcmd.valor.toLocaleString('pt-BR')}`);
  console.log(`Ganho de Capital: R$ ${resultado.detalhamento.ganhoCapital.valor.toLocaleString('pt-BR')}`);
  console.log(`Total: R$ ${resultado.resumo.custoTotal.toLocaleString('pt-BR')}`);
  
  return resultado;
};