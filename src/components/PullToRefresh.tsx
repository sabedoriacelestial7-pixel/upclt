import { useState, useRef, useCallback, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const THRESHOLD = 80; // pixels to trigger refresh
const MAX_PULL = 120;

export function PullToRefresh({ onRefresh, children, className, disabled = false }: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);
  
  const pullDistance = useMotionValue(0);
  const indicatorOpacity = useTransform(pullDistance, [0, THRESHOLD / 2], [0, 1]);
  const indicatorScale = useTransform(pullDistance, [0, THRESHOLD], [0.5, 1]);
  const rotation = useTransform(pullDistance, [0, MAX_PULL], [0, 360]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || refreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [disabled, refreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || disabled || refreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      isPulling.current = false;
      pullDistance.set(0);
      return;
    }
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      // Resistência ao puxar
      const resistance = 0.4;
      const distance = Math.min(diff * resistance, MAX_PULL);
      pullDistance.set(distance);
    }
  }, [disabled, refreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;
    
    const distance = pullDistance.get();
    
    if (distance >= THRESHOLD && !refreshing && !disabled) {
      setRefreshing(true);
      
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
    
    animate(pullDistance, 0, { type: 'spring', stiffness: 400, damping: 30 });
  }, [pullDistance, onRefresh, refreshing, disabled]);

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        style={{
          top: -40,
          y: pullDistance,
          opacity: indicatorOpacity,
          scale: indicatorScale,
        }}
      >
        <motion.div 
          className={cn(
            'w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg',
            refreshing && 'animate-spin'
          )}
          style={{ rotate: refreshing ? undefined : rotation }}
        >
          <RefreshCw size={20} className="text-primary-foreground" />
        </motion.div>
      </motion.div>
      
      {/* Content */}
      <motion.div style={{ y: pullDistance }}>
        {children}
      </motion.div>
    </div>
  );
}
