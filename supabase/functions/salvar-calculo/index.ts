import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const data = await req.json()
    const { usuarioId, nome, email, dadosCalculo, tipoCalculadora } = data

    console.log('Recebendo dados para salvar calculo:', { usuarioId, nome, tipoCalculadora })

    // 1. Buscar ou criar profile
    let profileId: string

    if (usuarioId) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('usuario_id', usuarioId)
        .maybeSingle()

      if (existingProfile) {
        profileId = existingProfile.id
        console.log('Profile existente encontrado:', profileId)
      } else {
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({ nome, email, usuario_id: usuarioId })
          .select('id')
          .single()
        
        if (error) {
          console.error('Erro ao criar profile:', error)
          throw error
        }
        profileId = newProfile.id
        console.log('Novo profile criado:', profileId)
      }
    } else {
      // Usuario anonimo - criar profile temporario
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({ nome: nome || 'Visitante' })
        .select('id')
        .single()
      
      if (error) {
        console.error('Erro ao criar profile anonimo:', error)
        throw error
      }
      profileId = newProfile.id
      console.log('Profile anonimo criado:', profileId)
    }

    // 2. Salvar calculo
    const { data: calculo, error: calculoError } = await supabase
      .from('calculos_inventario')
      .insert({
        profile_id: profileId,
        ...dadosCalculo
      })
      .select('id')
      .single()

    if (calculoError) {
      console.error('Erro ao salvar calculo:', calculoError)
      throw calculoError
    }

    console.log('Calculo salvo com sucesso:', calculo.id)

    // 3. Registrar historico
    await supabase.from('historico_consultas').insert({
      profile_id: profileId,
      tipo_calculadora: tipoCalculadora,
      user_agent: req.headers.get('user-agent')
    })

    // 4. Enviar para n8n webhook
    const N8N_WEBHOOK_CALCULO_URL = 'https://n8n.altavance.media/webhook/calculo-calculadora-psi';

    try {
      const webhookPayload = {
        id: calculo.id,
        usuario: {
          id: usuarioId || null,
          nome: nome || 'Visitante',
          email: email || null
        },
        calculo: {
          patrimonio: dadosCalculo.patrimonio,
          estado: dadosCalculo.estado,
          tipo_processo: dadosCalculo.tipo_processo,
          numero_herdeiros: dadosCalculo.numero_herdeiros,
          tem_testamento: dadosCalculo.tem_testamento,
          tem_menores_incapazes: dadosCalculo.tem_menores_incapazes,
          tem_litigio: dadosCalculo.tem_litigio,
          valor_imoveis: dadosCalculo.valor_imoveis,
          valor_veiculos: dadosCalculo.valor_veiculos,
          valor_investimentos: dadosCalculo.valor_investimentos
        },
        resultado: {
          custo_total: dadosCalculo.custo_total,
          custo_itcmd: dadosCalculo.custo_itcmd,
          custo_honorarios: dadosCalculo.custo_honorarios,
          custo_custas: dadosCalculo.custo_custas,
          tempo_estimado: dadosCalculo.tempo_estimado,
          percentual_sobre_patrimonio: dadosCalculo.percentual_sobre_patrimonio
        },
        tipo_calculadora: tipoCalculadora,
        created_at: new Date().toISOString()
      };

      console.log('Enviando calculo para webhook n8n...');
      
      const webhookResponse = await fetch(N8N_WEBHOOK_CALCULO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });

      if (webhookResponse.ok) {
        console.log('Webhook calculo enviado com sucesso');
      } else {
        console.error('Erro ao enviar webhook calculo:', webhookResponse.status);
      }
    } catch (webhookError) {
      // Não falha a operação principal se o webhook falhar
      console.error('Erro ao chamar webhook calculo:', webhookError);
    }

    return new Response(
      JSON.stringify({ success: true, calculoId: calculo.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erro geral:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
