
-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para armazenar os cálculos realizados
CREATE TABLE public.calculos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados do patrimônio
  patrimonio DECIMAL NOT NULL,
  estado TEXT NOT NULL,
  tipo_processo TEXT NOT NULL,
  numero_herdeiros INTEGER DEFAULT 1,
  tem_testamento BOOLEAN DEFAULT false,
  tem_menores_incapazes BOOLEAN DEFAULT false,
  tem_litigio BOOLEAN DEFAULT false,
  
  -- Detalhamento de bens
  valor_imoveis DECIMAL DEFAULT 0,
  valor_veiculos DECIMAL DEFAULT 0,
  valor_investimentos DECIMAL DEFAULT 0,
  valor_outros_bens DECIMAL DEFAULT 0,
  dividas_espolio DECIMAL DEFAULT 0,
  
  -- Resultados calculados
  custo_total DECIMAL NOT NULL,
  custo_itcmd DECIMAL NOT NULL,
  custo_honorarios DECIMAL NOT NULL,
  custo_custas DECIMAL NOT NULL,
  tempo_estimado TEXT,
  percentual_sobre_patrimonio DECIMAL,
  
  -- Insights e alertas (JSON)
  insights JSONB,
  alertas JSONB,
  detalhamento JSONB,
  comparacao JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para armazenar refinamentos
CREATE TABLE public.calculos_refinados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculo_original_id UUID REFERENCES public.calculos_inventario(id) ON DELETE CASCADE,
  
  -- Dados refinados
  total_refinado DECIMAL NOT NULL,
  patrimonio_liquido DECIMAL,
  ajustes JSONB,
  isencoes JSONB,
  comparativo JSONB,
  tem_litigio_refinado BOOLEAN,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico para analytics
CREATE TABLE public.historico_consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tipo_calculadora TEXT NOT NULL, -- 'basica' ou 'avancada'
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculos_refinados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_consultas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acesso público (já que não temos autenticação ainda)
-- Permitir inserção para qualquer um
CREATE POLICY "Permitir inserção pública" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção pública" ON public.calculos_inventario FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção pública" ON public.calculos_refinados FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção pública" ON public.historico_consultas FOR INSERT WITH CHECK (true);

-- Permitir leitura para qualquer um (para demonstração - em produção seria mais restritivo)
CREATE POLICY "Permitir leitura pública" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON public.calculos_inventario FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON public.calculos_refinados FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON public.historico_consultas FOR SELECT USING (true);

-- Criar índices para melhor performance
CREATE INDEX idx_calculos_inventario_profile_id ON public.calculos_inventario(profile_id);
CREATE INDEX idx_calculos_inventario_created_at ON public.calculos_inventario(created_at DESC);
CREATE INDEX idx_calculos_inventario_estado ON public.calculos_inventario(estado);
CREATE INDEX idx_calculos_refinados_calculo_original_id ON public.calculos_refinados(calculo_original_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_historico_consultas_profile_id ON public.historico_consultas(profile_id);
