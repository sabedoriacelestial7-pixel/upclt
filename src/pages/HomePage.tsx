import { useNavigate } from 'react-router-dom';
import { User, Bell, Banknote, FileText, HelpCircle, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { PageTransition } from '@/components/PageTransition';
import { useApp } from '@/contexts/AppContext';
import { useBiaChat } from '@/contexts/BiaChatContext';
import { formatarMoeda, formatarData } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { listarPropostas, Proposta, getStatusInfo } from '@/services/contratacaoApi';

export default function HomePage() {
  const navigate = useNavigate();
  const { usuario, consulta } = useApp();
  const { open: openBia } = useBiaChat();
  const [ultimaProposta, setUltimaProposta] = useState<Proposta | null>(null);
  const [loadingProposta, setLoadingProposta] = useState(true);

  const firstName = usuario?.nome?.split(' ')[0] || 'Usuário';
  const valorDisponivel = consulta?.valorMargemDisponivel 
    ? consulta.valorMargemDisponivel * 10 // Approximate loan value
    : null;

  // Carregar última proposta
  useEffect(() => {
    async function fetchUltimaProposta() {
      try {
        const result = await listarPropostas();
        if (!result.erro && result.propostas && result.propostas.length > 0) {
          setUltimaProposta(result.propostas[0]);
        }
      } catch (err) {
        console.error('Erro ao carregar proposta:', err);
      } finally {
        setLoadingProposta(false);
      }
    }
    fetchUltimaProposta();
  }, []);

  // Saudação baseada na hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <PageTransition className="min-h-screen min-h-[100dvh] bg-background pb-24">
      {/* Header */}
      <header className="bg-primary pt-[env(safe-area-inset-top)]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm">
              {getGreeting()},
            </p>
            <p className="text-primary-foreground text-lg font-semibold">
              {firstName} 👋
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => navigate('/perfil')}
              className="w-11 h-11 rounded-full flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors touch-manipulation"
              aria-label="Ir para perfil"
            >
              <User size={22} />
            </button>
            <button 
              className="w-11 h-11 rounded-full flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors touch-manipulation relative"
              aria-label="Notificações"
            >
              <Bell size={22} />
              {ultimaProposta && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 space-y-5">
        {/* Credit Opportunities Section */}
        <section>
          <h2 className="text-muted-foreground text-sm font-medium mb-3">
            Oportunidades de crédito
          </h2>

          <button
            onClick={() => navigate('/consulta')}
            className={cn(
              'w-full bg-card rounded-xl p-4 shadow-card group',
              'flex items-center gap-4 text-left',
              'hover:shadow-card-hover transition-all duration-200',
              'active:scale-[0.99] touch-manipulation'
            )}
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Banknote size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                Consignado CLT
              </h3>
              <p className="text-primary font-bold text-lg">
                {valorDisponivel 
                  ? formatarMoeda(valorDisponivel)
                  : 'Consultar margem'}
              </p>
            </div>
            <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </section>

        {/* Última proposta (se existir) */}
        {!loadingProposta && ultimaProposta && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-muted-foreground text-sm font-medium">
                Última operação
              </h2>
              <button 
                onClick={() => navigate('/propostas')}
                className="text-primary text-xs font-medium hover:underline"
              >
                Ver todas
              </button>
            </div>

            <button
              onClick={() => navigate(`/propostas/${ultimaProposta.id}`)}
              className={cn(
                'w-full bg-card rounded-xl p-4 shadow-card',
                'text-left hover:shadow-card-hover transition-all duration-200',
                'active:scale-[0.99] touch-manipulation'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatarData(ultimaProposta.created_at)}
                  </span>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  getStatusInfo(ultimaProposta.status_facta || ultimaProposta.status).color
                )}>
                  {getStatusInfo(ultimaProposta.status_facta || ultimaProposta.status).label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{ultimaProposta.banco_nome}</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatarMoeda(ultimaProposta.valor_operacao)}
                  </p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </button>
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-muted-foreground text-sm font-medium mb-3">
            Atalhos rápidos
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Falar com Bia */}
            <button
              onClick={openBia}
              className={cn(
                'bg-card rounded-xl p-4 shadow-card text-left',
                'hover:shadow-card-hover transition-all duration-200',
                'active:scale-[0.98] touch-manipulation',
                'flex flex-col gap-2'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Falar com Bia</p>
                <p className="text-xs text-muted-foreground">Tire suas dúvidas</p>
              </div>
            </button>

            {/* Minhas operações */}
            <button
              onClick={() => navigate('/propostas')}
              className={cn(
                'bg-card rounded-xl p-4 shadow-card text-left',
                'hover:shadow-card-hover transition-all duration-200',
                'active:scale-[0.98] touch-manipulation',
                'flex flex-col gap-2'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Operações</p>
                <p className="text-xs text-muted-foreground">Acompanhe status</p>
              </div>
            </button>

            {/* Ajuda */}
            <button
              onClick={() => navigate('/ajuda')}
              className={cn(
                'bg-card rounded-xl p-4 shadow-card text-left',
                'hover:shadow-card-hover transition-all duration-200',
                'active:scale-[0.98] touch-manipulation',
                'flex flex-col gap-2 col-span-2'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Central de Ajuda</p>
                  <p className="text-xs text-muted-foreground">Dúvidas frequentes e suporte</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Empty state hint */}
        {!consulta && !ultimaProposta && !loadingProposta && (
          <div className="mt-4 text-center bg-primary/5 rounded-xl p-4">
            <p className="text-muted-foreground text-sm">
              👆 Consulte sua margem acima para ver ofertas personalizadas
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </PageTransition>
  );
}
