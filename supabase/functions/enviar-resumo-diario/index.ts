import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EstatisticasDia {
  total: number;
  sucesso: number;
  erro: number;
  taxa_sucesso: number;
  tempo_medio_ms: number;
  compras_com_erro: Array<{
    email: string;
    nome: string;
    erro: string;
    horario: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Generating daily summary...');

    // Buscar estatísticas do dia
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data: logs, error } = await supabase
      .from('log_compras_hotmart')
      .select('*')
      .gte('created_at', hoje.toISOString());

    if (error) {
      throw new Error(`Error fetching logs: ${(error instanceof Error ? error.message : String(error))}`);
    }

    const stats: EstatisticasDia = {
      total: logs?.length || 0,
      sucesso: logs?.filter(l => l.status === 'email_enviado').length || 0,
      erro: logs?.filter(l => l.status.startsWith('erro_')).length || 0,
      taxa_sucesso: 0,
      tempo_medio_ms: 0,
      compras_com_erro: []
    };

    if (stats.total > 0) {
      stats.taxa_sucesso = Math.round((stats.sucesso / stats.total) * 100);
      
      const tempos = logs
        ?.filter(l => l.tempo_processamento_ms)
        .map(l => l.tempo_processamento_ms) || [];
      
      if (tempos.length > 0) {
        stats.tempo_medio_ms = Math.round(
          tempos.reduce((a, b) => a + b, 0) / tempos.length
        );
      }

      stats.compras_com_erro = logs
        ?.filter(l => l.status.startsWith('erro_'))
        .map(l => ({
          email: l.email,
          nome: l.nome,
          erro: l.erro_mensagem || l.status,
          horario: new Date(l.created_at).toLocaleTimeString('pt-BR')
        })) || [];
    }

    // Montar email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .metric { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .metric-label { font-size: 14px; color: #666; }
          .metric-value { font-size: 24px; font-weight: bold; color: #333; }
          .success { color: #28a745; }
          .error { color: #dc3545; }
          .warning { color: #ffc107; }
          .error-list { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          .error-item { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Resumo Diário - Hotmart</h1>
            <p>📅 ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div class="metric">
            <div class="metric-label">✅ Compras processadas com sucesso</div>
            <div class="metric-value success">${stats.sucesso}</div>
          </div>
          
          <div class="metric">
            <div class="metric-label">❌ Compras com erro</div>
            <div class="metric-value error">${stats.erro}</div>
          </div>
          
          <div class="metric">
            <div class="metric-label">📈 Taxa de sucesso</div>
            <div class="metric-value ${stats.taxa_sucesso >= 90 ? 'success' : stats.taxa_sucesso >= 70 ? 'warning' : 'error'}">${stats.taxa_sucesso}%</div>
          </div>
          
          <div class="metric">
            <div class="metric-label">⏱️ Tempo médio de processamento</div>
            <div class="metric-value">${stats.tempo_medio_ms}ms</div>
          </div>
          
          ${stats.compras_com_erro.length > 0 ? `
            <div class="error-list">
              <h3>❌ COMPRAS COM ERRO:</h3>
              ${stats.compras_com_erro.map(e => `
                <div class="error-item">
                  <strong>${e.nome}</strong> (${e.email})<br>
                  <small>Erro: ${e.erro}</small><br>
                  <small>Horário: ${e.horario}</small>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: #28a745; text-align: center; padding: 20px;">✅ Nenhum erro hoje!</p>'}
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://supabase.com/dashboard/project/xpfvjkzmoydapxzofphc" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              🔗 Ver Dashboard Completo
            </a>
          </p>
        </div>
      </body>
      </html>
    `;

    // Enviar email (substitua pelo email do admin)
    const ADMIN_EMAIL = 'admin@seudominio.com'; // TODO: Configurar email do admin
    
    const { error: emailError } = await resend.emails.send({
      from: 'Calculadora Inventário <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `📊 Resumo Diário Hotmart - ${stats.taxa_sucesso}% de sucesso`,
      html: emailHtml,
    });

    if (emailError) {
      throw new Error(`Error sending email: ${emailError.message}`);
    }

    console.log('Daily summary email sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats,
        message: 'Daily summary sent' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in enviar-resumo-diario:', error);
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
