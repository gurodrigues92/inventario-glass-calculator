
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, DollarSign, MapPin } from 'lucide-react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '../utils/formatters';

interface CalculoSalvo {
  id: string;
  patrimonio: number;
  estado: string;
  tipo_processo: string;
  custo_total: number;
  tempo_estimado: string;
  created_at: string;
  profile: {
    nome: string;
    email?: string;
    telefone?: string;
  };
}

const CalculosSalvos = () => {
  const navigate = useNavigate();
  const [calculos, setCalculos] = useState<CalculoSalvo[]>([]);
  const [filteredCalculos, setFilteredCalculos] = useState<CalculoSalvo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarCalculos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCalculos(calculos);
    } else {
      const filtered = calculos.filter(calculo =>
        calculo.profile.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calculo.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calculo.profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCalculos(filtered);
    }
  }, [searchTerm, calculos]);

  const carregarCalculos = async () => {
    try {
      const { data, error } = await supabase
        .from('calculos_inventario')
        .select(`
          id,
          patrimonio,
          estado,
          tipo_processo,
          custo_total,
          tempo_estimado,
          created_at,
          profiles:profile_id (
            nome,
            email,
            telefone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const calculosFormatados = data.map(calculo => ({
        ...calculo,
        profile: calculo.profiles
      }));

      setCalculos(calculosFormatados);
      setFilteredCalculos(calculosFormatados);
    } catch (error) {
      console.error('Erro ao carregar cálculos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated">
        <Header />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-white">Carregando cálculos salvos...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-glass hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              
              <h1 className="text-3xl font-bold text-white">
                Cálculos Salvos
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-glass w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por nome, email ou estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-glass/10 border-glass text-white placeholder:text-glass/60"
              />
            </div>
          </div>

          {/* Results */}
          {filteredCalculos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-glass text-lg">
                {calculos.length === 0 
                  ? 'Nenhum cálculo salvo encontrado.'
                  : 'Nenhum resultado encontrado para sua busca.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredCalculos.map((calculo) => (
                <div
                  key={calculo.id}
                  className="bg-glass/10 backdrop-blur-sm border border-glass/30 rounded-lg p-6 hover:bg-glass/20 transition-colors"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Info do Cliente */}
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {calculo.profile.nome}
                      </h3>
                      {calculo.profile.email && (
                        <p className="text-glass text-sm">{calculo.profile.email}</p>
                      )}
                      {calculo.profile.telefone && (
                        <p className="text-glass text-sm">{calculo.profile.telefone}</p>
                      )}
                    </div>

                    {/* Dados do Patrimônio */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-glass text-sm">Patrimônio</span>
                      </div>
                      <p className="text-white font-semibold">
                        {formatCurrency(calculo.patrimonio)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span className="text-glass text-sm">{calculo.estado}</span>
                      </div>
                    </div>

                    {/* Resultado */}
                    <div>
                      <p className="text-glass text-sm mb-2">Custo Total</p>
                      <p className="text-white font-semibold text-lg">
                        {formatCurrency(calculo.custo_total)}
                      </p>
                      {calculo.tempo_estimado && (
                        <p className="text-glass text-sm mt-1">
                          {calculo.tempo_estimado}
                        </p>
                      )}
                    </div>

                    {/* Data e Ações */}
                    <div className="flex flex-col justify-between">
                      <div className="flex items-center space-x-2 mb-4">
                        <Calendar className="w-4 h-4 text-glass" />
                        <span className="text-glass text-sm">
                          {formatDate(calculo.created_at)}
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => {
                          // Implementar visualização detalhada
                          console.log('Ver detalhes do cálculo:', calculo.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-glass text-glass hover:bg-glass/10"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {calculos.length > 0 && (
            <div className="mt-8 bg-glass/10 backdrop-blur-sm border border-glass/30 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Resumo</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-glass text-sm">Total de Cálculos</p>
                  <p className="text-white text-2xl font-bold">{calculos.length}</p>
                </div>
                <div>
                  <p className="text-glass text-sm">Patrimônio Total Calculado</p>
                  <p className="text-white text-2xl font-bold">
                    {formatCurrency(calculos.reduce((sum, calc) => sum + calc.patrimonio, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-glass text-sm">Custos Totais Calculados</p>
                  <p className="text-white text-2xl font-bold">
                    {formatCurrency(calculos.reduce((sum, calc) => sum + calc.custo_total, 0))}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalculosSalvos;
