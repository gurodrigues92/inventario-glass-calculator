import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { usuarioId } = await req.json();

    if (!usuarioId) {
      console.error('[get-user-calculos] usuarioId não fornecido');
      return new Response(
        JSON.stringify({ error: 'usuarioId é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[get-user-calculos] Buscando cálculos para usuário:', usuarioId);

    // Usar service role para bypass de RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Buscar cálculos vinculados ao usuário via profile
    const { data: calculos, error } = await supabaseAdmin
      .from('calculos_inventario')
      .select(`
        id,
        patrimonio,
        estado,
        tipo_processo,
        custo_total,
        tempo_estimado,
        created_at,
        custo_itcmd,
        custo_honorarios,
        custo_custas,
        numero_herdeiros,
        tem_testamento,
        tem_menores_incapazes,
        tem_litigio,
        insights,
        alertas,
        detalhamento,
        comparacao,
        profiles:profile_id (
          id,
          nome,
          email,
          telefone,
          usuario_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[get-user-calculos] Erro ao buscar cálculos:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar cálculos' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filtrar cálculos que pertencem ao usuário
    const calculosDoUsuario = calculos?.filter(calculo => {
      const profile = calculo.profiles;
      return profile && profile.usuario_id === usuarioId;
    }) || [];

    console.log('[get-user-calculos] Encontrados', calculosDoUsuario.length, 'cálculos para o usuário');

    // Formatar para o frontend
    const calculosFormatados = calculosDoUsuario.map(calculo => ({
      ...calculo,
      profile: calculo.profiles
    }));

    return new Response(
      JSON.stringify({ calculos: calculosFormatados }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[get-user-calculos] Erro inesperado:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
