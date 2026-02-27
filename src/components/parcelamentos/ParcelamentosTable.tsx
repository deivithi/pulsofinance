import { CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Parcelamento } from '@/hooks/useParcelamentos';

interface ParcelamentosTableProps {
  parcelamentos: Parcelamento[];
  loading?: boolean;
  onEdit: (parcelamento: Parcelamento) => void;
  onDelete: (parcelamento: Parcelamento) => void;
  onMarkAsPaid: (parcelamento: Parcelamento) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const statusConfig: Record<string, { label: string; className: string }> = {
  ativo: { label: 'Ativo', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  quitado: { label: 'Quitado', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  cancelado: { label: 'Cancelado', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
};

// Mobile card view for each parcelamento
function MobileCard({
  parcelamento,
  onEdit,
  onDelete,
  onMarkAsPaid,
}: {
  parcelamento: Parcelamento;
  onEdit: () => void;
  onDelete: () => void;
  onMarkAsPaid: () => void;
}) {
  const progress = (parcelamento.parcelas_pagas / parcelamento.total_parcelas) * 100;
  const status = statusConfig[parcelamento.status] || statusConfig.ativo;
  const canMarkAsPaid =
    parcelamento.status === 'ativo' &&
    parcelamento.parcelas_pagas < parcelamento.total_parcelas;

  return (
    <div className="glass-card rounded-xl p-4 space-y-3 transition-all duration-200 hover:shadow-lg">
      {/* Header: nome + status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight">
          {parcelamento.descricao}
        </h3>
        <Badge variant="outline" className={`${status.className} shrink-0 text-xs`}>
          {status.label}
        </Badge>
      </div>

      {/* Valor + Categoria */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-foreground tabular-nums">
          {formatCurrency(parcelamento.valor_parcela)}
        </span>
        {parcelamento.categoria ? (
          <Badge
            variant="outline"
            className="text-xs"
            style={{
              backgroundColor: `${parcelamento.categoria.cor}20`,
              borderColor: `${parcelamento.categoria.cor}50`,
              color: parcelamento.categoria.cor,
            }}
          >
            {parcelamento.categoria.nome}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">Sem categoria</span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {parcelamento.parcelas_pagas}/{parcelamento.total_parcelas} parcelas
          </span>
          <span>Dia {parcelamento.dia_vencimento}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 pt-1 border-t border-border/50">
        {canMarkAsPaid && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 text-xs gap-1"
            onClick={onMarkAsPaid}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Pagar</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ParcelamentosTable({
  parcelamentos,
  loading,
  onEdit,
  onDelete,
  onMarkAsPaid,
}: ParcelamentosTableProps) {
  if (loading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="space-y-3 md:hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
        {/* Desktop skeleton */}
        <div className="hidden md:block glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Descrição</TableHead>
                <TableHead className="text-muted-foreground">Valor Parcela</TableHead>
                <TableHead className="text-muted-foreground">Progresso</TableHead>
                <TableHead className="text-muted-foreground">Vencimento</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-border/50">
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile: Card layout */}
      <div className="space-y-3 md:hidden">
        {parcelamentos.map((parcelamento) => (
          <MobileCard
            key={parcelamento.id}
            parcelamento={parcelamento}
            onEdit={() => onEdit(parcelamento)}
            onDelete={() => onDelete(parcelamento)}
            onMarkAsPaid={() => onMarkAsPaid(parcelamento)}
          />
        ))}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block glass-card rounded-2xl overflow-hidden overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Descrição</TableHead>
              <TableHead className="text-muted-foreground">Valor Parcela</TableHead>
              <TableHead className="text-muted-foreground">Progresso</TableHead>
              <TableHead className="text-muted-foreground">Vencimento</TableHead>
              <TableHead className="text-muted-foreground">Categoria</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcelamentos.map((parcelamento) => {
              const progress = (parcelamento.parcelas_pagas / parcelamento.total_parcelas) * 100;
              const status = statusConfig[parcelamento.status] || statusConfig.ativo;
              const canMarkAsPaid = parcelamento.status === 'ativo' && parcelamento.parcelas_pagas < parcelamento.total_parcelas;

              return (
                <TableRow
                  key={parcelamento.id}
                  className="border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {parcelamento.descricao}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {formatCurrency(parcelamento.valor_parcela)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="w-24 h-2" />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {parcelamento.parcelas_pagas}/{parcelamento.total_parcelas}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    Dia {parcelamento.dia_vencimento}
                  </TableCell>
                  <TableCell>
                    {parcelamento.categoria ? (
                      <Badge
                        variant="outline"
                        style={{
                          backgroundColor: `${parcelamento.categoria.cor}20`,
                          borderColor: `${parcelamento.categoria.cor}50`,
                          color: parcelamento.categoria.cor,
                        }}
                      >
                        {parcelamento.categoria.nome}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {canMarkAsPaid && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          onClick={() => onMarkAsPaid(parcelamento)}
                          title="Marcar parcela como paga"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(parcelamento)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(parcelamento)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
