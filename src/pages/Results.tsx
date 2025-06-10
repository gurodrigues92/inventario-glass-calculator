
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, calculationType } = location.state || {};

  if (!formData) {
    navigate('/');
    return null;
  }

  // Simular cálculos
  const patrimonio = parseFloat(formData.patrimonio.replace(/[R$.\s]/g, '').replace(',', '.')) || 0;
  
  const aliquotas: Record<string, number> = {
    'SP': 0.04, 'RJ': 0.08, 'MG': 0.05, 'RS': 0.03,
    'PR': 0.06, 'SC': 0.08, 'BA': 0.05, 'GO': 0.04,
    'PE': 0.08, 'CE': 0.06
  };

  const aliquota = aliquotas[formData.estado] || 0.04;
  const itcmd = patrimonio * aliquota;
  const custas = formData.tipoProcesso === 'judicial' ? patrimonio * 0.02 : patrimonio * 0.01;
  const honorarios = formData.tipoProcesso === 'judicial' ? patrimonio * 0.05 : patrimonio * 0.03;
  const total = itcmd + custas + honorarios;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const metrics = [
    {
      label: 'ITCMD a pagar',
      value: formatCurrency(itcmd),
      description: `Alíquota de ${(aliquota * 100).toFixed(1)}% em ${formData.estado}`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Custas do processo',
      value: formatCurrency(custas),
      description: `Processo ${formData.tipoProcesso}`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Honorários advocatícios',
      value: formatCurrency(honorarios),
      description: 'Estimativa baseada no patrimônio',
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Custo total estimado',
      value: formatCurrency(total),
      description: 'Soma de todos os custos',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-glass hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12 fade-in-up">
            <div className="badge-top inline-block mb-4">Resultado do Cálculo</div>
            <h1 className="heading-lg mb-4">Análise Completa dos Custos</h1>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {formatCurrency(total)}
              </div>
              <p className="text-glass mt-2">Custo total estimado do inventário</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <GlassCard key={index} className={`fade-in-up stagger-${index + 1} text-center`}>
                <div className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
                  {metric.value}
                </div>
                <h3 className="font-semibold text-white mb-1">{metric.label}</h3>
                <p className="text-xs text-glass">{metric.description}</p>
              </GlassCard>
            ))}
          </div>

          {/* Breakdown Chart Placeholder */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <GlassCard className="fade-in-up stagger-2">
              <h3 className="heading-md mb-6">Composição dos Custos</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-glass">ITCMD</span>
                  <span className="text-white font-semibold">{((itcmd / total) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(itcmd / total) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-glass">Custas</span>
                  <span className="text-white font-semibold">{((custas / total) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(custas / total) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-glass">Honorários</span>
                  <span className="text-white font-semibold">{((honorarios / total) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(honorarios / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="fade-in-up stagger-3">
              <h3 className="heading-md mb-6">Comparação de Processos</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-semibold text-green-400 mb-2">Extrajudicial</h4>
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatCurrency(itcmd + (patrimonio * 0.01) + (patrimonio * 0.03))}
                  </div>
                  <p className="text-sm text-glass">Mais rápido e econômico</p>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-semibold text-orange-400 mb-2">Judicial</h4>
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatCurrency(itcmd + (patrimonio * 0.02) + (patrimonio * 0.05))}
                  </div>
                  <p className="text-sm text-glass">Processo tradicional</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="glass-button px-8 py-3 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Baixar Relatório PDF</span>
            </button>
            
            <button className="glass-button px-8 py-3 flex items-center space-x-2">
              <Share className="w-4 h-4" />
              <span>Compartilhar Resultado</span>
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="border border-glass-border text-white px-8 py-3 rounded-lg hover:bg-glass-white transition-all"
            >
              Nova Consulta
            </button>
          </div>

          {/* Disclaimer */}
          <GlassCard className="mt-12 fade-in-up stagger-4">
            <div className="text-center">
              <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Importante</h3>
              <p className="text-sm text-glass">
                Este cálculo é uma estimativa baseada em valores médios e legislação atual. 
                Os valores reais podem variar conforme particularidades do caso. 
                Recomendamos consultar um advogado especialista para orientação personalizada.
              </p>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Results;
