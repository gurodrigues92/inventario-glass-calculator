// Sessao assinada do produto.
//
// O login nao passa pelo Auth nativo do Supabase (a senha vive em
// inventario_glass.usuarios, PBKDF2), entao o front nao tem token nenhum e ate
// 10/09/2026 a sessao era um JSON no localStorage que qualquer um editava.
// Aqui o auth-login emite um token HMAC e as funcoes que leem dado de usuario
// exigem ele, em vez de confiar num usuarioId vindo no corpo.
//
// Formato: psi1.<payload base64url>.<assinatura base64url>
// De proposito NAO e um JWT: assim nao existe chance de esse token ser aceito
// por engano pelo PostgREST ou pelo GoTrue, que assinam com o mesmo segredo.

const enc = new TextEncoder();
const VALIDADE_SEGUNDOS = 7 * 24 * 60 * 60;
const PREFIXO = 'psi1';

function paraB64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deB64url(texto: string): Uint8Array {
  const base = texto.replace(/-/g, '+').replace(/_/g, '/');
  const cru = atob(base + '='.repeat((4 - (base.length % 4)) % 4));
  return Uint8Array.from(cru, (c) => c.charCodeAt(0));
}

let chaveCache: CryptoKey | null = null;

// Deriva uma chave propria a partir do JWT_SECRET, para nao assinar sessao com
// o mesmo material que o resto da stack usa.
async function chave(): Promise<CryptoKey> {
  if (chaveCache) return chaveCache;

  const segredo = Deno.env.get('JWT_SECRET') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!segredo) throw new Error('JWT_SECRET ausente: nao da pra assinar sessao');

  const base = await crypto.subtle.importKey('raw', enc.encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const derivada = await crypto.subtle.sign('HMAC', base, enc.encode('psi-sessao-v1'));

  chaveCache = await crypto.subtle.importKey('raw', derivada, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return chaveCache;
}

export async function assinarSessao(usuarioId: string): Promise<{ token: string; expiraEm: string }> {
  const expira = Math.floor(Date.now() / 1000) + VALIDADE_SEGUNDOS;
  const payload = paraB64url(enc.encode(JSON.stringify({ sub: usuarioId, exp: expira })));
  const assinatura = await crypto.subtle.sign('HMAC', await chave(), enc.encode(`${PREFIXO}.${payload}`));

  return {
    token: `${PREFIXO}.${payload}.${paraB64url(new Uint8Array(assinatura))}`,
    expiraEm: new Date(expira * 1000).toISOString(),
  };
}

// Le o token do header x-sessao. Devolve o id do usuario, ou null se o token
// nao existe, foi adulterado ou venceu.
export async function verificarSessao(req: Request): Promise<string | null> {
  const token = req.headers.get('x-sessao');
  if (!token) return null;

  const partes = token.split('.');
  if (partes.length !== 3 || partes[0] !== PREFIXO) return null;

  const [, payload, assinatura] = partes;

  try {
    const valida = await crypto.subtle.verify('HMAC', await chave(), deB64url(assinatura), enc.encode(`${PREFIXO}.${payload}`));
    if (!valida) return null;

    const dados = JSON.parse(new TextDecoder().decode(deB64url(payload)));
    if (!dados.sub || typeof dados.exp !== 'number') return null;
    if (dados.exp * 1000 < Date.now()) return null;

    return dados.sub as string;
  } catch (erro) {
    console.error('Sessao invalida:', erro);
    return null;
  }
}

// Verifica a sessao E confere a conta no banco: conta desativada perde acesso na
// hora, sem esperar o token vencer.
// deno-lint-ignore no-explicit-any
export async function usuarioDaSessao(req: Request, supabase: any): Promise<{ id: string; nome: string; email: string; ativo: boolean; telefone: string | null; produto: string | null } | null> {
  const usuarioId = await verificarSessao(req);
  if (!usuarioId) return null;

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id, nome, email, ativo, telefone, produto, data_ativacao, created_at, updated_at, primeiro_login_em')
    .eq('id', usuarioId)
    .maybeSingle();

  if (!usuario || !usuario.ativo) return null;
  return usuario;
}

export const respostaSemSessao = (corsHeaders: Record<string, string>) =>
  new Response(JSON.stringify({ success: false, error: 'SESSAO_INVALIDA', message: 'Sua sessão expirou. Entre novamente.' }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
