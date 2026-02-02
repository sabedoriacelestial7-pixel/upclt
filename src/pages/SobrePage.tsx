import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import welcomeHero from '@/assets/welcome-hero.png';

export default function SobrePage() {
  const navigate = useNavigate();

  const stats = [
    { value: '+50 mil', label: 'pessoas', description: 'já compararam taxas no UpCLT' },
    { value: '+R$ 100 milhões', label: 'em crédito', description: 'contratados com as melhores taxas' },
    { value: '10+', label: 'bancos parceiros', description: 'disputando para oferecer a melhor taxa' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col">
      {/* Header with back button */}
      <header className="relative z-10 pt-[env(safe-area-inset-top)] px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pb-32">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-2 mt-4 mb-6">
          <Logo size="sm" variant="light" />
          <h1 className="text-2xl font-bold text-foreground">Quem somos</h1>
        </div>

        {/* Description */}
        <p className="text-center text-muted-foreground leading-relaxed mb-8">
          Mais que um aplicativo, o UpCLT é a forma mais rápida e transparente de garantir seu{' '}
          <span className="text-primary font-semibold">empréstimo consignado CLT</span>{' '}
          com a{' '}
          <span className="text-primary font-semibold">menor taxa do mercado</span>.
        </p>

        {/* Hero Image with Circle Background */}
        <div className="relative flex justify-center mb-10">
          {/* Background circles */}
          <div className="absolute w-48 h-48 bg-primary/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-36 h-36 bg-primary/30 rounded-full top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2" />
          
          {/* Image */}
          <div className="relative z-10 w-52 h-52 rounded-full overflow-hidden border-4 border-background shadow-xl">
            <img
              src={welcomeHero}
              alt="Pessoa usando o UpCLT"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center"
              style={{ animation: `fade-in 0.5s ease-out ${0.2 + index * 0.15}s both` }}
            >
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-lg font-medium text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={() => navigate('/login')}
          className="w-full h-14 text-lg font-semibold rounded-full shadow-button hover:scale-[1.02] active:scale-[0.98] transition-transform"
          size="lg"
        >
          Vamos começar
        </Button>
      </div>
    </div>
  );
}
