
import { DetalhamentoCusto } from '../types/calculator';

// Honorários advocatícios aprimorados (1,5% a 1,7%)
export const calcularHonorariosVariaveis = (patrimonio: number, tipoProcesso: string, temLitigio: boolean = false): DetalhamentoCusto => {
  if (temLitigio) {
    return {
      valor: patrimonio * 0.15, // Valor médio para display
      valorMinimo: patrimonio * 0.10,
      valorMaximo: patrimonio * 0.20,
      percentual: 15,
      descricao: 'Honorários com litígio (10% a 20%)',
      isRange: true,
      tooltip: 'Em casos litigiosos, os honorários podem variar de 10% a 20% do patrimônio devido à complexidade adicional'
    };
  }

  if (tipoProcesso === 'judicial') {
    const minimo = patrimonio * 0.015; // 1,5%
    const maximo = patrimonio * 0.017; // 1,7%
    return {
      valor: (minimo + maximo) / 2, // Valor médio para cálculos
      valorMinimo: minimo,
      valorMaximo: maximo,
      percentual: 1.6, // Percentual médio
      descricao: 'Honorários advocatícios judiciais',
      isRange: true,
      tooltip: 'Baseado na média do mercado, os honorários costumam variar entre 1,5% e 1,7% do patrimônio para processos judiciais'
    };
  } else {
    const minimo = patrimonio * 0.015; // 1,5%
    const maximo = patrimonio * 0.017; // 1,7%
    return {
      valor: (minimo + maximo) / 2,
      valorMinimo: minimo,
      valorMaximo: maximo,
      percentual: 1.6,
      descricao: 'Honorários advocatícios extrajudiciais',
      isRange: true,
      tooltip: 'Para inventário extrajudicial, os honorários também variam entre 1,5% e 1,7% do patrimônio'
    };
  }
};
