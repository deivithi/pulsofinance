import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subInfo?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
  link?: string;
  isLoading?: boolean;
  className?: string;
  urgent?: boolean;
}

/**
 * Extrai o número de uma string formatada como moeda.
 * Ex: "R$ 2.450,00" → 2450
 */
function extractNumber(val: string | number): number | null {
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Formata um número de volta para a mesma formatação do value original.
 * Tenta manter R$, separadores de milhares, etc.
 */
function formatAnimatedValue(originalValue: string | number, animatedNum: number): string {
  if (typeof originalValue === 'number') return String(animatedNum);

  // Se é moeda brasileira
  if (originalValue.includes('R$')) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(animatedNum);
  }

  return String(animatedNum);
}

export function SummaryCard({
  title,
  value,
  subInfo,
  icon: Icon,
  iconColor = 'text-primary',
  iconBgColor = 'bg-primary/10',
  trend,
  onClick,
  link,
  isLoading,
  className,
  urgent,
}: SummaryCardProps) {
  // Animação do contador
  const numericValue = extractNumber(value);
  const animatedValue = useAnimatedCounter(numericValue ?? 0, 1200, !isLoading && numericValue !== null);
  const displayValue = numericValue !== null ? formatAnimatedValue(value, animatedValue) : value;

  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
          iconBgColor
        )}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive
                ? 'text-red-400 bg-red-500/10'
                : 'text-green-400 bg-green-500/10'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p
        className={cn(
          'text-2xl font-bold mb-1 tabular-nums transition-colors duration-300',
          urgent ? 'text-amber-400' : 'text-foreground'
        )}
      >
        {displayValue}
      </p>
      {subInfo && (
        <p className={cn('text-sm', urgent ? 'text-amber-400/80' : 'text-muted-foreground')}>
          {subInfo}
        </p>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className={cn('glass-card rounded-2xl p-6', className)}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-10 rounded-lg skeleton-shimmer" />
        </div>
        <Skeleton className="h-4 w-24 mb-2 skeleton-shimmer" />
        <Skeleton className="h-8 w-32 mb-2 skeleton-shimmer" />
        <Skeleton className="h-3 w-20 skeleton-shimmer" />
      </div>
    );
  }

  const cardClasses = cn(
    'glass-card rounded-2xl p-6 transition-all duration-300 group',
    (onClick || link) && 'cursor-pointer hover:scale-[1.02] hover:border-primary/30 hover:shadow-primary/10 hover:shadow-lg',
    className
  );

  if (link) {
    return (
      <Link to={link} className={cardClasses}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className={cardClasses}>
        {content}
      </div>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
