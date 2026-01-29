import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function FloatingButton({ onClick, disabled, className }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'fixed bottom-24 right-5 w-14 h-14 rounded-full',
        'bg-primary hover:bg-primary/90',
        'flex items-center justify-center',
        'shadow-lg shadow-primary/30',
        'transition-all duration-200 active:scale-95 touch-manipulation',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <ArrowRight size={24} className="text-white" />
    </button>
  );
}