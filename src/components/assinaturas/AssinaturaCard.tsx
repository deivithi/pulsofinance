import { Pencil, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Assinatura } from '@/hooks/useAssinaturas';
import { cn } from '@/lib/utils';

interface AssinaturaCardProps {
  assinatura: Assinatura;
  onEdit: (assinatura: Assinatura) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onCancel: (assinatura: Assinatura) => void;
}

const frequenciaLabels: Record<string, string> = {
  mensal: '/mês',
  trimestral: '/trimestre',
  semestral: '/semestre',
  anual: '/ano',
};

const statusStyles: Record<string, string> = {
  ativa: 'bg-green-500/20 text-green-400 border-green-500/30',
  pausada: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  cancelada: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

const statusLabels: Record<string, string> = {
  ativa: 'Ativa',
  pausada: 'Pausada',
  cancelada: 'Cancelada',
};

export function AssinaturaCard({
  assinatura,
  onEdit,
  onToggleStatus,
  onCancel,
}: AssinaturaCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const isPaused = assinatura.status === 'pausada';
  const isCancelled = assinatura.status === 'cancelada';

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-5 transition-all duration-300',
        'hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10',
        (isPaused || isCancelled) && 'opacity-60'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-foreground truncate pr-2">
          {assinatura.nome}
        </h3>
        <Badge
          variant="outline"
          className={cn('shrink-0', statusStyles[assinatura.status || 'ativa'])}
        >
          {statusLabels[assinatura.status || 'ativa']}
        </Badge>
      </div>

      {/* Value */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-foreground">
          {formatCurrency(assinatura.valor)}
        </span>
        <span className="text-muted-foreground ml-1">
          {frequenciaLabels[assinatura.frequencia] || '/mês'}
        </span>
      </div>

      {/* Category */}
      {assinatura.categoria && (
        <div className="mb-3">
          <Badge
            variant="outline"
            style={{
              backgroundColor: `${assinatura.categoria.cor}20`,
              borderColor: `${assinatura.categoria.cor}40`,
              color: assinatura.categoria.cor,
            }}
          >
            {assinatura.categoria.nome}
          </Badge>
        </div>
      )}

      {/* Next charge */}
      <p className="text-sm text-muted-foreground mb-4">
        Próxima cobrança: dia {assinatura.dia_cobranca}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(assinatura)}
          className="flex-1"
          disabled={isCancelled}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Editar
        </Button>
        
        {!isCancelled && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(assinatura.id, assinatura.status || 'ativa')}
            className="flex-1"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4 mr-1" />
                Ativar
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pausar
              </>
            )}
          </Button>
        )}

        {!isCancelled && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onCancel(assinatura)}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
