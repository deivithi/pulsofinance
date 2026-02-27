import { useState, useRef, useEffect } from 'react';
import { Bell, X, CreditCard, Repeat, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface NotificationItem {
    id: string;
    tipo: 'parcela' | 'assinatura';
    nome: string;
    data: Date;
    valor: number;
}

interface NotificationBellProps {
    items: NotificationItem[];
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

const formatDate = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    const days = differenceInDays(date, new Date());
    if (days < 0) return `${Math.abs(days)}d atrás`;
    return format(date, "d 'de' MMM", { locale: ptBR });
};

export function NotificationBell({ items }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const urgentCount = items.filter(item => {
        const days = differenceInDays(item.data, new Date());
        return days <= 3;
    }).length;

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Botão do sino */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'relative p-2 rounded-lg transition-all duration-200',
                    'hover:bg-muted/50 text-muted-foreground hover:text-foreground',
                    isOpen && 'bg-muted/50 text-foreground'
                )}
                aria-label={`Notificações: ${urgentCount} vencimentos próximos`}
            >
                <Bell className="h-5 w-5" />
                {urgentCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {urgentCount > 9 ? '9+' : urgentCount}
                    </span>
                )}
            </button>

            {/* Dropdown de notificações */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto glass-card rounded-xl border border-border shadow-xl z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h3 className="text-sm font-semibold text-foreground">Vencimentos</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Itens */}
                    {items.length === 0 ? (
                        <div className="p-6 text-center">
                            <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Nenhum vencimento próximo</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {items.slice(0, 8).map((item) => {
                                const daysUntil = differenceInDays(item.data, new Date());
                                const isUrgent = daysUntil <= 1;
                                const isWarning = daysUntil <= 3 && daysUntil > 1;

                                return (
                                    <div
                                        key={`${item.tipo}-${item.id}`}
                                        className={cn(
                                            'flex items-center gap-3 p-3 transition-colors hover:bg-muted/30',
                                            isUrgent && 'bg-red-500/5',
                                            isWarning && 'bg-amber-500/5'
                                        )}
                                    >
                                        <div className={cn(
                                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                            item.tipo === 'parcela' ? 'bg-primary/10' : 'bg-purple-500/10'
                                        )}>
                                            {item.tipo === 'parcela' ? (
                                                <CreditCard className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Repeat className="h-4 w-4 text-purple-400" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {item.nome}
                                            </p>
                                            <p className={cn(
                                                'text-xs',
                                                isUrgent ? 'text-red-400 font-medium' : 'text-muted-foreground'
                                            )}>
                                                {formatDate(item.data)}
                                                {isUrgent && ' ⚠️'}
                                            </p>
                                        </div>

                                        <span className={cn(
                                            'text-sm font-semibold tabular-nums flex-shrink-0',
                                            isUrgent ? 'text-red-400' : 'text-foreground'
                                        )}>
                                            {formatCurrency(item.valor)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer com total */}
                    {items.length > 0 && (
                        <div className="p-3 border-t border-border bg-muted/20">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    Total ({items.length} {items.length === 1 ? 'item' : 'itens'})
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    {formatCurrency(items.reduce((sum, item) => sum + item.valor, 0))}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
