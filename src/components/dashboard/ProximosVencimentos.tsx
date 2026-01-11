import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreditCard, Repeat, Calendar, ChevronRight, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export interface VencimentoItem {
  id: string;
  tipo: 'parcela' | 'assinatura';
  nome: string;
  data: Date;
  valor: number;
  isUrgent: boolean;
}

interface ProximosVencimentosProps {
  items: VencimentoItem[];
  isLoading?: boolean;
  limit?: number;
  showViewAll?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatVencimentoDate = (date: Date) => {
  if (isToday(date)) return 'Hoje';
  if (isTomorrow(date)) return 'Amanhã';
  return format(date, "EEEE, d", { locale: ptBR });
};

export function ProximosVencimentos({ 
  items, 
  isLoading, 
  limit = 5, 
  showViewAll = true 
}: ProximosVencimentosProps) {
  const displayItems = items.slice(0, limit);
  const hasMore = items.length > limit;

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Próximos 7 Dias</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Próximos 7 Dias</h2>
          {items.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </Badge>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <PartyPopper className="h-12 w-12 text-green-400/50 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Nenhum vencimento nos próximos 7 dias 🎉
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  item.isUrgent 
                    ? 'bg-amber-500/10 border border-amber-500/20' 
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.tipo === 'parcela'
                      ? 'bg-primary/10'
                      : 'bg-purple-500/10'
                  }`}
                >
                  {item.tipo === 'parcela' ? (
                    <CreditCard className="h-5 w-5 text-primary" />
                  ) : (
                    <Repeat className="h-5 w-5 text-purple-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{item.nome}</p>
                  <p className={`text-sm capitalize ${item.isUrgent ? 'text-amber-400' : 'text-muted-foreground'}`}>
                    {formatVencimentoDate(item.data)}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={
                    item.tipo === 'parcela'
                      ? 'bg-primary/10 text-primary border-primary/30 hidden sm:inline-flex'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hidden sm:inline-flex'
                  }
                >
                  {item.tipo === 'parcela' ? 'Parcela' : 'Assinatura'}
                </Badge>

                <span className={`font-semibold whitespace-nowrap ${item.isUrgent ? 'text-amber-400' : 'text-foreground'}`}>
                  {formatCurrency(item.valor)}
                </span>
              </div>
            ))}
          </div>

          {showViewAll && hasMore && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link to="/parcelamentos">
                  Ver todos os vencimentos
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
