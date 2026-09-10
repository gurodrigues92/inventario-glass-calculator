import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { usuarioDaSessao, respostaSemSessao } from '../_shared/sessao.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-sessao',
}

// Revalida a sessao guardada no navegador. O front chama isso ao abrir o app:
// se a conta foi desativada ou o token venceu, a sessao cai na hora em vez de
// durar pra sempre no localStorage.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        db: { schema: 'inventario_glass' },
        global: { headers: { 'Accept-Profile': 'inventario_glass', 'Content-Profile': 'inventario_glass' } }
      }
    )

    const usuario = await usuarioDaSessao(req, supabase)
    if (!usuario) return respostaSemSessao(corsHeaders)

    return new Response(JSON.stringify({ success: true, user: usuario }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Erro em auth-sessao:', error)
    return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
