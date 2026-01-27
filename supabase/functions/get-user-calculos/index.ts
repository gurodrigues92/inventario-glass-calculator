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

    // OTIMIZADO: Primeiro buscar o profile_id do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, nome, email, telefone')
      .eq('usuario_id', usuarioId)
      .maybeSingle();

    if (profileError) {
      console.error('[get-user-calculos] Erro ao buscar profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar perfil do usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Se usuário não tem profile, retornar lista vazia
    if (!profile) {
      console.log('[get-user-calculos] Usuário não possui profile, retornando lista vazia');
      return new Response(
        JSON.stringify({ calculos: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[get-user-calculos] Profile encontrado:', profile.id);

    // OTIMIZADO: Buscar cálculos diretamente pelo profile_id (filtro no banco)
    const { data: calculos, error: calculosError } = await supabaseAdmin
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
        comparacao
      `)
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (calculosError) {
      console.error('[get-user-calculos] Erro ao buscar cálculos:', calculosError);
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar cálculos' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[get-user-calculos] Encontrados', calculos?.length || 0, 'cálculos para o usuário');

    // Formatar para o frontend - anexar dados do profile em cada cálculo
    const calculosFormatados = (calculos || []).map(calculo => ({
      ...calculo,
      profile: {
        id: profile.id,
        nome: profile.nome,
        email: profile.email,
        telefone: profile.telefone
      }
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
