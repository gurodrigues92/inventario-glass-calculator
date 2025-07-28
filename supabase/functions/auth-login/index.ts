import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string;
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

// Função para verificar senha usando Web Crypto API
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Se o hash parece ser do bcrypt (começa com $2), falha para forçar reset
    if (hash.startsWith('$2')) {
      console.log('Hash bcrypt detectado, usuário precisa redefinir senha');
      return false;
    }
    
    const [saltHex, hashHex] = hash.split(':');
    if (!saltHex || !hashHex) {
      console.log('Formato de hash inválido');
      return false;
    }
    
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const expectedHash = hashHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16));
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
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
    
    const actualHash = Array.from(new Uint8Array(bits));
    
    return actualHash.every((byte, index) => byte === expectedHash[index]);
  } catch (error) {
    console.error('Erro na verificação da senha:', error);
    return false;
  }
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

    const { email, password }: LoginRequest = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email e senha são obrigatórios' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Buscar usuário pelo email
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !usuario) {
      console.log('Usuário não encontrado:', email)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Conta não ativada. Verifique seu email.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar se a senha foi definida
    if (!usuario.senha_hash) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Senha não foi definida. Verifique seu email para o link de ativação.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar senha
    console.log('Verificando senha para usuário:', email);
    const senhaValida = await verifyPassword(password, usuario.senha_hash);
    
    if (!senhaValida) {
      console.log('Senha incorreta para:', email)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Login bem-sucedido
    console.log('Login bem-sucedido para:', email)
    
    // Remover dados sensíveis antes de retornar
    const { senha_hash, token_definicao_senha, ...usuarioSeguro } = usuario

    return new Response(JSON.stringify({ 
      success: true, 
      user: usuarioSeguro,
      message: 'Login realizado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})