import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, RefreshCw, ExternalLink, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { listarPropostas, atualizarStatusPropostas, Proposta, getStatusInfo } from '@/services/contratacaoApi';
import { formatarMoeda, formatarData, formatarCPF } from '@/utils/formatters';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function PropostasPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useApp();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarPropostas = async (atualizar = false) => {
    try {
      if (atualizar) {
        setRefreshing(true);
        const result = await atualizarStatusPropostas();
        if (!result.erro && result.propostas) {
          setPropostas(result.propostas);
        }
      } else {
        setLoading(true);
        const result = await listarPropostas();
        if (result.erro) {
          setError(result.mensagem || 'Erro ao carregar propostas');
        } else {
          setPropostas(result.propostas || []);
        }
      }
    } catch (err) {
      setError('Erro ao carregar propostas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      carregarPropostas();
    }
  }, [isLoggedIn]);

  const getStatusIcon = (status: string | null) => {
    if (!status) return <Clock className="text-gray-400" size={20} />;
    
    if (status.includes('EFETIVADA') || status.includes('PAGA') || status.includes('sucesso')) {
      return <CheckCircle className="text-green-500" size={20} />;
    }
    if (status.includes('CANCELADO') || status.includes('erro')) {
      return <XCircle className="text-red-500" size={20} />;
    }
    return <Clock className="text-blue-500" size={20} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen min-h-[100dvh] gradient-primary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] gradient-primary pb-20">
      <Header title="Minhas Propostas" showBack />

      <main className="max-w-md mx-auto px-5 py-5 space-y-4">
        {/* Header com refresh */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {propostas.length === 0 
              ? 'Nenhuma proposta encontrada' 
              : `${propostas.length} proposta(s)`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => carregarPropostas(true)}
            disabled={refreshing}
            className="text-muted-foreground"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {propostas.length === 0 && !error && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <FileText size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60 mb-4">
              Você ainda não tem propostas de crédito.
            </p>
            <Button onClick={() => navigate('/consulta')} className="bg-[#22c55e] hover:bg-[#16a34a]">
              Consultar Margem
            </Button>
          </div>
        )}

        {/* Lista de propostas */}
        <div className="space-y-3">
          {propostas.map((proposta) => {
            const statusInfo = getStatusInfo(proposta.status_facta || proposta.status);
            
            return (
              <div
                key={proposta.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => navigate(`/propostas/${proposta.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(proposta.status_facta || proposta.status)}
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {proposta.banco_nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatarData(proposta.created_at)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-white/30" />
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-white/50">Valor</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatarMoeda(proposta.valor_operacao)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50">Parcelas</p>
                    <p className="text-sm font-semibold text-foreground">
                      {proposta.parcelas}x de {formatarMoeda(proposta.valor_parcela)}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium text-white ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  
                  {proposta.url_formalizacao && proposta.status === 'aguardando_assinatura' && (
                    <a
                      href={`https://${proposta.url_formalizacao}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[#22c55e] text-xs hover:underline"
                    >
                      <ExternalLink size={12} />
                      Assinar
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
