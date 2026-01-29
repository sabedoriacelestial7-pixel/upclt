import { ChevronLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showChat?: boolean;
  variant?: 'light' | 'transparent';
  className?: string;
  rightElement?: React.ReactNode;
  progress?: number; // 0 to 100
}

export function Header({ 
  title, 
  showBack = true, 
  showChat = false,
  variant = 'light',
  className, 
  rightElement,
  progress 
}: HeaderProps) {
  const navigate = useNavigate();
  const isLight = variant === 'light';

  return (
    <header className={cn(
      'sticky top-0 z-40',
      isLight ? 'bg-[#f5f5f5]' : 'bg-transparent',
      className
    )}>
      {/* Progress bar */}
      {progress !== undefined && (
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}

      <div className="px-4 h-14 pt-[env(safe-area-inset-top)] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-[44px]">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className={cn(
                'p-2 -ml-2 rounded-full transition-colors active:scale-95 touch-manipulation',
                'min-w-[44px] min-h-[44px] flex items-center justify-center',
                isLight ? 'text-primary hover:bg-gray-100' : 'text-primary hover:bg-white/10'
              )}
            >
              <ChevronLeft size={28} strokeWidth={2} />
            </button>
          )}
        </div>

        {title && (
          <h1 className={cn(
            'text-lg font-semibold truncate absolute left-1/2 -translate-x-1/2',
            isLight ? 'text-foreground' : 'text-white'
          )}>
            {title}
          </h1>
        )}

        <div className="flex items-center gap-2 min-w-[44px] justify-end">
          {showChat && (
            <button
              className={cn(
                'p-2 rounded-full transition-colors active:scale-95 touch-manipulation',
                'min-w-[44px] min-h-[44px] flex items-center justify-center',
                isLight ? 'text-primary hover:bg-gray-100' : 'text-primary hover:bg-white/10'
              )}
            >
              <MessageSquare size={24} />
            </button>
          )}
          {rightElement}
        </div>
      </div>
    </header>
  );
}