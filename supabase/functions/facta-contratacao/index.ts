import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const FACTA_BASE_URL = "https://webservice.facta.com.br";

// Token cache
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

interface ContratacaoParams {
  // Dados da margem/simulação
  cpf: string;
  dataNascimento: string;
  valorRenda: number;
  matricula: string;
  cnpjEmpregador?: string;
  dataAdmissao?: string;
  
  // Dados da operação
  codigoTabela: number;
  prazo: number;
  valorOperacao: number;
  valorParcela: number;
  coeficiente: string;
  bancoId: string;
  bancoNome: string;
  
  // Dados pessoais
  nome: string;
  sexo: string;
  estadoCivil: string;
  rg: string;
  estadoRg: string;
  orgaoEmissor: string;
  dataExpedicao: string;
  estadoNatural: string;
  cidadeNatural: string;
  celular: string;
  email: string;
  
  // Endereço
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  
  // Filiação
  nomeMae: string;
  nomePai?: string;
  
  // Bancários
  tipoConta: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoChavePix: string;
  chavePix: string;
  
  // Envio
  tipoEnvio: 'sms' | 'whatsapp';
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
    const params: ContratacaoParams = await req.json();

    console.log(`Starting contracting process for CPF: ${params.cpf.substring(0, 3)}...`);

    // Get Facta token
    const token = await getFactaToken();

    // Get login_certificado from env or use default
    const loginCertificado = Deno.env.get('FACTA_LOGIN_CERTIFICADO') || '1024';

    // Step 1: Create simulation (etapa1-simulador)
    console.log("Step 1: Creating simulation...");
    const simuladorFormData = new FormData();
    simuladorFormData.append('produto', 'D');
    simuladorFormData.append('tipo_operacao', '13');
    simuladorFormData.append('averbador', '10010');
    simuladorFormData.append('convenio', '3');
    simuladorFormData.append('cpf', params.cpf);
    simuladorFormData.append('data_nascimento', params.dataNascimento);
    simuladorFormData.append('login_certificado', loginCertificado);
    simuladorFormData.append('codigo_tabela', params.codigoTabela.toString());
    simuladorFormData.append('prazo', params.prazo.toString());
    simuladorFormData.append('valor_operacao', params.valorOperacao.toString());
    simuladorFormData.append('valor_parcela', params.valorParcela.toString());
    simuladorFormData.append('coeficiente', params.coeficiente);

