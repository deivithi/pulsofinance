import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ParcelamentoCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  loading?: boolean;
}

export function ParcelamentoCard({ title, value, icon: Icon, loading }: ParcelamentoCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-indigo-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{value}</p>
          )}
        </div>
      </div>
    </div>
  );
}
