import { useState } from 'react';
import { Trash2, Shield, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/PageTransition';
import { Logo } from '@/components/Logo';
import { LegalFooter } from '@/components/LegalFooter';

export default function ExcluirContaPage() {
  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
            <Trash2 size={32} className="text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Exclusão de Conta e Dados
          </h1>
          <p className="text-muted-foreground">
            UpCLT - Crédito CLT sem burocracia
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Seu direito à exclusão de dados
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD), você tem o direito 
              de solicitar a exclusão completa da sua conta e de todos os dados pessoais 
              armazenados no aplicativo UpCLT.
            </p>
          </section>

          {/* Steps */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" />
              Como solicitar a exclusão
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  1
                </span>
                <div>
                  <p className="font-medium text-foreground">Acesse o aplicativo</p>
                  <p className="text-sm text-muted-foreground">
                    Faça login na sua conta no app UpCLT
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  2
                </span>
                <div>
                  <p className="font-medium text-foreground">Vá para o Perfil</p>
                  <p className="text-sm text-muted-foreground">
                    Toque no ícone de perfil no menu inferior do aplicativo
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                  3
                </span>
                <div>
                  <p className="font-medium text-foreground">Solicite a exclusão</p>
                  <p className="text-sm text-muted-foreground">
                    Role até encontrar a opção "Excluir minha conta" e confirme a exclusão
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* Data that will be deleted */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3">
              Dados que serão excluídos permanentemente:
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Dados pessoais (nome, e-mail, telefone, CPF)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Histórico de consultas de margem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Propostas e simulações realizadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Solicitações de contratação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>Sugestões e feedbacks enviados</span>
              </li>
            </ul>
          </section>

          {/* Retention notice */}
          <section className="bg-accent/50 rounded-xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Informações importantes
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• A exclusão é processada <strong>imediatamente</strong> após a confirmação</li>
              <li>• Esta ação é <strong>irreversível</strong> - todos os dados serão perdidos</li>
              <li>• Propostas já enviadas aos bancos parceiros podem ser mantidas por eles conforme suas próprias políticas</li>
              <li>• Você poderá criar uma nova conta a qualquer momento</li>
            </ul>
          </section>

          {/* Alternative contact */}
          <section className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-foreground mb-3">
              Não consegue acessar sua conta?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Se você não conseguir acessar sua conta para solicitar a exclusão, 
              entre em contato conosco por e-mail:
            </p>
            <a 
              href="mailto:contato@upclt.app?subject=Solicitação de exclusão de conta"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              contato@upclt.app
            </a>
          </section>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Acessar minha conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Legal Footer */}
        <LegalFooter className="mt-12" />
      </main>
    </PageTransition>
  );
}
