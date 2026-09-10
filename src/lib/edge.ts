import { supabase } from '@/integrations/supabase/client';
import { parseEdgeError } from '@/lib/utils';

const CHAVE_SESSAO = 'inventario_sessao';

export const guardarSessao = (token: string) => localStorage.setItem(CHAVE_SESSAO, token);
export const lerSessao = () => localStorage.getItem(CHAVE_SESSAO);
export const limparSessao = () => localStorage.removeItem(CHAVE_SESSAO);

// Chama uma edge function mandando a sessao assinada no header x-sessao e ja
// devolve o JSON de negocio mesmo quando a resposta e 4xx (o supabase-js joga
// o corpo fora nesses casos).
export async function invocarEdge<T = Record<string, unknown>>(
  nome: string,
  body?: unknown
): Promise<{ data: T | null; error: unknown }> {
  const token = lerSessao();

  const { data: rawData, error } = await supabase.functions.invoke(nome, {
    body,
    headers: token ? { 'x-sessao': token } : undefined,
  });

  const data = (rawData ?? (error ? await parseEdgeError(error) : null)) as T | null;
  return { data, error };
}

export const sessaoExpirou = (data: { error?: string } | null) => data?.error === 'SESSAO_INVALIDA';
