import React from 'react';
import { formatCurrencyWithDecimals } from '../../utils/formatters';
import GlassCard from '../GlassCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Trophy } from 'lucide-react';

interface ComparisonSectionProps {
  custoTotalPF: number;
  custoTotalLTDA: number;
  custoTotalSA: number;
  patrimonio: number;
}

interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
  index?: number;
  data: Array<{
    name: string;
    valor: number;
    color: string;
    percentual: string;
  }>;
  isMobile: boolean;
}

const CustomLabel = (props: CustomLabelProps) => {
  const { x, y, width, value, index, data, isMobile } = props;
  
  if (index === undefined || !data[index]) return null;
  
  const item = data[index];
  
  // Default values to avoid NaN
  const xPos = x !== undefined ? x : 0;
  const widthVal = width !== undefined ? width : 0;
  const yPos = y !== undefined ? y : 0;

  return (
    <text 
      x={xPos + widthVal + 10} 
      y={yPos + 15} 
      fill={item.color} 
      fontSize={isMobile ? 11 : 13}
      fontWeight="600"
    >
      {value !== undefined ? formatCurrencyWithDecimals(value) : ''} ({item.percentual}%)
    </text>
  );
};

const ComparisonSection = ({ custoTotalPF, custoTotalLTDA, custoTotalSA, patrimonio }: ComparisonSectionProps) => {
  const isMobile = useIsMobile();

  const economiaMaxima = custoTotalPF - custoTotalSA;
  const economiaMaximaPercentual = custoTotalPF > 0 ? ((economiaMaxima / custoTotalPF) * 100).toFixed(0) : '0';

  const data = [
    { 
      name: 'Pessoa Física', 
      valor: custoTotalPF, 
      color: '#E74C3C',
      percentual: patrimonio > 0 ? ((custoTotalPF / patrimonio) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Holding LTDA', 
      valor: custoTotalLTDA, 
      color: '#F39C12',
      percentual: patrimonio > 0 ? ((custoTotalLTDA / patrimonio) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Holding S/A', 
      valor: custoTotalSA, 
      color: '#27AE60',
      percentual: patrimonio > 0 ? ((custoTotalSA / patrimonio) * 100).toFixed(1) : '0'
    },
  ];

  const maxValue = Math.max(...data.map(d => d.valor));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Gráfico Comparativo */}
      <GlassCard premium>
        <div className="text-center mb-6">
          <div 
            className={`inline-flex items-center gap-2 ${isMobile ? 'px-4 py-1' : 'px-6 py-2'} rounded-full mb-4`}
            style={{
              background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
              color: '#0C2C45',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '700'
            }}
          >
            📊 Comparativo de Custos
          </div>
          
          <h3 
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}
            style={{ color: '#0C2C45' }}
          >
            Análise Comparativa Completa
          </h3>
          <p 
            className={`${isMobile ? 'text-sm' : ''}`}
            style={{ color: '#476D9E' }}
          >
            Veja lado a lado as três opções para seu patrimônio
          </p>
        </div>

        {/* Gráfico de Barras Horizontais */}
        <div className={`${isMobile ? 'h-48' : 'h-56'} w-full mb-6`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ 
                top: 5, 
                right: isMobile ? 100 : 180, 
                left: isMobile ? 10 : 20, 
                bottom: 5 
              }}
            >
              <XAxis type="number" hide domain={[0, maxValue * 1.1]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={isMobile ? 80 : 100}
                tick={{ fontSize: isMobile ? 11 : 13, fill: '#476D9E' }}
              />
              <Bar 
                dataKey="valor" 
                radius={[0, 8, 8, 0]}
                barSize={isMobile ? 30 : 40}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList content={(props: any) => <CustomLabel {...props} data={data} isMobile={isMobile} />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Destaque Economia Máxima */}
        <div 
          className={`${isMobile ? 'p-4' : 'p-6'} rounded-xl text-center`}
          style={{ 
            background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(46, 204, 113, 0.1))',
            border: '2px solid #27AE60'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6" style={{ color: '#27AE60' }} />
            <span 
              className={`${isMobile ? 'text-base' : 'text-lg'} font-bold`}
              style={{ color: '#27AE60' }}
            >
              Economia Máxima com Holding S/A
            </span>
          </div>
          <div 
            className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-1`}
            style={{ color: '#27AE60' }}
          >
            {formatCurrencyWithDecimals(economiaMaxima)}
          </div>
          <div 
            className={`${isMobile ? 'text-sm' : ''}`}
            style={{ color: '#476D9E' }}
          >
            {economiaMaximaPercentual}% de economia em relação à Pessoa Física
          </div>
        </div>
      </GlassCard>

      {/* Tabela Comparativa */}
      <GlassCard>
        <h4 
          className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-4`}
          style={{ color: '#0C2C45' }}
        >
          📋 Detalhamento por Cenário
        </h4>

        <div className={`overflow-x-auto ${isMobile ? '-mx-4 px-4' : ''}`}>
          <table className="w-full min-w-[400px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #E8E2DD' }}>
                <th className={`text-left ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#476D9E' }}>
                  Tributo/Custo
                </th>
                <th className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#E74C3C' }}>
                  Pessoa Física
                </th>
                <th className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#F39C12' }}>
                  Holding LTDA
                </th>
                <th className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#27AE60' }}>
                  Holding S/A
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F0EBE6' }}>
                <td className={`${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#476D9E' }}>ITCMD</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#E74C3C' }}>Alíquota do Estado</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#F39C12' }}>Alíquota (Doação)</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'} font-bold`} style={{ color: '#27AE60' }}>0%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F0EBE6' }}>
                <td className={`${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#476D9E' }}>Ganho de Capital</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#E74C3C' }}>15%</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#F39C12' }}>15%</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'} font-bold`} style={{ color: '#27AE60' }}>0%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F0EBE6' }}>
                <td className={`${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#476D9E' }}>Honorários</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#E74C3C' }}>10-20%</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#F39C12' }}>R$ 60.000</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#27AE60' }}>1,5%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F0EBE6' }}>
                <td className={`${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#476D9E' }}>Cartório</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#E74C3C' }}>2%</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#F39C12' }}>0,5%</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#27AE60' }}>Incluso</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F0EBE6' }}>
                <td className={`${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#476D9E' }}>ITBI</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#E74C3C' }}>N/A</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'}`} style={{ color: '#F39C12' }}>3%*</td>
                <td className={`text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'} font-bold`} style={{ color: '#27AE60' }}>Isento**</td>
              </tr>
              <tr style={{ background: 'rgba(209, 191, 163, 0.1)' }}>
                <td className={`${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} font-bold`} style={{ color: '#0C2C45' }}>TOTAL</td>
                <td className={`text-center ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} font-bold`} style={{ color: '#E74C3C' }}>
                  {formatCurrencyWithDecimals(custoTotalPF)}
                </td>
                <td className={`text-center ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} font-bold`} style={{ color: '#F39C12' }}>
                  {formatCurrencyWithDecimals(custoTotalLTDA)}
                </td>
                <td className={`text-center ${isMobile ? 'py-3 text-sm' : 'py-4 text-base'} font-bold`} style={{ color: '#27AE60' }}>
                  {formatCurrencyWithDecimals(custoTotalSA)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notas de rodapé ITBI */}
        <div className={`mt-4 space-y-1 ${isMobile ? 'text-xs' : 'text-xs'}`} style={{ color: '#9FB7D4' }}>
          <div>* ITBI de 3% incide sobre a diferença entre o valor de mercado e o valor histórico declarado no IR dos imóveis transferidos para a Holding LTDA.</div>
          <div>** A isenção de ITBI na Holding S/A é condicional: a receita de aluguéis não pode ultrapassar 50% da receita total da empresa. Caso contrário, o ITBI será cobrado normalmente.</div>
        </div>

        {/* Legenda */}
        <div className={`mt-4 flex flex-wrap gap-4 justify-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#E74C3C' }} />
            <span style={{ color: '#476D9E' }}>Maior custo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#F39C12' }} />
            <span style={{ color: '#476D9E' }}>Intermediário</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#27AE60' }} />
            <span style={{ color: '#476D9E' }}>Maior segurança na sucessão e menor custo</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ComparisonSection;
