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

    // Buscar usuário pelo token
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('token_definicao_senha', token)
      .single()

    if (userError || !usuario) {
      console.log('Token inválido ou expirado:', token)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Token inválido ou expirado' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar se o token não é muito antigo (7 dias)
    const tokenIdade = new Date().getTime() - new Date(usuario.created_at).getTime()
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

    // Gerar hash da senha usando Web Crypto API
    console.log('Gerando hash da senha para usuário:', usuario.email);
    const senhaHash = await hashPassword(password);

    // Atualizar usuário com a nova senha e remover o token
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        senha_hash: senhaHash,
        token_definicao_senha: null,
        ativo: true,
        data_ativacao: new Date().toISOString()
      })
      .eq('id', usuario.id)

    if (updateError) {
      console.error('Erro ao definir senha:', updateError)
      throw updateError
    }

    console.log('Senha definida com sucesso para:', usuario.email)

    // Retornar dados do usuário sem informações sensíveis
    const { senha_hash, token_definicao_senha, ...usuarioSeguro } = usuario

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