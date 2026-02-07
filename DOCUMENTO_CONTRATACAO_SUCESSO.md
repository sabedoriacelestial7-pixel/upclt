# Fluxo de Contratação Facta - Registro de Sucesso

## Data: 07/02/2026

## Resumo
O fluxo completo de contratação via API Facta está **100% operacional**. Todas as 4 etapas foram validadas com sucesso em produção.

## Fluxo Técnico (4 etapas)

### Etapa 1 - Simulador (`POST /proposta/etapa1-simulador`)
- Produto: D (Venda Digital)
- Tipo operação: 13 (Novo Digital)
- Averbador: 10010 (CLT)
- Convênio: 3
- Retorna: `id_simulador`

### Etapa 2 - Dados Pessoais (`POST /proposta/etapa2-dados-pessoais`)
- Envia todos os dados do cliente
- **IMPORTANTE**: Campos que usam códigos internos da Facta (NÃO códigos IBGE):
  - `cidade` e `cidade_natural`: consultar via `GET /proposta-combos/cidade?estado=X&nome_cidade=Y`
  - `orgao_emissor`: usar exatamente as chaves retornadas por `GET /proposta-combos/orgao-emissor` (ex: SSP, DETRAN, etc.)
  - `estado_civil`: código numérico (1=Separado, 2=Divorciado, 3=Casado, 4=Solteiro, 5=Viúvo, etc.)
  - `nacionalidade`: código numérico (1=Brasileira)
  - `valor_patrimonio`: código numérico (1=menor faixa)
- `nascimento_conjuge` (NÃO `data_nascimento_conjuge`) - fallback usa data do próprio cliente
- Retorna: `codigo_cliente`

### Etapa 3 - Proposta (`POST /proposta/etapa3-proposta-cadastro`)
- Envia: `codigo_cliente` + `id_simulador`
- Retorna: `codigo` (codigo_af) + `url_formalizacao`

### Etapa 4 - Envio de Link (`POST /proposta/envio-link`)
- Envia: `codigo_af` + `tipo_envio` (sms/whatsapp)
- Envia link de assinatura digital ao cliente

## Problemas Resolvidos

### 1. Órgão Emissor Inválido
- **Problema**: Frontend enviava siglas que não existem na API Facta (ex: "AAP", "SEGUP", "PCERJ")
- **Solução**: Lista do frontend (`ORGAO_EMISSOR_OPTIONS`) atualizada com EXATAMENTE as chaves da API Facta
- **Validação**: Edge function consulta `/proposta-combos/orgao-emissor` e valida antes de enviar
- **Chaves válidas**: SSP, ABNC, CGPI, CGPMAF, CNIG, CNT, CORECON, COREN, CRA, CRAS, CRB, CRC, CRE, CREA, CRECI, CREFIT, CRESS, CRF, CRM, CRMV, CRN, CRO, CRP, CRPRE, CRQ, CRRC, CSC, CTPS, DETRAN, DIC, DIREX, DPF, DPMAF, DPT, DST, FGTS, FIPE, FLS, GOVGO, IFP, IGP, IICCECF, IIMG, IML, IPC, IPF, MAE, MEX, MMA, OAB, OMB, PCMG, PMMG, POF, POM, SDS, SECC, SEJUSP, SES, SESP, SJS, SJTC, SJTS, SNJ, SPTC

### 2. Campo Nascimento Cônjuge
- **Problema**: Campo enviado como `data_nascimento_conjuge` (errado)
- **Solução**: Corrigido para `nascimento_conjuge` (formato correto da API)

### 3. Códigos de Cidade
- **Problema**: API Facta usa códigos internos próprios, não IBGE
- **Solução**: Consulta dinâmica via `/proposta-combos/cidade`

## Arquivos Críticos (NÃO MODIFICAR sem necessidade)

- `supabase/functions/facta-contratacao/index.ts` - Edge function principal
- `src/pages/ContratacaoPage.tsx` - Formulário frontend
- `src/services/contratacaoApi.ts` - Service layer

## Infraestrutura

- Proxy: https://api.upclt.app (Cloudflare Tunnel → VPS → Node.js proxy)
- API Facta: https://webservice.facta.com.br
- Auth: Basic Auth → Bearer Token (válido por 1 hora)
