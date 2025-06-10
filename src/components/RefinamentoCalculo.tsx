
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { formatCurrency } from '../utils/formatters';

interface DadosRefinamento {
  valorVenalImoveis?: string;
  valorMercadoImoveis?: string;
  valorFipeVeiculos?: string;
  temTestamento?: boolean;
  temMenoresIncapazes?: boolean;
  temLitigio?: boolean;
  separacaoTotalBens?: boolean;
  dividasGarantia?: string;
  debitosTributarios?: string;
  despesasMedicas?: string;
  percentualHonorarios?: string;
  comarca?: string;
  unicoImovelResidencial?: boolean;
  herdeirosComIsencao?: boolean;
  empresaFamiliar?: boolean;
}

interface RefinamentoCalculoProps {
  resultadoInicial: {
    custoTotal: number;
    patrimonio: number;
    estado: string;
  };
  onRefinar: (dados: DadosRefinamento) => void;
}

const RefinamentoCalculo = ({ resultadoInicial, onRefinar }: RefinamentoCalculoProps) => {
  const [mostrarRefinamento, setMostrarRefinamento] = useState(false);
  const [dadosRefinados, setDadosRefinados] = useState<DadosRefinamento>({});

  const handleRefinar = () => {
    onRefinar(dadosRefinados);
  };

  const updateField = (field: keyof DadosRefinamento, value: any) => {
    setDadosRefinados(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mb-12">
      <GlassCard className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <div className="text-center">
          <h3 className="heading-md mb-2">🎯 Deseja um Cálculo Mais Preciso?</h3>
          <p className="text-glass mb-6">
            Adicione informações específicas do seu caso para refinar a estimativa
          </p>
          
          <button 
            onClick={() => setMostrarRefinamento(!mostrarRefinamento)}
            className="glass-button px-8 py-3"
          >
            {mostrarRefinamento ? 'Ocultar Refinamento' : 'Refinar Cálculo'}
          </button>
        </div>

        {mostrarRefinamento && (
          <div className="mt-8 space-y-6">
            {/* Seção 1: Valores Reais dos Bens */}
            <div className="bg-glass-white rounded-lg p-6 border border-glass-border">
              <h4 className="text-lg font-semibold text-white mb-4">1. Valores Específicos dos Bens</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-glass mb-2">Valor Venal Total dos Imóveis (IPTU)</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('valorVenalImoveis', e.target.value)}
                  />
                  <span className="text-xs text-glass-light mt-1 block">Base para cálculo do ITCMD em alguns estados</span>
                </div>
                
                <div>
                  <label className="block text-sm text-glass mb-2">Valor de Mercado dos Imóveis</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('valorMercadoImoveis', e.target.value)}
                  />
                  <span className="text-xs text-glass-light mt-1 block">Valor real de venda atual</span>
                </div>
                
                <div>
                  <label className="block text-sm text-glass mb-2">Valor FIPE dos Veículos</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('valorFipeVeiculos', e.target.value)}
                  />
                  <span className="text-xs text-glass-light mt-1 block">Consulte em veiculos.fipe.org.br</span>
                </div>
              </div>
            </div>

            {/* Seção 2: Situação Jurídica */}
            <div className="bg-glass-white rounded-lg p-6 border border-glass-border">
              <h4 className="text-lg font-semibold text-white mb-4">2. Situação Jurídica Específica</h4>
              
              <div className="space-y-3">
                {[
                  { key: 'temTestamento', label: 'Existe testamento registrado' },
                  { key: 'temMenoresIncapazes', label: 'Há menores ou incapazes entre os herdeiros' },
                  { key: 'temLitigio', label: 'Existe possibilidade de litígio/contestação' },
                  { key: 'separacaoTotalBens', label: 'Falecido tinha regime de separação total de bens' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-3 text-glass cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-glass-border bg-glass-dark text-purple-500 focus:ring-purple-500"
                      onChange={(e) => updateField(key as keyof DadosRefinamento, e.target.checked)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seção 3: Dívidas e Pendências */}
            <div className="bg-glass-white rounded-lg p-6 border border-glass-border">
              <h4 className="text-lg font-semibold text-white mb-4">3. Dívidas e Obrigações</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-glass mb-2">Dívidas com Garantia Real (Hipoteca, Alienação)</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('dividasGarantia', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-glass mb-2">Débitos Tributários (IPTU, ITR, IR)</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('debitosTributarios', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-glass mb-2">Despesas Médicas e Funerárias</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('despesasMedicas', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Seção 4: Custos Específicos */}
            <div className="bg-glass-white rounded-lg p-6 border border-glass-border">
              <h4 className="text-lg font-semibold text-white mb-4">4. Custos Já Conhecidos</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-glass mb-2">Proposta de Honorários Advocatícios</label>
                  <select 
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white"
                    onChange={(e) => updateField('percentualHonorarios', e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="6">6% do patrimônio</option>
                    <option value="8">8% do patrimônio</option>
                    <option value="10">10% do patrimônio</option>
                    <option value="fixo">Valor fixo acordado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-glass mb-2">Comarca do Inventário</label>
                  <input 
                    type="text" 
                    placeholder="Ex: São Paulo - Capital"
                    className="w-full bg-glass-dark border border-glass-border rounded-lg px-4 py-3 text-white placeholder-glass"
                    onChange={(e) => updateField('comarca', e.target.value)}
                  />
                  <span className="text-xs text-glass-light mt-1 block">Para buscar tabela de custas específica</span>
                </div>
              </div>
            </div>

            {/* Seção 5: Benefícios e Isenções */}
            <div className="bg-glass-white rounded-lg p-6 border border-glass-border">
              <h4 className="text-lg font-semibold text-white mb-4">5. Possíveis Benefícios</h4>
              
              <div className="space-y-3">
                {[
                  { key: 'unicoImovelResidencial', label: 'Único imóvel residencial da família' },
                  { key: 'herdeirosComIsencao', label: 'Herdeiros com direito à isenção (deficiência, etc)' },
                  { key: 'empresaFamiliar', label: 'Empresa familiar ou rural com benefícios' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-3 text-glass cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-glass-border bg-glass-dark text-purple-500 focus:ring-purple-500"
                      onChange={(e) => updateField(key as keyof DadosRefinamento, e.target.checked)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button 
                onClick={handleRefinar}
                className="glass-button px-8 py-3 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>Recalcular com Dados Refinados</span>
              </button>
              
              <button className="border border-glass-border text-white px-8 py-3 rounded-lg hover:bg-glass-white transition-all">
                💾 Salvar Dados para Consulta Posterior
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default RefinamentoCalculo;
