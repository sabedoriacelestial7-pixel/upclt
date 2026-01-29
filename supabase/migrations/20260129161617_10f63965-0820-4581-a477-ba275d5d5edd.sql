-- Criar tabela para propostas de crédito
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  margin_query_id UUID REFERENCES public.margin_queries(id),
  
  -- Dados do cliente
  cpf VARCHAR(11) NOT NULL,
  nome TEXT NOT NULL,
  celular VARCHAR(20),
  email VARCHAR(255),
  
  -- Dados da simulação
  banco_id TEXT NOT NULL,
  banco_nome TEXT NOT NULL,
  codigo_tabela INTEGER,
  valor_operacao NUMERIC NOT NULL,
  valor_parcela NUMERIC NOT NULL,
  parcelas INTEGER NOT NULL,
  taxa_mensal NUMERIC,
  coeficiente NUMERIC,
  
  -- IDs da Facta
  id_simulador VARCHAR(50),
  codigo_cliente VARCHAR(50),
  codigo_af VARCHAR(50),
  url_formalizacao TEXT,
  
  -- Status e acompanhamento
  status TEXT NOT NULL DEFAULT 'pendente',
  status_facta TEXT,
  status_crivo TEXT,
  
  -- Metadados
  api_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own proposals"
ON public.proposals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own proposals"
ON public.proposals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposals"
ON public.proposals FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_proposals_user_id ON public.proposals(user_id);
CREATE INDEX idx_proposals_cpf ON public.proposals(cpf);
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposals_codigo_af ON public.proposals(codigo_af);