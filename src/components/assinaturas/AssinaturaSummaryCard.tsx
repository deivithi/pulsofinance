import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface AssinaturaSummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  loading?: boolean;
}

export function AssinaturaSummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
}: AssinaturaSummaryCardProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className="p-2.5 rounded-xl bg-purple-500/10">
          <Icon className="h-5 w-5 text-purple-400" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
