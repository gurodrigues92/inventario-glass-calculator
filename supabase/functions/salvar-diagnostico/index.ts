import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiagnosticoData {
  nome: string;
  cidade: string;
  estado: string;
  possuiHolding: boolean;
  cnpjHolding: string;
  possuiEmpresasLTDA: boolean;
  empresas: Array<{ cnpj: string; faturamentoAnual: string }>;
  faixaPatrimonio: string;
  imoveisAlugados: boolean;
  receitaAluguel: string;
  herdeiros: Array<{ nome: string; parentesco: string; tipo: string }>;
  observacoes: string;
  usuarioId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const data: DiagnosticoData = await req.json();
    
    console.log('Recebendo diagnóstico:', {
      nome: data.nome,
      cidade: data.cidade,
      estado: data.estado,
      faixaPatrimonio: data.faixaPatrimonio
    });

    // Validação básica
    if (!data.nome || !data.cidade || !data.estado || !data.faixaPatrimonio) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios não preenchidos' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Inserir no banco
    const { data: diagnostico, error } = await supabase
      .from('diagnosticos')
      .insert({
        usuario_id: data.usuarioId || null,
        nome: data.nome,
        cidade: data.cidade,
        estado: data.estado,
        possui_holding: data.possuiHolding,
        cnpj_holding: data.cnpjHolding || null,
        possui_empresas_ltda: data.possuiEmpresasLTDA,
        empresas: data.empresas,
        faixa_patrimonio: data.faixaPatrimonio,
        imoveis_alugados: data.imoveisAlugados,
        receita_aluguel: data.receitaAluguel || null,
        herdeiros: data.herdeiros,
        observacoes: data.observacoes || null
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar diagnóstico:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar diagnóstico', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Diagnóstico salvo com sucesso:', diagnostico.id);

    // Enviar para n8n webhook de produção
    const N8N_WEBHOOK_URL = 'https://n8n.altavance.media/webhook/diagnostico-calculadora-psi';

    try {
      const webhookPayload = {
        id: diagnostico.id,
        nome: data.nome,
        cidade: data.cidade,
        estado: data.estado,
        faixa_patrimonio: data.faixaPatrimonio,
        possui_holding: data.possuiHolding,
        cnpj_holding: data.cnpjHolding || null,
        possui_empresas_ltda: data.possuiEmpresasLTDA,
        empresas: data.empresas,
        imoveis_alugados: data.imoveisAlugados,
        receita_aluguel: data.receitaAluguel || null,
        herdeiros: data.herdeiros,
        observacoes: data.observacoes || null,
        created_at: diagnostico.created_at
      };

      console.log('Enviando para webhook n8n...');
      
      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });

      if (webhookResponse.ok) {
        console.log('Webhook n8n enviado com sucesso');
      } else {
        console.error('Erro ao enviar webhook n8n:', webhookResponse.status);
      }
    } catch (webhookError) {
      // Não falha a operação principal se o webhook falhar
      console.error('Erro ao chamar webhook n8n:', webhookError);
    }

    return new Response(
      JSON.stringify({ success: true, id: diagnostico.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro inesperado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
