import { useEffect, useState } from 'react';
import { ChevronsLeft, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const bankLogos = [
  { id: 'facta', name: 'FACTA', logo: '/logos/facta.png' },
  { id: 'c6', name: 'C6 Bank', logo: '/logos/c6.png' },
  { id: 'pan', name: 'Banco Pan', logo: '/logos/pan.png' },
  { id: 'bmg', name: 'BMG', logo: '/logos/bmg.png' },
  { id: 'mercantil', name: 'Mercantil', logo: '/logos/mercantil.png' },
  { id: 'prata', name: 'Prata', logo: '/logos/prata.png' },
];

interface LoadingScreenProps {
  variant: 'searching' | 'verifying';
  message?: string;
}

export function LoadingScreen({ variant, message }: LoadingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bankLogos.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 95));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'verifying') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6">
          <Wallet size={36} className="text-white" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground text-center mb-2">
          Verificando a autorização de consulta dos dados
        </h2>
        <p className="text-muted-foreground text-center text-sm max-w-xs">
          Todo o processo pode levar um tempo, vamos entrar em contato assim que o processo for finalizado.
        </p>

        <div className="mt-8">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
      {/* Animated logo */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
        <div 
          className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin-slow"
          style={{ animationDuration: '1.5s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ChevronsLeft size={40} className="text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Bank logos carousel */}
      <div className="flex gap-3 mb-8 overflow-hidden">
        {bankLogos.slice(currentIndex, currentIndex + 4).concat(
          bankLogos.slice(0, Math.max(0, (currentIndex + 4) - bankLogos.length))
        ).map((bank, index) => (
          <div
            key={`${bank.id}-${index}`}
            className={cn(
              'w-16 h-16 rounded-xl flex items-center justify-center p-2 transition-all duration-300',
              index === 1 ? 'bg-white scale-110' : 'bg-white/80 scale-100'
            )}
          >
            <img 
              src={bank.logo} 
              alt={bank.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white text-center">
        {message || 'Buscando as melhores taxas...'}
      </h2>
    </div>
  );
}