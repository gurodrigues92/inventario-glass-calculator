import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Briefcase, Home, Users, FileText, ArrowRight, Plus, Trash2, MapPin, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LuxuryInput from '@/components/ui/LuxuryInput';
import LuxurySelect from '@/components/ui/LuxurySelect';
import LuxuryRadioGroup from '@/components/ui/LuxuryRadioGroup';
import LuxuryTextarea from '@/components/ui/LuxuryTextarea';
import { useDiagnostico, Empresa, Herdeiro } from '@/contexts/DiagnosticoContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const estadosBrasileiros = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

const parentescoOptions = [
  { value: 'conjuge', label: 'Cônjuge' },
  { value: 'filho', label: 'Filho(a)' },
  { value: 'neto', label: 'Neto(a)' },
  { value: 'pai_mae', label: 'Pai/Mãe' },
  { value: 'irmao', label: 'Irmão(ã)' },
  { value: 'outro', label: 'Outro' },
];

const tipoHerdeiroOptions = [
  { value: 'socio', label: 'Sócio' },
  { value: 'herdeiro', label: 'Herdeiro' },
  { value: 'ambos', label: 'Ambos' },
];

export default function Diagnostico() {
  const navigate = useNavigate();
  const { dados, updateField } = useDiagnostico();
  const { user } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseInt(numbers || '0') / 100;
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleAddEmpresa = () => {
    updateField('empresas', [...dados.empresas, { cnpj: '', faturamentoAnual: '' }]);
  };

  const handleRemoveEmpresa = (index: number) => {
    updateField('empresas', dados.empresas.filter((_, i) => i !== index));
  };

  const handleEmpresaChange = (index: number, field: keyof Empresa, value: string) => {
    const updated = [...dados.empresas];
    updated[index] = { ...updated[index], [field]: value };
    updateField('empresas', updated);
  };

  const handleAddHerdeiro = () => {
    updateField('herdeiros', [...dados.herdeiros, { nome: '', parentesco: '', tipo: '' }]);
  };

  const handleRemoveHerdeiro = (index: number) => {
    if (dados.herdeiros.length > 1) {
      updateField('herdeiros', dados.herdeiros.filter((_, i) => i !== index));
    }
  };

  const handleHerdeiroChange = (index: number, field: keyof Herdeiro, value: string) => {
    const updated = [...dados.herdeiros];
    updated[index] = { ...updated[index], [field]: value };
    updateField('herdeiros', updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!dados.nome || dados.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }
    if (!dados.cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    if (!dados.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }
    if (!dados.faixaPatrimonio) {
      newErrors.faixaPatrimonio = 'Selecione a faixa de patrimônio';
    }
    if (!dados.herdeiros[0]?.nome) {
      newErrors.herdeiros = 'Adicione pelo menos um herdeiro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSaving(true);
    
    try {
      // Salvar no Supabase via edge function
      const { data, error } = await supabase.functions.invoke('salvar-diagnostico', {
        body: {
          nome: dados.nome,
          cidade: dados.cidade,
          estado: dados.estado,
          possuiHolding: dados.possuiHolding,
          cnpjHolding: dados.cnpjHolding,
          possuiEmpresasLTDA: dados.possuiEmpresasLTDA,
          empresas: dados.empresas,
          faixaPatrimonio: dados.faixaPatrimonio,
          imoveisAlugados: dados.imoveisAlugados,
          receitaAluguel: dados.receitaAluguel,
          herdeiros: dados.herdeiros,
          observacoes: dados.observacoes,
          usuarioId: user?.id || null
        }
      });

      if (error) {
        console.error('Erro ao salvar diagnóstico:', error);
        toast.error('Erro ao salvar diagnóstico. Tente novamente.');
        return;
      }

      console.log('Diagnóstico salvo:', data);
      toast.success('Diagnóstico salvo com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro ao salvar diagnóstico. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      <main className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Diagnóstico Patrimonial
            </h1>
            <p className="text-muted-foreground text-lg">
              Preencha os dados abaixo para uma análise personalizada
            </p>
          </div>

          <Card className="glass-card p-6 md:p-8 space-y-8">
          {/* Seção 1: Dados Pessoais */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Dados Pessoais</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <LuxuryInput
                label="Nome Completo"
                value={dados.nome}
                onChange={(value) => updateField('nome', value)}
                placeholder="Seu nome completo"
                error={errors.nome}
              />
              <LuxuryInput
                label="Cidade"
                icon={<MapPin className="w-4 h-4" />}
                value={dados.cidade}
                onChange={(value) => updateField('cidade', value)}
                placeholder="Sua cidade"
                error={errors.cidade}
              />
            </div>

            <LuxurySelect
              label="Estado"
              options={estadosBrasileiros}
              value={dados.estado}
              onChange={(value) => updateField('estado', value)}
              placeholder="Selecione o estado"
              error={errors.estado}
            />
          </section>

          <div className="border-t border-border/30" />

          {/* Seção 2: Holding */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Holding Existente</h2>
            </div>

            <LuxuryRadioGroup
              label="Você já possui uma Holding?"
              options={[
                { value: 'nao', label: 'Não' },
                { value: 'sim', label: 'Sim' }
              ]}
              value={dados.possuiHolding ? 'sim' : 'nao'}
              onChange={(value) => updateField('possuiHolding', value === 'sim')}
            />

            {dados.possuiHolding && (
              <div className="animate-fade-in pl-4 border-l-2 border-primary/30">
                <LuxuryInput
                  label="CNPJ da Holding"
                  value={dados.cnpjHolding}
                  onChange={(value) => updateField('cnpjHolding', formatCNPJ(value))}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            )}
          </section>

          <div className="border-t border-border/30" />

          {/* Seção 3: Empresas Operacionais */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Empresas Operacionais LTDA</h2>
            </div>

            <LuxuryRadioGroup
              label="Você possui empresas operacionais LTDA?"
              options={[
                { value: 'nao', label: 'Não' },
                { value: 'sim', label: 'Sim' }
              ]}
              value={dados.possuiEmpresasLTDA ? 'sim' : 'nao'}
              onChange={(value) => {
                updateField('possuiEmpresasLTDA', value === 'sim');
                if (value === 'sim' && dados.empresas.length === 0) {
                  updateField('empresas', [{ cnpj: '', faturamentoAnual: '' }]);
                }
              }}
            />

            {dados.possuiEmpresasLTDA && (
              <div className="animate-fade-in space-y-4 pl-4 border-l-2 border-primary/30">
                {dados.empresas.map((empresa, index) => (
                  <div key={index} className="bg-card/30 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Empresa {index + 1}
                      </span>
                      {dados.empresas.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmpresa(index)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <LuxuryInput
                        label="CNPJ"
                        value={empresa.cnpj}
                        onChange={(value) => handleEmpresaChange(index, 'cnpj', formatCNPJ(value))}
                        placeholder="00.000.000/0000-00"
                      />
                      <LuxuryInput
                        label="Faturamento Anual"
                        value={empresa.faturamentoAnual}
                        onChange={(value) => handleEmpresaChange(index, 'faturamentoAnual', formatCurrency(value))}
                        placeholder="R$ 0,00"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={handleAddEmpresa}
                  className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar outra empresa
                </Button>
              </div>
            )}
          </section>

          <div className="border-t border-border/30" />

          {/* Seção 4: Faixa de Patrimônio */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Faixa de Patrimônio</h2>
            </div>

            <LuxuryRadioGroup
              label="Qual a faixa de patrimônio (valor atual de mercado)?"
              orientation="vertical"
              options={[
                { value: '5M', label: 'Maior que R$ 5 milhões' },
                { value: '20M', label: 'Maior que R$ 20 milhões' },
                { value: '50M', label: 'Maior que R$ 50 milhões' }
              ]}
              value={dados.faixaPatrimonio}
              onChange={(value) => updateField('faixaPatrimonio', value as '5M' | '20M' | '50M')}
            />
            {errors.faixaPatrimonio && (
              <p className="text-sm text-destructive">{errors.faixaPatrimonio}</p>
            )}
          </section>

          <div className="border-t border-border/30" />

          {/* Seção 5: Imóveis Alugados */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Imóveis Alugados</h2>
            </div>

            <LuxuryRadioGroup
              label="Os imóveis estão alugados?"
              options={[
                { value: 'nao', label: 'Não' },
                { value: 'sim', label: 'Sim' }
              ]}
              value={dados.imoveisAlugados ? 'sim' : 'nao'}
              onChange={(value) => updateField('imoveisAlugados', value === 'sim')}
            />

            {dados.imoveisAlugados && (
              <div className="animate-fade-in pl-4 border-l-2 border-primary/30">
                <LuxuryInput
                  label="Receita média mensal de aluguel"
                  value={dados.receitaAluguel}
                  onChange={(value) => updateField('receitaAluguel', formatCurrency(value))}
                  placeholder="R$ 0,00"
                />
              </div>
            )}
          </section>

          <div className="border-t border-border/30" />

          {/* Seção 6: Herdeiros */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Acionistas e Herdeiros</h2>
            </div>

            <div className="space-y-4">
              {dados.herdeiros.map((herdeiro, index) => (
                <div key={index} className="bg-card/30 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Pessoa {index + 1}
                    </span>
                    {dados.herdeiros.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHerdeiro(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <LuxuryInput
                      label="Nome"
                      value={herdeiro.nome}
                      onChange={(value) => handleHerdeiroChange(index, 'nome', value)}
                      placeholder="Nome completo"
                    />
                    <LuxurySelect
                      label="Parentesco"
                      options={parentescoOptions}
                      value={herdeiro.parentesco}
                      onChange={(value) => handleHerdeiroChange(index, 'parentesco', value)}
                      placeholder="Selecione"
                    />
                    <LuxurySelect
                      label="Tipo"
                      options={tipoHerdeiroOptions}
                      value={herdeiro.tipo}
                      onChange={(value) => handleHerdeiroChange(index, 'tipo', value)}
                      placeholder="Selecione"
                    />
                  </div>
                </div>
              ))}
              {errors.herdeiros && (
                <p className="text-sm text-destructive">{errors.herdeiros}</p>
              )}
              <Button
                variant="outline"
                onClick={handleAddHerdeiro}
                className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar pessoa
              </Button>
            </div>
          </section>

          <div className="border-t border-border/30" />

          {/* Seção 7: Observações */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Observações Gerais</h2>
            </div>

            <LuxuryTextarea
              label="Observações"
              value={dados.observacoes}
              onChange={(value) => updateField('observacoes', value)}
              placeholder="Informações adicionais que considera relevantes..."
              rows={4}
            />
          </section>

          {/* Botão Submit */}
          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Continuar para Calculadora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
        </div>
      </main>
    </div>
  );
}
