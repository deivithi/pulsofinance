import { useMemo } from 'react';
import {
    Lightbulb,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Calendar,
    Repeat,
    CreditCard,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
    id: string;
    tipo: 'alerta' | 'dica' | 'positivo' | 'info';
    titulo: string;
    descricao: string;
    icon: typeof TrendingUp;
    prioridade: number; // 1 = mais urgente
}

interface InsightsInteligentesProps {
    totalParcelas: number;
    totalAssinaturas: number;
    parcelamentosAtivos: number;
    assinaturasAtivas: number;
    proximoVencimentoDias?: number;
    evolucaoMensal?: Array<{ mes: string; parcelamentos: number; assinaturas: number }>;
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const tipoConfig = {
    alerta: {
        bg: 'bg-red-500/10 dark:bg-red-500/10',
        border: 'border-red-500/20',
        iconColor: 'text-red-500',
        labelBg: 'bg-red-500/10',
        labelColor: 'text-red-500',
        label: 'Alerta',
    },
    dica: {
        bg: 'bg-amber-500/10 dark:bg-amber-500/10',
        border: 'border-amber-500/20',
        iconColor: 'text-amber-500',
        labelBg: 'bg-amber-500/10',
        labelColor: 'text-amber-500',
        label: 'Dica',
    },
    positivo: {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
        border: 'border-emerald-500/20',
        iconColor: 'text-emerald-500',
        labelBg: 'bg-emerald-500/10',
        labelColor: 'text-emerald-500',
        label: 'Positivo',
    },
    info: {
        bg: 'bg-blue-500/10 dark:bg-blue-500/10',
        border: 'border-blue-500/20',
        iconColor: 'text-blue-500',
        labelBg: 'bg-blue-500/10',
        labelColor: 'text-blue-500',
        label: 'Info',
    },
};

export function InsightsInteligentes({
    totalParcelas,
    totalAssinaturas,
    parcelamentosAtivos,
    assinaturasAtivas,
    proximoVencimentoDias,
    evolucaoMensal = [],
}: InsightsInteligentesProps) {
    const insights = useMemo(() => {
        const result: Insight[] = [];
        const totalMensal = totalParcelas + totalAssinaturas;

        // 1. Alerta de comprometimento alto
        if (totalMensal > 5000) {
            result.push({
                id: 'high-spending',
                tipo: 'alerta',
                titulo: 'Gastos mensais elevados',
                descricao: `Seus compromissos somam ${formatCurrency(totalMensal)}/mês. Considere revisar quais são essenciais.`,
                icon: AlertTriangle,
                prioridade: 1,
            });
        }

        // 2. Proporção assinaturas vs parcelas
        if (totalAssinaturas > 0 && totalParcelas > 0) {
            const proporcaoAssinaturas = (totalAssinaturas / totalMensal) * 100;
            if (proporcaoAssinaturas > 40) {
                result.push({
                    id: 'subscription-ratio',
                    tipo: 'dica',
                    titulo: 'Assinaturas dominam seus gastos',
                    descricao: `${proporcaoAssinaturas.toFixed(0)}% dos seus gastos são de assinaturas recorrentes. Revise se todas estão sendo utilizadas.`,
                    icon: Repeat,
                    prioridade: 2,
                });
            }
        }

        // 3. Vencimento próximo
        if (proximoVencimentoDias !== undefined && proximoVencimentoDias <= 3) {
            result.push({
                id: 'due-soon',
                tipo: 'alerta',
                titulo: proximoVencimentoDias === 0 ? 'Vencimento hoje!' : `Vencimento em ${proximoVencimentoDias} dia${proximoVencimentoDias > 1 ? 's' : ''}`,
                descricao: 'Verifique se você tem saldo disponível para cobrir este pagamento.',
                icon: Calendar,
                prioridade: 1,
            });
        }

        // 4. Muitas assinaturas
        if (assinaturasAtivas > 5) {
            result.push({
                id: 'many-subscriptions',
                tipo: 'dica',
                titulo: `${assinaturasAtivas} assinaturas ativas`,
                descricao: 'Você tem várias assinaturas. Verifique se todas estão sendo utilizadas regularmente.',
                icon: Repeat,
                prioridade: 3,
            });
        }

        // 5. Sem parcelas ativas (positivo)
        if (parcelamentosAtivos === 0 && assinaturasAtivas > 0) {
            result.push({
                id: 'no-installments',
                tipo: 'positivo',
                titulo: 'Zero parcelamentos ativos!',
                descricao: 'Você não tem parcelas ativas. Mantenha esse hábito para evitar endividamento.',
                icon: TrendingDown,
                prioridade: 5,
            });
        }

        // 6. Tendência de gastos (se temos dados de evolução)
        if (evolucaoMensal.length >= 2) {
            const ultimo = evolucaoMensal[evolucaoMensal.length - 1];
            const penultimo = evolucaoMensal[evolucaoMensal.length - 2];
            const totalUltimo = (ultimo?.parcelamentos || 0) + (ultimo?.assinaturas || 0);
            const totalPenultimo = (penultimo?.parcelamentos || 0) + (penultimo?.assinaturas || 0);

            if (totalPenultimo > 0) {
                const variacao = ((totalUltimo - totalPenultimo) / totalPenultimo) * 100;

                if (variacao > 20) {
                    result.push({
                        id: 'spending-increase',
                        tipo: 'alerta',
                        titulo: `Gastos subiram ${variacao.toFixed(0)}%`,
                        descricao: `Seus gastos aumentaram de ${formatCurrency(totalPenultimo)} para ${formatCurrency(totalUltimo)} em relação ao mês anterior.`,
                        icon: TrendingUp,
                        prioridade: 2,
                    });
                } else if (variacao < -10) {
                    result.push({
                        id: 'spending-decrease',
                        tipo: 'positivo',
                        titulo: `Gastos reduziram ${Math.abs(variacao).toFixed(0)}%`,
                        descricao: `Seus gastos caíram de ${formatCurrency(totalPenultimo)} para ${formatCurrency(totalUltimo)}. Continue assim!`,
                        icon: TrendingDown,
                        prioridade: 4,
                    });
                }
            }
        }

        // 7. Poucos compromissos (positivo)
        if (totalMensal > 0 && totalMensal <= 1000) {
            result.push({
                id: 'low-spending',
                tipo: 'positivo',
                titulo: 'Gastos sob controle',
                descricao: `Seus compromissos mensais estão em ${formatCurrency(totalMensal)}. Saúde financeira boa!`,
                icon: TrendingDown,
                prioridade: 5,
            });
        }

        // 8. Muitos parcelamentos ativos
        if (parcelamentosAtivos > 5) {
            result.push({
                id: 'many-installments',
                tipo: 'dica',
                titulo: `${parcelamentosAtivos} parcelamentos ativos`,
                descricao: 'Evite acumular muitos parcelamentos simultâneos. Complete os atuais antes de assumir novos.',
                icon: CreditCard,
                prioridade: 3,
            });
        }

        // Se não há insights, mensagem padrão
        if (result.length === 0) {
            result.push({
                id: 'no-insights',
                tipo: 'info',
                titulo: 'Tudo certo por aqui!',
                descricao: 'Adicione mais dados para receber insights personalizados sobre seus gastos.',
                icon: Sparkles,
                prioridade: 10,
            });
        }

        // Ordenar por prioridade
        return result.sort((a, b) => a.prioridade - b.prioridade).slice(0, 4);
    }, [totalParcelas, totalAssinaturas, parcelamentosAtivos, assinaturasAtivas, proximoVencimentoDias, evolucaoMensal]);

    return (
        <div className="glass-card rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Insights Inteligentes</h3>
                    <p className="text-xs text-muted-foreground">Análise automática dos seus gastos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.map((insight, i) => {
                    const config = tipoConfig[insight.tipo];
                    const Icon = insight.icon;

                    return (
                        <div
                            key={insight.id}
                            className={cn(
                                'p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]',
                                config.bg,
                                config.border
                            )}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
                                    <Icon className={cn('h-4 w-4', config.iconColor)} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-foreground truncate">{insight.titulo}</span>
                                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0', config.labelBg, config.labelColor)}>
                                            {config.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.descricao}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
