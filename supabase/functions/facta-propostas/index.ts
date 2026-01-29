import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FACTA_BASE_URL = "https://webservice.facta.com.br";

let tokenCache: { token: string; expira: Date } | null = null;

async function getFactaToken(): Promise<string> {
  if (tokenCache && new Date() < tokenCache.expira) {
    return tokenCache.token;
  }

  const authBasic = Deno.env.get('FACTA_AUTH_BASIC');
  if (!authBasic) {
    throw new Error("FACTA_AUTH_BASIC not configured");
  }

  const response = await fetch(`${FACTA_BASE_URL}/gera-token`, {
    method: 'GET',
    headers: { 'Authorization': `Basic ${authBasic}` }
  });

  const data = await response.json();
  if (data.erro) {
    throw new Error(data.mensagem || "Failed to get Facta token");
  }

  tokenCache = {
    token: data.token,
    expira: new Date(Date.now() + 55 * 60 * 1000)
  };

  return data.token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ erro: true, mensagem: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const userToken = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(userToken);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ erro: true, mensagem: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'listar';
    const codigoAf = url.searchParams.get('codigo_af');

    // Get user's proposals from database
    const { data: proposals, error: dbError } = await supabase
      .from('proposals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ erro: true, mensagem: 'Erro ao buscar propostas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'listar') {
      return new Response(
        JSON.stringify({ erro: false, propostas: proposals || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'atualizar' && proposals && proposals.length > 0) {
      // Sync status with Facta API
      const token = await getFactaToken();
      
      // Get status from Facta for all proposals with codigo_af
      const proposalsWithAf = proposals.filter(p => p.codigo_af);
      
      if (proposalsWithAf.length === 0) {
        return new Response(
          JSON.stringify({ erro: false, propostas: proposals, mensagem: 'Nenhuma proposta para atualizar' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Build query params for Facta API
      const codigosAf = proposalsWithAf.map(p => p.codigo_af).join(',');
      
      const queryParams = new URLSearchParams({
        convenio: '3',
        averbador: '10010',
        propostas: codigosAf
      });

      console.log(`Fetching status from Facta for proposals: ${codigosAf}`);

      const factaResponse = await fetch(
        `${FACTA_BASE_URL}/proposta/andamento-propostas?${queryParams}`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const factaResult = await factaResponse.json();
      console.log("Facta proposals status:", JSON.stringify(factaResult));

      if (!factaResult.erro && factaResult.propostas) {
        // Update each proposal status
        for (const factaProposta of factaResult.propostas) {
          const localProposta = proposalsWithAf.find(p => p.codigo_af === factaProposta.codigo_af);
          if (localProposta) {
            await supabase
              .from('proposals')
              .update({
                status_facta: factaProposta.status_proposta,
                status_crivo: factaProposta.status_crivo,
                updated_at: new Date().toISOString()
              })
              .eq('id', localProposta.id);
          }
        }

        // Fetch updated proposals
        const { data: updatedProposals } = await supabase
          .from('proposals')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        return new Response(
          JSON.stringify({ 
            erro: false, 
            propostas: updatedProposals || [],
            mensagem: 'Status atualizado com sucesso'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          erro: false, 
          propostas: proposals,
          mensagem: 'Não foi possível sincronizar com a Facta'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'ocorrencias' && codigoAf) {
      const token = await getFactaToken();

      const response = await fetch(
        `${FACTA_BASE_URL}/proposta/consulta-ocorrencias?af=${codigoAf}`,
        {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const result = await response.json();
      console.log("Occurrences result:", JSON.stringify(result));

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ erro: true, mensagem: 'Ação inválida' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in facta-propostas function:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno";
    return new Response(
      JSON.stringify({ erro: true, mensagem: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
