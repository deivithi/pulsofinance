import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DadoCategoria {
  categoria: string;
  valor: number;
  cor: string;
}

interface GastosPorCategoriaChartProps {
  dados: DadoCategoria[];
  isLoading?: boolean;
  titulo?: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export function GastosPorCategoriaChart({
  dados,
  isLoading = false,
  titulo = 'Gastos por Categoria',
}: GastosPorCategoriaChartProps) {
  // Sort by value descending and limit to 8
  const sortedData = useMemo(() => {
    return [...dados]
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);
  }, [dados]);

  const total = useMemo(() => {
    return dados.reduce((sum, item) => sum + item.valor, 0);
  }, [dados]);

  const maxValue = useMemo(() => {
    if (sortedData.length === 0) return 0;
    return Math.max(...sortedData.map((d) => d.valor));
  }, [sortedData]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-full" style={{ width: `${100 - i * 15}%` }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedData.length === 0 || total === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum gasto por categoria para exibir</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Adicione categorias aos seus itens para ver a distribuição
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-foreground">{titulo}</h3>
      </div>

      <TooltipProvider>
        <div className="space-y-4">
          {sortedData.map((item, index) => {
            const percentage = total > 0 ? (item.valor / total) * 100 : 0;
            const barWidth = maxValue > 0 ? (item.valor / maxValue) * 100 : 0;

            return (
              <Tooltip key={`${item.categoria}-${index}`}>
                <TooltipTrigger asChild>
                  <div 
                    className="group cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Category name and value */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground truncate max-w-[50%]">
                        {item.categoria}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(item.valor)}{' '}
                        <span className="text-xs">({percentage.toFixed(0)}%)</span>
                      </span>
                    </div>

                    {/* Bar container */}
                    <div className="relative h-8 rounded-md bg-muted/30 overflow-hidden">
                      {/* Animated bar */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-md transition-all duration-500 ease-out group-hover:brightness-110"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: item.cor || 'hsl(var(--primary))',
                          boxShadow: `0 0 20px ${item.cor}40`,
                        }}
                      />
                      {/* Shine effect */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-md opacity-30"
                        style={{
                          width: `${barWidth}%`,
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                        }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-card border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="font-medium">{item.categoria}</span>
                  </div>
                  <p className="text-foreground font-semibold">{formatCurrency(item.valor)}</p>
                  <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% do total</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Total footer */}
      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
