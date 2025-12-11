
import { DetalhamentoCusto } from '../types/calculator';

// Honorários advocatícios - 8% fixo para todos os casos
export const calcularHonorariosVariaveis = (patrimonio: number, tipoProcesso: string, temLitigio: boolean = false): DetalhamentoCusto => {
  const valor = patrimonio * 0.08; // 8% fixo
  
  return {
    valor: valor,
    percentual: 8,
    descricao: 'Honorários advocatícios',
    isRange: false,
    tooltip: 'Honorários advocatícios correspondem a 8% do patrimônio total'
  };
};
