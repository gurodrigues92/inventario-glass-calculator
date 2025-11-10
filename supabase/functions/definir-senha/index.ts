import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DefinirSenhaRequest {
  token: string;
  password: string;
}

// Função para hash da senha usando Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  const hash = Array.from(new Uint8Array(bits));
  const saltArray = Array.from(salt);
  
  return `${saltArray.map(b => b.toString(16).padStart(2, '0')).join('')}:${hash.map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { token, password }: DefinirSenhaRequest = await req.json()

    if (!token || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Token e senha são obrigatórios' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Validar senha (mínimo 6 caracteres)
    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Primeiro, tentar buscar como token de ativação (usuarios.token_definicao_senha)
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('token_definicao_senha', token)
      .maybeSingle()

    let isActivationToken = false;
    let isRecoveryToken = false;
    let recoveryTokenData = null;
    let userId = null;

    if (usuario) {
      // É um token de ativação
      isActivationToken = true;
      userId = usuario.id;
      
      // Verificar expiração do token de ativação (7 dias desde token_gerado_em)
      if (usuario.token_gerado_em) {
        const tokenIdade = new Date().getTime() - new Date(usuario.token_gerado_em).getTime()
        const setesDiasEmMs = 7 * 24 * 60 * 60 * 1000
        
        if (tokenIdade > setesDiasEmMs) {
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Token expirado. Solicite um novo link de ativação.' 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }
      
      console.log('Token de ativação encontrado para usuário:', usuario.email)
    } else {
      // Não é token de ativação, verificar se é token de recuperação
      const { data: resetToken, error: resetError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .maybeSingle()

      if (resetError) {
        console.error('Erro ao buscar token de recuperação:', resetError)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Token inválido ou expirado' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!resetToken) {
        console.log('Token não encontrado ou já utilizado:', token)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Token inválido ou expirado' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Verificar se o token expirou
      if (new Date(resetToken.expires_at) < new Date()) {
        console.log('Token de recuperação expirado:', token)
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Token expirado. Solicite uma nova recuperação de senha.' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      isRecoveryToken = true;
      recoveryTokenData = resetToken;
      userId = resetToken.user_id;
      
      console.log('Token de recuperação encontrado para usuário:', userId)
    }

    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Token inválido' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Gerar hash da senha usando Web Crypto API
    console.log('Gerando hash da senha para usuário:', userId);
    const senhaHash = await hashPassword(password);

    // Buscar dados do usuário para retorno
    const { data: usuarioCompleto, error: fetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !usuarioCompleto) {
      console.error('Erro ao buscar dados do usuário:', fetchError)
      throw new Error('Erro ao buscar dados do usuário')
    }

    if (isActivationToken) {
      // Token de ativação - remover token e ativar conta
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          senha_hash: senhaHash,
          token_definicao_senha: null,
          token_gerado_em: null,
          ativo: true,
          data_ativacao: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Erro ao definir senha (ativação):', updateError)
        throw updateError
      }

      console.log('Conta ativada com sucesso para:', usuarioCompleto.email)
    } else if (isRecoveryToken) {
      // Token de recuperação - atualizar senha e marcar token como usado
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          senha_hash: senhaHash
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Erro ao redefinir senha:', updateError)
        throw updateError
      }

      // Marcar token de recuperação como usado
      const { error: markUsedError } = await supabase
        .from('password_reset_tokens')
        .update({
          used: true,
          used_at: new Date().toISOString()
        })
        .eq('id', recoveryTokenData.id)

      if (markUsedError) {
        console.error('Erro ao marcar token como usado:', markUsedError)
        // Não falhar a operação por isso
      }

      console.log('Senha redefinida com sucesso para:', usuarioCompleto.email)
    }

    // Retornar dados do usuário sem informações sensíveis
    const { senha_hash, token_definicao_senha, ...usuarioSeguro } = usuarioCompleto

    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        ...usuarioSeguro,
        ativo: true,
        data_ativacao: new Date().toISOString()
      },
      message: 'Senha definida com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Erro ao definir senha:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})