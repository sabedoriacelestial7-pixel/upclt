import { ArrowLeft, Shield, Lock, Eye, Trash2, Share2, Server, Smartphone, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/PageTransition';
import { LegalFooter } from '@/components/LegalFooter';
import { cn } from '@/lib/utils';

interface DataCategoryProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  collected: boolean;
  shared: boolean;
  purpose: string;
  optional?: boolean;
}

function DataCategory({ icon, title, description, collected, shared, purpose, optional }: DataCategoryProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-card-foreground">{title}</h3>
            {optional && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Opcional
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between py-1.5 border-t border-border">
          <span className="text-muted-foreground">Coletado</span>
          <span className={cn(
            'flex items-center gap-1 font-medium',
            collected ? 'text-primary' : 'text-muted-foreground'
          )}>
            {collected ? <CheckCircle size={14} /> : '—'}
            {collected ? 'Sim' : 'Não'}
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-t border-border">
          <span className="text-muted-foreground">Compartilhado</span>
          <span className={cn(
            'flex items-center gap-1 font-medium',
            shared ? 'text-amber-600' : 'text-primary'
          )}>
            {shared ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
            {shared ? 'Com parceiros' : 'Não'}
          </span>
        </div>
        <div className="flex items-start justify-between py-1.5 border-t border-border">
          <span className="text-muted-foreground shrink-0">Finalidade</span>
          <span className="text-card-foreground text-right ml-2">{purpose}</span>
        </div>
      </div>
    </div>
  );
}

export default function SegurancaDadosPage() {
  const navigate = useNavigate();

  const dataCategories: DataCategoryProps[] = [
    {
      icon: <Smartphone size={20} className="text-primary" />,
      title: 'Informações pessoais',
      description: 'Nome, e-mail, telefone e CPF',
      collected: true,
      shared: true,
      purpose: 'Identificação e contato para operações de crédito',
    },
    {
      icon: <Server size={20} className="text-primary" />,
      title: 'Dados trabalhistas',
      description: 'Empregador, salário e margem consignável',
      collected: true,
      shared: true,
      purpose: 'Análise de elegibilidade e cálculo de crédito',
    },
    {
      icon: <Lock size={20} className="text-primary" />,
      title: 'Dados financeiros',
      description: 'Dados bancários para depósito',
      collected: true,
      shared: true,
      purpose: 'Transferência do valor do empréstimo',
    },
    {
      icon: <Eye size={20} className="text-primary" />,
      title: 'Dados de uso do app',
      description: 'Interações, preferências e navegação',
      collected: true,
      shared: false,
      purpose: 'Melhoria da experiência do usuário',
      optional: true,
    },
  ];

  return (
    <PageTransition className="min-h-screen min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors touch-manipulation"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-foreground">Segurança de Dados</h1>
            <p className="text-xs text-muted-foreground">Declaração Play Store</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Intro */}
        <div className="bg-primary/10 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Shield size={24} className="text-primary shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-foreground mb-1">
              Seu controle sobre seus dados
            </h2>
            <p className="text-sm text-muted-foreground">
              Esta página explica quais dados o UpCLT coleta, como são utilizados 
              e compartilhados, em conformidade com a LGPD e as políticas do Google Play.
            </p>
          </div>
        </div>

        {/* Key Points */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Resumo de Segurança</h2>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-card">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Dados criptografados</p>
                <p className="text-sm text-muted-foreground">Em trânsito e em repouso</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-card">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trash2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Exclusão disponível</p>
                <p className="text-sm text-muted-foreground">Você pode solicitar a remoção completa dos seus dados</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-card">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Compartilhamento limitado</p>
                <p className="text-sm text-muted-foreground">Apenas com bancos parceiros para operações de crédito</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Categories */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Dados Coletados</h2>
          <div className="space-y-3">
            {dataCategories.map((category, index) => (
              <DataCategory key={index} {...category} />
            ))}
          </div>
        </section>

        {/* Sharing Details */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Compartilhamento de Dados</h2>
          
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">Com quem compartilhamos?</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados são compartilhados exclusivamente com instituições financeiras 
                parceiras (bancos) para viabilizar a análise e contratação de empréstimo consignado.
              </p>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-card-foreground mb-2">Bancos Parceiros</h3>
              <div className="flex flex-wrap gap-2">
                {['Facta', 'BMG', 'Pan', 'Mercantil', 'C6', 'V8', 'Prata'].map((banco) => (
                  <span 
                    key={banco}
                    className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                  >
                    {banco}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-card-foreground mb-2">Por que compartilhamos?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Verificar elegibilidade para crédito consignado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Processar a contratação do empréstimo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                  <span>Realizar o depósito na sua conta bancária</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Practices */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Práticas de Segurança</h2>
          
          <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Criptografia TLS/SSL</p>
                <p className="text-sm text-muted-foreground">
                  Todos os dados são transmitidos de forma segura usando criptografia de ponta a ponta.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Armazenamento Seguro</p>
                <p className="text-sm text-muted-foreground">
                  Dados sensíveis são armazenados com criptografia em repouso em servidores protegidos.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Proteção contra Senhas Vazadas</p>
                <p className="text-sm text-muted-foreground">
                  Verificamos se sua senha foi exposta em vazamentos conhecidos (HIBP Check).
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Controle de Acesso (RLS)</p>
                <p className="text-sm text-muted-foreground">
                  Políticas de segurança garantem que você só acessa seus próprios dados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Rights */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Seus Direitos (LGPD)</h2>
          
          <div className="bg-card rounded-xl p-5 shadow-card">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-medium text-card-foreground">Acesso</p>
                  <p className="text-muted-foreground">Solicitar uma cópia dos seus dados pessoais</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-medium text-card-foreground">Correção</p>
                  <p className="text-muted-foreground">Atualizar informações incorretas ou incompletas</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-medium text-card-foreground">Exclusão</p>
                  <p className="text-muted-foreground">Solicitar a remoção completa dos seus dados (direito ao esquecimento)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <p className="font-medium text-card-foreground">Portabilidade</p>
                  <p className="text-muted-foreground">Receber seus dados em formato estruturado</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">5</span>
                <div>
                  <p className="font-medium text-card-foreground">Revogação</p>
                  <p className="text-muted-foreground">Retirar o consentimento para uso dos dados</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* How to Delete */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Como Excluir Seus Dados</h2>
          
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <Trash2 size={20} className="text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Exclusão permanente</p>
                <p className="text-sm text-muted-foreground">
                  Você pode solicitar a exclusão completa da sua conta e dados a qualquer momento.
                </p>
              </div>
            </div>
            
            <div className="bg-background/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-card-foreground"><strong>Passo 1:</strong> Acesse seu Perfil no app</p>
              <p className="text-card-foreground"><strong>Passo 2:</strong> Role até "Conta"</p>
              <p className="text-card-foreground"><strong>Passo 3:</strong> Toque em "Excluir minha conta"</p>
              <p className="text-card-foreground"><strong>Passo 4:</strong> Confirme a exclusão</p>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              A exclusão é irreversível. Todos os seus dados serão permanentemente removidos 
              dos nossos servidores em até 30 dias.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Contato</h2>
          
          <div className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-sm text-muted-foreground mb-4">
              Para dúvidas sobre privacidade e segurança de dados, entre em contato:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-card-foreground">
                <strong>Empresa:</strong> I9 Consultoria e Negócios LTDA
              </p>
              <p className="text-card-foreground">
                <strong>E-mail:</strong> privacidade@upclt.com.br
              </p>
              <p className="text-card-foreground">
                <strong>WhatsApp:</strong> Através do app (botão "Converse com a gente")
              </p>
            </div>
          </div>
        </section>

        {/* Last Update */}
        <p className="text-center text-xs text-muted-foreground mb-6">
          Última atualização: Fevereiro de 2026
        </p>

        <LegalFooter className="mt-8" />
      </main>
    </PageTransition>
  );
}
