import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse query params
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json';
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const estado = url.searchParams.get('estado');

    console.log('Exportando diagnósticos:', { format, limit, estado });

    // Build query
    let query = supabase
      .from('diagnosticos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data: diagnosticos, error } = await query;

    if (error) {
      console.error('Erro ao buscar diagnósticos:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar diagnósticos', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format as CSV if requested
    if (format === 'csv') {
      const headers = [
        'ID', 'Nome', 'Cidade', 'Estado', 'Possui Holding', 'CNPJ Holding',
        'Possui Empresas LTDA', 'Empresas (JSON)', 'Faixa Patrimônio',
        'Imóveis Alugados', 'Receita Aluguel', 'Herdeiros (JSON)',
        'Observações', 'Data Criação'
      ];

      const rows = diagnosticos.map(d => [
        d.id,
        `"${(d.nome || '').replace(/"/g, '""')}"`,
        `"${(d.cidade || '').replace(/"/g, '""')}"`,
        d.estado,
        d.possui_holding ? 'Sim' : 'Não',
        d.cnpj_holding || '',
        d.possui_empresas_ltda ? 'Sim' : 'Não',
        `"${JSON.stringify(d.empresas || []).replace(/"/g, '""')}"`,
        d.faixa_patrimonio,
        d.imoveis_alugados ? 'Sim' : 'Não',
        d.receita_aluguel || '',
        `"${JSON.stringify(d.herdeiros || []).replace(/"/g, '""')}"`,
        `"${(d.observacoes || '').replace(/"/g, '""')}"`,
        d.created_at
      ].join(','));

      const csv = [headers.join(','), ...rows].join('\n');

      return new Response(csv, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="diagnosticos_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON by default
    return new Response(
      JSON.stringify({ 
        success: true, 
        total: diagnosticos.length,
        data: diagnosticos 
      }),
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
