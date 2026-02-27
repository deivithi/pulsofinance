import { Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjecaoFuturaProps {
  projecao: Array<{
    mes: string;
    mesCompleto: string;
    total: number;
    parcelas: number;
    assinaturas: number;
  }>;
  isLoading?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export function ProjecaoFutura({ projecao, isLoading }: ProjecaoFuturaProps) {
  const totalProjecao = projecao.reduce((sum, p) => sum + p.total, 0);

  if (isLoading) {
    return (
      <div className="rounded-2xl p-6 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (projecao.every(p => p.total === 0)) {
    return null;
  }

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Projeção dos Próximos 3 Meses</h2>
            <p className="text-sm text-muted-foreground">Baseado nos compromissos ativos</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-muted-foreground">Total projetado</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalProjecao)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projecao.map((mes, index) => (
          <div
            key={mes.mes}
            className="glass-card rounded-xl p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground capitalize">
                {mes.mesCompleto}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-3 tabular-nums">
              {formatCurrency(mes.total)}
            </p>

            {/* Barra de proporção parcelas vs assinaturas */}
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-3">
              <div className="h-full flex">
                {mes.parcelas > 0 && (
                  <div
                    className="h-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${(mes.parcelas / mes.total) * 100}%` }}
                  />
                )}
                {mes.assinaturas > 0 && (
                  <div
                    className="h-full bg-purple-400 transition-all duration-700 ease-out"
                    style={{ width: `${(mes.assinaturas / mes.total) * 100}%` }}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {formatCurrency(mes.parcelas)}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                {formatCurrency(mes.assinaturas)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile total */}
      <div className="mt-4 pt-4 border-t border-border sm:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total projetado</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalProjecao)}</p>
        </div>
      </div>
    </div>
  );
}
