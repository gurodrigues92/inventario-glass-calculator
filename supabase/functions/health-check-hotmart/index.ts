import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthCheckResult {
  timestamp: string;
  alerts: string[];
  status: 'healthy' | 'warning' | 'critical';
}

async function enviarAlerta(mensagem: string) {
  const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured');
    return;
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `⚠️ *ALERTA HEALTH CHECK HOTMART*\n\n${mensagem}`,
          parse_mode: 'Markdown'
        })
      }
    );
  } catch (error) {
    console.error('Error sending alert:', error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Running health check...');

    const result: HealthCheckResult = {
      timestamp: new Date().toISOString(),
      alerts: [],
      status: 'healthy'
    };

    // 1. Verificar taxa de erro elevada (últimas 10 compras)
    const { data: ultimas10, error: errorUltimas } = await supabase
      .from('log_compras_hotmart')
      .select('status')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!errorUltimas && ultimas10 && ultimas10.length > 0) {
      const erros = ultimas10.filter(l => l.status.startsWith('erro_')).length;
      const taxaErro = (erros / ultimas10.length) * 100;
      
      if (taxaErro > 15) {
        const alerta = `Taxa de erro crítica: ${taxaErro.toFixed(1)}% nas últimas ${ultimas10.length} compras`;
        result.alerts.push(alerta);
        result.status = 'critical';
        await enviarAlerta(alerta);
      }
    }

    // 2. Verificar webhook sem atividade suspeita (últimas 6 horas)
    const seisHorasAtras = new Date();
    seisHorasAtras.setHours(seisHorasAtras.getHours() - 6);

    const { data: ultimaCompra, error: errorUltima } = await supabase
      .from('log_compras_hotmart')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!errorUltima && ultimaCompra) {
      const ultimaCompraDate = new Date(ultimaCompra.created_at);
      const horaAtual = new Date().getHours();
      
      // Verificar apenas em horário comercial (8h às 22h)
      if (horaAtual >= 8 && horaAtual <= 22) {
        if (ultimaCompraDate < seisHorasAtras) {
          const alerta = `⚠️ Nenhuma compra nas últimas 6 horas (última: ${ultimaCompraDate.toLocaleString('pt-BR')})`;
          result.alerts.push(alerta);
          if (result.status === 'healthy') result.status = 'warning';
          await enviarAlerta(alerta);
        }
      }
    }

    // 3. Verificar compras pendentes de email
    const { data: pendentes, error: errorPendentes } = await supabase
      .from('log_compras_hotmart')
      .select('id, email, created_at')
      .in('status', ['usuario_criado', 'usuario_atualizado'])
      .gte('created_at', seisHorasAtras.toISOString());

    if (!errorPendentes && pendentes && pendentes.length > 0) {
      const alerta = `${pendentes.length} compras sem email enviado:\n${pendentes.map(p => `- ${p.email}`).join('\n')}`;
      result.alerts.push(alerta);
      if (result.status === 'healthy') result.status = 'warning';
      await enviarAlerta(alerta);
    }

    // 4. Verificar tokens expirados sem uso (últimas 48h)
    const doisDiasAtras = new Date();
    doisDiasAtras.setDate(doisDiasAtras.getDate() - 2);

    const { data: tokensExpirados, error: errorTokens } = await supabase
      .from('usuarios')
      .select('email, token_gerado_em')
      .not('token_definicao_senha', 'is', null)
      .is('senha_hash', null)
      .lt('token_gerado_em', doisDiasAtras.toISOString());

    if (!errorTokens && tokensExpirados && tokensExpirados.length > 5) {
      const alerta = `${tokensExpirados.length} clientes não definiram senha (tokens > 48h)`;
      result.alerts.push(alerta);
      if (result.status === 'healthy') result.status = 'warning';
      await enviarAlerta(alerta);
    }

    console.log(`Health check completed: ${result.status}`, result.alerts);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in health-check-hotmart:', error);
    await enviarAlerta(`🔴 Erro no health check: ${(error instanceof Error ? error.message : String(error))}`);
    
    return new Response(
      JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
