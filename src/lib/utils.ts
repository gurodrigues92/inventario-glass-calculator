import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Edge functions respondem 4xx com JSON de negócio (ex.: SENHA_NAO_DEFINIDA vem com 401),
// mas supabase.functions.invoke trata qualquer non-2xx como FunctionsHttpError.
// Extrai o body JSON do erro; null = erro de rede/conexão de verdade.
export async function parseEdgeError(error: unknown): Promise<Record<string, unknown> | null> {
  const ctx = (error as { context?: Response } | null)?.context;
  if (!ctx || typeof ctx.json !== 'function') return null;
  try {
    return await ctx.json();
  } catch {
    return null;
  }
}
