import { supabase } from '@/integrations/supabase/client';
import type { Proposta } from './contratacaoApi';

export interface PropostasAdminResult {
  erro: boolean;
  propostas?: Proposta[];
  mensagem?: string;
}

/**
 * Lista todas as propostas do sistema (apenas para admins)
 * A RLS policy já garante que apenas admins podem ver todas
 */
export async function listarTodasPropostas(): Promise<PropostasAdminResult> {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all proposals:', error);
      return {
        erro: true,
        mensagem: error.message || 'Erro ao listar propostas'
      };
    }

    return {
      erro: false,
      propostas: data as Proposta[]
    };
  } catch (err) {
    console.error('Error fetching all proposals:', err);
    return {
      erro: true,
      mensagem: 'Erro ao listar propostas'
    };
  }
}
