
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CalculosHeader from '../components/calculos-salvos/CalculosHeader';
import SearchBar from '../components/calculos-salvos/SearchBar';
import CalculoCard from '../components/calculos-salvos/CalculoCard';
import SummarySection from '../components/calculos-salvos/SummarySection';
import EmptyState from '../components/calculos-salvos/EmptyState';
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
  const [calculos, setCalculos] = useState<CalculoSalvo[]>([]);
  const [filteredCalculos, setFilteredCalculos] = useState<CalculoSalvo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      carregarCalculos();
    }
  }, [carregarCalculos, user?.id]);

  useEffect(() => {
    let filtered = calculos;

    // Filtrar por tipo de processo
    if (tipoFiltro !== 'todos') {
      filtered = filtered.filter(calculo => calculo.tipo_processo === tipoFiltro);
    }

    // Filtrar por termo de busca
    if (searchTerm.trim() !== '') {
      const termo = searchTerm.toLowerCase();
      filtered = filtered.filter(calculo => {
        // Buscar por estado
        if (calculo.estado.toLowerCase().includes(termo)) return true;
        
        // Buscar por valor de patrimônio (formatado ou numérico)
        const patrimonioStr = calculo.patrimonio.toString();
        if (patrimonioStr.includes(termo)) return true;
        
        // Buscar por custo total
        const custoStr = calculo.custo_total.toString();
        if (custoStr.includes(termo)) return true;
        
        // Buscar por data (formato brasileiro)
        const data = new Date(calculo.created_at);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        if (dataFormatada.includes(termo)) return true;
        
        // Buscar por nome do perfil
        if (calculo.profile.nome.toLowerCase().includes(termo)) return true;
        
        // Buscar por email
        if (calculo.profile.email?.toLowerCase().includes(termo)) return true;

        return false;
      });
    }

    setFilteredCalculos(filtered);
  }, [searchTerm, tipoFiltro, calculos]);

  const carregarCalculos = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Usar edge function para buscar cálculos do usuário
      const { data, error } = await supabase.functions.invoke('get-user-calculos', {
        body: { usuarioId: user.id }
      });

      if (error) throw error;

      const calculosFormatados = data.calculos || [];
      setCalculos(calculosFormatados);
      setFilteredCalculos(calculosFormatados);
    } catch (error) {
      console.error('Erro ao carregar cálculos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated">
        <Header />
        <main className="pt-36 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div style={{ color: '#2C2C2C' }}>Carregando cálculos salvos...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-36 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <CalculosHeader />
          
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            tipoFiltro={tipoFiltro}
            onTipoFiltroChange={setTipoFiltro}
          />

          {filteredCalculos.length === 0 ? (
            <EmptyState 
              hasCalculos={calculos.length > 0}
              hasSearchTerm={searchTerm.trim() !== '' || tipoFiltro !== 'todos'}
            />
          ) : (
            <div className="grid gap-6">
              {filteredCalculos.map((calculo) => (
                <CalculoCard
                  key={calculo.id}
                  calculo={calculo}
                />
              ))}
            </div>
          )}

          <SummarySection calculos={calculos} />
        </div>
      </main>
    </div>
  );
};

export default CalculosSalvos;