    const simuladorResponse = await fetch(`${FACTA_BASE_URL}/proposta/etapa1-simulador`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: simuladorFormData
    });

    const simuladorResult = await simuladorResponse.json();
    console.log("Simulator result:", JSON.stringify(simuladorResult));

    if (simuladorResult.erro) {
      // Save failed proposal
      await supabase.from('proposals').insert({
        user_id: userId,
        cpf: params.cpf,
        nome: params.nome,
        celular: params.celular,
        email: params.email,
        banco_id: params.bancoId,
        banco_nome: params.bancoNome,
        codigo_tabela: params.codigoTabela,
        valor_operacao: params.valorOperacao,
        valor_parcela: params.valorParcela,
        parcelas: params.prazo,
        coeficiente: parseFloat(params.coeficiente),
        status: 'erro_simulacao',
        api_response: simuladorResult
      });

      return new Response(
        JSON.stringify({ 
          erro: true, 
          mensagem: simuladorResult.mensagem || "Erro ao criar simulação",
          etapa: 'simulador'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const idSimulador = simuladorResult.id_simulador;

    // Step 2: Save personal data (etapa2-dados-pessoais)
    console.log("Step 2: Saving personal data...");
    const dadosFormData = new FormData();
    dadosFormData.append('id_simulador', idSimulador);
    dadosFormData.append('cpf', params.cpf);
    dadosFormData.append('nome', params.nome);
    dadosFormData.append('sexo', params.sexo);
    dadosFormData.append('estado_civil', params.estadoCivil);
    dadosFormData.append('data_nascimento', params.dataNascimento);
    dadosFormData.append('rg', params.rg);
    dadosFormData.append('estado_rg', params.estadoRg);
    dadosFormData.append('orgao_emissor', params.orgaoEmissor);
    dadosFormData.append('data_expedicao', params.dataExpedicao);
    dadosFormData.append('estado_natural', params.estadoNatural);
    dadosFormData.append('cidade_natural', params.cidadeNatural);
    dadosFormData.append('nacionalidade', '1');
    dadosFormData.append('celular', params.celular);
    dadosFormData.append('renda', params.valorRenda.toString());
    dadosFormData.append('cep', params.cep);
    dadosFormData.append('endereco', params.endereco);
    dadosFormData.append('numero', params.numero);
    if (params.complemento) dadosFormData.append('complemento', params.complemento);
    dadosFormData.append('bairro', params.bairro);
    dadosFormData.append('cidade', params.cidade);
    dadosFormData.append('estado', params.estado);
    dadosFormData.append('nome_mae', params.nomeMae);
    dadosFormData.append('nome_pai', params.nomePai || 'NAO DECLARADO');
    dadosFormData.append('valor_patrimonio', '1');
    dadosFormData.append('cliente_iletrado_impossibilitado', 'N');
    dadosFormData.append('tipo_conta', params.tipoConta);
    
    if (params.banco) {
      dadosFormData.append('banco', params.banco);
      if (params.agencia) dadosFormData.append('agencia', params.agencia);
      if (params.conta) dadosFormData.append('conta', params.conta);
    }
    
    dadosFormData.append('matricula', params.matricula);
    dadosFormData.append('email', params.email);
    dadosFormData.append('tipo_chave_pix', params.tipoChavePix);
    dadosFormData.append('chave_pix', params.chavePix);
    
    if (params.cnpjEmpregador) dadosFormData.append('cnpj_empregador', params.cnpjEmpregador);
    if (params.dataAdmissao) dadosFormData.append('data_admissao', params.dataAdmissao);

    const dadosResponse = await fetch(`${FACTA_BASE_URL}/proposta/etapa2-dados-pessoais`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: dadosFormData
    });

    const dadosResult = await dadosResponse.json();
    console.log("Personal data result:", JSON.stringify(dadosResult));

    if (dadosResult.erro) {
      await supabase.from('proposals').insert({
        user_id: userId,
        cpf: params.cpf,
        nome: params.nome,
        celular: params.celular,
        email: params.email,
        banco_id: params.bancoId,
        banco_nome: params.bancoNome,
        codigo_tabela: params.codigoTabela,
        valor_operacao: params.valorOperacao,
        valor_parcela: params.valorParcela,
        parcelas: params.prazo,
        coeficiente: parseFloat(params.coeficiente),
        id_simulador: idSimulador,
        status: 'erro_dados',
        api_response: dadosResult
      });

      return new Response(
        JSON.stringify({ 
          erro: true, 
          mensagem: dadosResult.mensagem || "Erro ao salvar dados pessoais",
          etapa: 'dados-pessoais'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const codigoCliente = dadosResult.codigo_cliente;

    // Step 3: Create proposal (etapa3-proposta-cadastro)
    console.log("Step 3: Creating proposal...");
    const propostaFormData = new FormData();
    propostaFormData.append('codigo_cliente', codigoCliente);
    propostaFormData.append('id_simulador', idSimulador);

    const propostaResponse = await fetch(`${FACTA_BASE_URL}/proposta/etapa3-proposta-cadastro`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: propostaFormData
    });

    const propostaResult = await propostaResponse.json();
    console.log("Proposal result:", JSON.stringify(propostaResult));

    if (propostaResult.erro) {
      await supabase.from('proposals').insert({
        user_id: userId,
        cpf: params.cpf,
        nome: params.nome,
        celular: params.celular,
        email: params.email,
        banco_id: params.bancoId,
        banco_nome: params.bancoNome,
        codigo_tabela: params.codigoTabela,
        valor_operacao: params.valorOperacao,
        valor_parcela: params.valorParcela,
        parcelas: params.prazo,
        coeficiente: parseFloat(params.coeficiente),
        id_simulador: idSimulador,
        codigo_cliente: codigoCliente,
        status: 'erro_proposta',
        api_response: propostaResult
      });

      return new Response(
        JSON.stringify({ 
          erro: true, 
          mensagem: propostaResult.mensagem || "Erro ao criar proposta",
          etapa: 'proposta'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const codigoAf = propostaResult.codigo;
    const urlFormalizacao = propostaResult.url_formalizacao;

    // Step 4: Send formalization link
    console.log("Step 4: Sending formalization link...");
    const linkFormData = new FormData();
    linkFormData.append('codigo_af', codigoAf);
    linkFormData.append('tipo_envio', params.tipoEnvio);

    const linkResponse = await fetch(`${FACTA_BASE_URL}/proposta/envio-link`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: linkFormData
    });

    const linkResult = await linkResponse.json();
    console.log("Link sending result:", JSON.stringify(linkResult));

    // Save successful proposal
    const { data: proposal, error: insertError } = await supabase.from('proposals').insert({
      user_id: userId,
      cpf: params.cpf,
      nome: params.nome,
      celular: params.celular,
      email: params.email,
      banco_id: params.bancoId,
      banco_nome: params.bancoNome,
      codigo_tabela: params.codigoTabela,
      valor_operacao: params.valorOperacao,
      valor_parcela: params.valorParcela,
      parcelas: params.prazo,
      coeficiente: parseFloat(params.coeficiente),
      id_simulador: idSimulador,
      codigo_cliente: codigoCliente,
      codigo_af: codigoAf,
      url_formalizacao: urlFormalizacao,
      status: 'aguardando_assinatura',
      api_response: {
        simulador: simuladorResult,
        dados: dadosResult,
        proposta: propostaResult,
        link: linkResult
      }
    }).select().single();

    if (insertError) {
      console.error("Error saving proposal:", insertError);
    }

    return new Response(
      JSON.stringify({
        erro: false,
        mensagem: "Proposta criada com sucesso! Link de assinatura enviado.",
        proposta: {
          id: proposal?.id,
          codigoAf,
          urlFormalizacao,
          status: 'aguardando_assinatura'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in facta-contratacao function:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro interno";
    return new Response(
      JSON.stringify({ erro: true, mensagem: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
