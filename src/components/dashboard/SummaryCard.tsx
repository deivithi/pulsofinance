import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
  const content = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBgColor)}>
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
          'text-2xl font-bold mb-1',
          urgent ? 'text-amber-400' : 'text-foreground'
        )}
      >
        {value}
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
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  const cardClasses = cn(
    'glass-card rounded-2xl p-6 transition-all duration-200',
    (onClick || link) && 'cursor-pointer hover:scale-[1.02] hover:border-primary/30',
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
