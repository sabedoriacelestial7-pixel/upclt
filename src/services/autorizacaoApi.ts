import { supabase } from '@/integrations/supabase/client';
import { TrabalhadorData } from '@/contexts/AppContext';

export interface AutorizacaoResult {
  sucesso: boolean;
  mensagem: string;
  protocolo?: string;
  status?: 'code_sent' | 'already_authorized';
}

export interface ConsultaAutorizadaResult {
  sucesso: boolean;
  mensagem: string;
  status: 'pending' | 'authorized' | 'ineligible' | 'not_found' | 'error' | 'expired';
  dados: TrabalhadorData | null;
}

/**
 * Solicita autorização do cliente via SMS ou WhatsApp
 */
export async function solicitarAutorizacao(
  cpf: string, 
  celular: string, 
  canal: 'S' | 'W' = 'S',
  nome?: string
): Promise<AutorizacaoResult> {
  const cpfLimpo = cpf.replace(/\D/g, '');
  const celularLimpo = celular.replace(/\D/g, '');

  try {
    const { data, error } = await supabase.functions.invoke('facta-autorizar', {
      body: { 
        cpf: cpfLimpo, 
        celular: celularLimpo, 
        canal,
        nome: nome || 'Cliente'
      }
    });

    if (error) {
      console.error('Error calling facta-autorizar:', error);
      
      // Check for specific auth errors (401 Unauthorized)
      const errorMsg = error.message || '';
      const isAuthError = errorMsg.includes('401') || errorMsg.includes('Unauthorized');
      
      // Try to get a more specific error from the response context
      if (error.context?.body) {
        try {
          const bodyData = typeof error.context.body === 'string' 
            ? JSON.parse(error.context.body) 
            : error.context.body;
          if (bodyData?.mensagem) {
            return {
              sucesso: false,
              mensagem: bodyData.mensagem
            };
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      if (isAuthError) {
        return {
          sucesso: false,
          mensagem: 'Sua sessão expirou. Faça login novamente para continuar.'
        };
      }
      
      // For other errors, return a more descriptive message
      return {
        sucesso: false,
        mensagem: `Erro ao solicitar autorização: ${errorMsg || 'Tente novamente em alguns instantes.'}`
      };
    }

    // If data contains the actual error from the edge function
    if (data && !data.sucesso) {
      return data as AutorizacaoResult;
    }

    return data as AutorizacaoResult;
  } catch (err) {
    console.error('Exception calling facta-autorizar:', err);
    return {
      sucesso: false,
      mensagem: 'Erro de conexão. Verifique sua internet e tente novamente.'
    };
  }
}

/**
 * Verifica se o cliente autorizou e retorna os dados de margem
 */
export async function verificarAutorizacao(
  cpf: string, 
  celular: string
): Promise<ConsultaAutorizadaResult> {
  const cpfLimpo = cpf.replace(/\D/g, '');
  const celularLimpo = celular.replace(/\D/g, '');

  const { data, error } = await supabase.functions.invoke('facta-consultar-autorizado', {
    body: { 
      cpf: cpfLimpo, 
      celular: celularLimpo 
    }
  });

  if (error) {
    console.error('Error calling facta-consultar-autorizado:', error);
    return {
      sucesso: false,
      mensagem: error.message || 'Erro ao verificar autorização',
      status: 'error',
      dados: null
    };
  }

  return data as ConsultaAutorizadaResult;
}
