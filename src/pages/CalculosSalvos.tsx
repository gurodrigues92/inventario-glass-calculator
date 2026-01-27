
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CalculosHeader from '../components/calculos-salvos/CalculosHeader';
import SearchBar from '../components/calculos-salvos/SearchBar';
import CalculoCard from '../components/calculos-salvos/CalculoCard';
import SummarySection from '../components/calculos-salvos/SummarySection';
import EmptyState from '../components/calculos-salvos/EmptyState';

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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      carregarCalculos();
    }
  }, [user?.id]);

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
  };


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
          />

          {filteredCalculos.length === 0 ? (
            <EmptyState 
              hasCalculos={calculos.length > 0}
              hasSearchTerm={searchTerm.trim() !== ''}
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
