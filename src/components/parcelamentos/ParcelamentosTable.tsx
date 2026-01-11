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

export function ParcelamentosTable({
  parcelamentos,
  loading,
  onEdit,
  onDelete,
  onMarkAsPaid,
}: ParcelamentosTableProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden">
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
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
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
                className="border-border/50 hover:bg-zinc-800/50 transition-colors"
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
  );
}
